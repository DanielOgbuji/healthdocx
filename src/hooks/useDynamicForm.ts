// useDynamicForm.ts
import { useState, useEffect, useRef } from "react";
import { api } from "@/api/axios";
import { type ApiError } from "@/types/api.types";
import { toaster } from "@/components/ui/toaster";
import {
	updateNested,
	buildPayload,
	removeNested,
	insertNested,
	getNestedValue,
} from "@/utils/dynamicFormUtils";

export const useDynamicForm = (
	structuredData: string | Record<string, unknown>,
	recordId: string | undefined,
	ocrText: string | null
) => {
	const [formState, setFormState] = useState<{
		formData: Record<string, unknown>;
		labels: Record<string, string>;
	}>({
		formData: {},
		labels: {},
	});
	const { formData, labels } = formState;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [autoSaveStatus, setAutoSaveStatus] = useState("Saved");
	const [newlyAddedPath, setNewlyAddedPath] = useState<string[] | null>(null);
	const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
	const initialDataLoaded = useRef(false);

	const undoStack = useRef<
		Array<{ formData: Record<string, unknown>; labels: Record<string, string> }>
	>([]);
	const redoStack = useRef<
		Array<{ formData: Record<string, unknown>; labels: Record<string, string> }>
	>([]);

	const undoStackPushTimeout = useRef<number | null>(null);
	const pendingUndoState = useRef<{
		formData: Record<string, unknown>;
		labels: Record<string, string>;
	} | null>(null);

	const pushToUndoStack = (
		currentFormData: Record<string, unknown>,
		currentLabels: Record<string, string>
	) => {
		if (undoStackPushTimeout.current) {
			clearTimeout(undoStackPushTimeout.current);
		} else {
			// This is the first call in a potential sequence. Capture the state.
			pendingUndoState.current = {
				formData: JSON.parse(JSON.stringify(currentFormData)),
				labels: { ...currentLabels },
			};
		}

		undoStackPushTimeout.current = window.setTimeout(() => {
			if (pendingUndoState.current) {
				undoStack.current.push(pendingUndoState.current);
				if (undoStack.current.length > 100) undoStack.current.shift();
				redoStack.current = [];
			}
			undoStackPushTimeout.current = null;
			pendingUndoState.current = null;
		}, 50);
	};

	const undo = () => {
		if (undoStackPushTimeout.current) {
			clearTimeout(undoStackPushTimeout.current);
			undoStackPushTimeout.current = null;
			pendingUndoState.current = null;
		}

		if (undoStack.current.length === 0) return;
		const lastState = undoStack.current.pop();
		if (!lastState) return;

		setFormState((currentState) => {
			redoStack.current.push({
				formData: currentState.formData,
				labels: currentState.labels,
			});
			return lastState;
		});
	};

	const redo = () => {
		if (undoStackPushTimeout.current) {
			clearTimeout(undoStackPushTimeout.current);
			undoStackPushTimeout.current = null;
			pendingUndoState.current = null;
		}
		if (redoStack.current.length === 0) return;
		const nextState = redoStack.current.pop();
		if (!nextState) return;

		setFormState((currentState) => {
			undoStack.current.push({
				formData: currentState.formData,
				labels: currentState.labels,
			});
			return nextState;
		});
	};

	const toggleCollapse = (pathString: string) => {
		setCollapsedMap((prev) => ({
			...prev,
			[pathString]: !prev[pathString],
		}));
	};

	const isCollapsed = (pathString: string) => collapsedMap[pathString] ?? false;

	useEffect(() => {
		if (!recordId) return;

		const autoSavedFormData = sessionStorage.getItem(
			`autosave_form_${recordId}`
		);
		const autoSavedLabels = sessionStorage.getItem(
			`autosave_labels_${recordId}`
		);

		if (autoSavedFormData && autoSavedLabels) {
			setFormState({
				formData: JSON.parse(autoSavedFormData),
				labels: JSON.parse(autoSavedLabels),
			});
		} else {
			try {
				let parsedData: Record<string, unknown>;
				if (typeof structuredData === "string") {
					const cleanData = structuredData
						.replace(/^```json\n/, "")
						.replace(/\n```$/, "");
					parsedData = JSON.parse(cleanData);
				} else {
					parsedData = structuredData as Record<string, unknown>;
				}
				setFormState({ formData: parsedData, labels: {} });
			} catch (e) {
				console.error("Error parsing structuredData:", e);
				setError("Error parsing data. Please check the format.");
			}
		}
		initialDataLoaded.current = true;
	}, [structuredData, recordId]);

	useEffect(() => {
		if (!initialDataLoaded.current || !recordId) return;

		setAutoSaveStatus("Saving...");
		const handler = setTimeout(() => {
			sessionStorage.setItem(
				`autosave_form_${recordId}`,
				JSON.stringify(formState.formData)
			);
			sessionStorage.setItem(
				`autosave_labels_${recordId}`,
				JSON.stringify(formState.labels)
			);
			setAutoSaveStatus("Saved");
		}, 500);

		return () => clearTimeout(handler);
	}, [formState, recordId]);

	const generateUniqueKey = (path: string[]) => {
		const base = path.length > 0 ? path[path.length - 1] : "root";
		return `${base}_${Date.now()}`;
	};

	const handleFieldChange = (path: string[], value: string) => {
		setFormState((prevState) => {
			const currentValue = getNestedValue(prevState.formData, path);
			const normalizedCurrentValue =
				currentValue === null || currentValue === undefined
					? ""
					: String(currentValue);
			const normalizedNewValue =
				value === null || value === undefined ? "" : String(value);

			if (normalizedCurrentValue === normalizedNewValue) {
				return prevState;
			}

			const newFormData = updateNested({ ...prevState.formData }, path, value);
			const newState = { ...prevState, formData: newFormData };

			if (
				JSON.stringify(prevState.formData) === JSON.stringify(newState.formData)
			) {
				return prevState;
			}

			pushToUndoStack(prevState.formData, prevState.labels);
			return newState;
		});
	};

	const handleLabelChange = (path: string, label: string) => {
		setFormState((prevState) => {
			if (prevState.labels[path] === label) {
				return prevState;
			}

			const newLabels = { ...prevState.labels, [path]: label };
			const newState = { ...prevState, labels: newLabels };

			if (JSON.stringify(prevState.labels) === JSON.stringify(newState.labels)) {
				return prevState;
			}

			pushToUndoStack(prevState.formData, prevState.labels);
			return newState;
		});
	};

	const handleAddSection = (parentPath: string[]) => {
		setFormState((prevState) => {
			const newKey = generateUniqueKey(parentPath);
			const parentObject =
				parentPath.length === 0
					? prevState.formData
					: (getNestedValue(prevState.formData, parentPath) as Record<
							string,
							unknown
					  >);
			const insertPosition = parentObject
				? Object.keys(parentObject).length
				: 0;
			const newFormData = insertNested(
				{ ...prevState.formData },
				parentPath,
				newKey,
				{},
				insertPosition
			);
			const newLabels = {
				...prevState.labels,
				[[...parentPath, newKey].join("_")]: `New Section ${
					newKey.split("_")[1]
				}`,
			};
			setNewlyAddedPath([...parentPath, newKey]);

			const newState = { formData: newFormData, labels: newLabels };
			if (JSON.stringify(prevState) === JSON.stringify(newState)) {
				return prevState;
			}

			pushToUndoStack(prevState.formData, prevState.labels);
			return newState;
		});
	};

	const handleAddField = (parentPath: string[]) => {
		setFormState((prevState) => {
			const newKey = generateUniqueKey(parentPath);
			const newFormData = insertNested(
				{ ...prevState.formData },
				parentPath,
				newKey,
				"",
				0
			);
			const newLabels = {
				...prevState.labels,
				[[...parentPath, newKey].join("_")]: `New Field ${
					newKey.split("_")[1]
				}`,
			};

			const newState = { formData: newFormData, labels: newLabels };
			if (JSON.stringify(prevState) === JSON.stringify(newState)) {
				return prevState;
			}

			pushToUndoStack(prevState.formData, prevState.labels);
			return newState;
		});
	};

	const handleMoveItem = (fromPath: string[], toPath: string[]) => {
		setFormState((prevState) => {
			const itemKey = fromPath[fromPath.length - 1];
			const sourcePath = fromPath.slice(0, -1);
			const targetPathString = toPath.join("_");

			if (
				sourcePath.join("_") === targetPathString ||
				targetPathString.startsWith(fromPath.join("_"))
			) {
				return prevState;
			}

			// --- FormData Calculation ---
			const itemValue = getNestedValue(prevState.formData, fromPath);
			if (itemValue === undefined) return prevState;

			const without = removeNested(prevState.formData, fromPath);
			const targetValue = getNestedValue(without, toPath);

			let toParentPath: string[];
			let insertIndex: number;

			if (toPath.length === 0) {
				toParentPath = [];
				insertIndex = Object.keys(without).length;
			} else if (
				typeof targetValue === "object" &&
				targetValue !== null &&
				!Array.isArray(targetValue)
			) {
				toParentPath = toPath;
				insertIndex = Object.keys(targetValue).length;
			} else {
				toParentPath = toPath.slice(0, -1);
				const parentOfTarget = getNestedValue(without, toParentPath) as
					| Record<string, unknown>
					| undefined;
				const toItemKey = toPath[toPath.length - 1];
				let keys: string[] = [];
				if (
					parentOfTarget &&
					typeof parentOfTarget === "object" &&
					!Array.isArray(parentOfTarget)
				) {
					keys = Object.keys(parentOfTarget);
				}
				insertIndex = keys.indexOf(toItemKey);
				if (insertIndex === -1) insertIndex = keys.length;
			}

			const newFormData = insertNested(
				without,
				toParentPath,
				itemKey,
				itemValue,
				insertIndex
			);

			// --- Labels Calculation ---
			const newLabels = { ...prevState.labels };
			const oldPathStr = fromPath.join("_");
			const newPathStr = [...toParentPath, itemKey].join("_");

			// Move the label for the item itself
			if (newLabels[oldPathStr]) {
				newLabels[newPathStr] = newLabels[oldPathStr];
				delete newLabels[oldPathStr];
			}

			// Move labels for all children of the item
			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(`${oldPathStr}_`)) {
					const newKey = key.replace(`${oldPathStr}_`, `${newPathStr}_`);
					newLabels[newKey] = newLabels[key];
					delete newLabels[key];
				}
			});

			const newState = { formData: newFormData, labels: newLabels };
			if (JSON.stringify(prevState) === JSON.stringify(newState)) {
				return prevState;
			}

			pushToUndoStack(prevState.formData, prevState.labels);
			return newState;
		});
	};

	const handleRemoveFieldOrSection = (path: string[]) => {
		setFormState((prevState) => {
			const newFormData = removeNested({ ...prevState.formData }, path);
			const newLabels = { ...prevState.labels };
			const pathString = path.join("_");
			delete newLabels[pathString];
			const prefix = `${pathString}_`;
			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(prefix)) {
					delete newLabels[key];
				}
			});

			const newState = { formData: newFormData, labels: newLabels };
			if (JSON.stringify(prevState) === JSON.stringify(newState)) {
				return prevState;
			}

			pushToUndoStack(prevState.formData, prevState.labels);
			return newState;
		});
	};

	const handleBulkDelete = (paths: Set<string>) => {
		setFormState((prevState) => {
			let newFormData = { ...prevState.formData };
			const newLabels = { ...prevState.labels };
			paths.forEach((pathString) => {
				const path = pathString.split("_");
				newFormData = removeNested(newFormData, path);
				delete newLabels[pathString];
				const prefix = `${pathString}_`;
				Object.keys(newLabels).forEach((key) => {
					if (key.startsWith(prefix)) {
						delete newLabels[key];
					}
				});
			});

			const newState = { formData: newFormData, labels: newLabels };
			if (JSON.stringify(prevState) === JSON.stringify(newState)) {
				return prevState;
			}

			pushToUndoStack(prevState.formData, prevState.labels);
			return newState;
		});
	};

	const handleBulkMove = (paths: Set<string>, destinationPath: string[]) => {
		setFormState((prevState) => {
			let newFormData = { ...prevState.formData };
			const newLabels = { ...prevState.labels };

			const sortedPaths = Array.from(paths).sort(
				(a, b) => a.length - b.length
			);

			for (const pathString of sortedPaths) {
				const fromPath = pathString.split("_");
				const parentPathStr = fromPath.slice(0, -1).join("_");
				if (paths.has(parentPathStr)) continue;

				const itemKey = fromPath[fromPath.length - 1];
				const itemValue = getNestedValue(newFormData, fromPath);
				if (itemValue === undefined) continue;

				const sourcePath = fromPath.slice(0, -1);
				if (sourcePath.join("_") === destinationPath.join("_")) continue;

				newFormData = removeNested(newFormData, fromPath);
				const toParent = getNestedValue(
					newFormData,
					destinationPath
				) as Record<string, unknown>;
				const insertIndex = toParent ? Object.keys(toParent).length : 0;
				newFormData = insertNested(
					newFormData,
					destinationPath,
					itemKey,
					itemValue,
					insertIndex
				);

				const oldPath = fromPath.join("_");
				const newPath = [...destinationPath, itemKey].join("_");
				if (newLabels[oldPath]) {
					newLabels[newPath] = newLabels[oldPath];
					delete newLabels[oldPath];
				}
				Object.keys(newLabels).forEach((key) => {
					if (key.startsWith(`${oldPath}_`)) {
						const newKey = key.replace(`${oldPath}_`, `${newPath}_`);
						newLabels[newKey] = newLabels[key];
						delete newLabels[key];
					}
				});
			}

			const newState = { formData: newFormData, labels: newLabels };
			if (JSON.stringify(prevState) === JSON.stringify(newState)) {
				return prevState;
			}

			pushToUndoStack(prevState.formData, prevState.labels);
			return newState;
		});
	};

	const handleSubmit = async () => {
		if (!recordId) {
			setError("Record ID is missing.");
			return;
		}
		setLoading(true);
		setError("");
		setSuccessMessage("");
		const payload = buildPayload(formData, labels, ocrText);
		try {
			const response = await api.patch(`/patient-records/${recordId}`, payload);
			if (response.status === 200) {
				setSuccessMessage("Form submitted successfully!");
				toaster.create({
					title: "Success",
					description: "Form submitted successfully!",
					type: "success",
					duration: 3000,
				});
			} else {
				setError(`Submission failed: ${response.data.error}`);
			}
		} catch (error: unknown) {
			const apiError = error as ApiError;
			if (apiError.response?.data?.error) {
				setError(`Submission failed: ${apiError.response.data.error}`);
			} else if (error instanceof Error) {
				setError(`Submission failed: ${error.message}`);
			} else {
				setError("Submission failed: An unknown error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		formData,
		labels,
		loading,
		error,
		successMessage,
		autoSaveStatus,
		handleFieldChange,
		handleLabelChange,
		handleSubmit,
		handleAddSection,
		handleAddField,
		handleMoveItem,
		handleRemoveFieldOrSection,
		handleBulkDelete,
		handleBulkMove,
		newlyAddedPath,
		setNewlyAddedPath,
		undo,
		redo,
		isCollapsed,
		toggleCollapse,
	};
};
