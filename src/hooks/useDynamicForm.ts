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
	const [formData, setFormData] = useState<Record<string, unknown>>({});
	const [labels, setLabels] = useState<Record<string, string>>({});
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

	const pushToUndoStack = () => {
		undoStack.current.push({
			formData: { ...formData },
			labels: { ...labels },
		});
		if (undoStack.current.length > 100) undoStack.current.shift();
		redoStack.current = []; // Clear redo stack on new change
	};

	const undo = () => {
		if (undoStack.current.length === 0) return;
		const last = undoStack.current.pop();
		if (!last) return;
		redoStack.current.push({ formData, labels });
		setFormData(last.formData);
		setLabels(last.labels);
	};

	const redo = () => {
		if (redoStack.current.length === 0) return;
		const next = redoStack.current.pop();
		if (!next) return;
		undoStack.current.push({ formData, labels });
		setFormData(next.formData);
		setLabels(next.labels);
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
			setFormData(JSON.parse(autoSavedFormData));
			setLabels(JSON.parse(autoSavedLabels));
		} else {
			try {
				if (typeof structuredData === "string") {
					const cleanData = structuredData
						.replace(/^```json\n/, "")
						.replace(/\n```$/, "");
					const parsed = JSON.parse(cleanData);
					setFormData(parsed);
				} else {
					setFormData(structuredData as Record<string, unknown>);
				}
				setLabels({});
			} catch (e) {
				console.error("Error parsing structuredData:", e);
				setError("Error parsing data. Please check the format.");
			}
		}
		initialDataLoaded.current = true;
	}, [structuredData, recordId]);

	useEffect(() => {
		if (!initialDataLoaded.current) return;
		setAutoSaveStatus("Saving...");
		const handler = setTimeout(() => {
			if (recordId) {
				sessionStorage.setItem(
					`autosave_form_${recordId}`,
					JSON.stringify(formData)
				);
				sessionStorage.setItem(
					`autosave_labels_${recordId}`,
					JSON.stringify(labels)
				);
				setAutoSaveStatus("Saved");
			}
		}, 500);
		return () => clearTimeout(handler);
	}, [formData, labels, recordId]);

	const generateUniqueKey = (path: string[]) => {
		const base = path.length > 0 ? path[path.length - 1] : "root";
		return `${base}_${Date.now()}`;
	};

	const handleFieldChange = (path: string[], value: string) => {
		const currentValue = getNestedValue(formData, path);

		// Normalize null/undefined to empty string for comparison
		const normalizedCurrentValue = currentValue === null || currentValue === undefined ? "" : String(currentValue);
		const normalizedNewValue = value === null || value === undefined ? "" : String(value);

		if (normalizedCurrentValue !== normalizedNewValue) {
			pushToUndoStack();
			const newFormData = updateNested({ ...formData }, path, value);
			setFormData(newFormData);
		}
	};

	const handleLabelChange = (path: string, label: string) => {
		// Only push to undo stack if the label has actually changed
		if (labels[path] !== label) {
			pushToUndoStack();
			setLabels({ ...labels, [path]: label });
		}
	};

	const handleAddSection = (parentPath: string[]) => {
		pushToUndoStack();
		const newKey = generateUniqueKey(parentPath);
		const parentObject =
			parentPath.length === 0
				? formData
				: (getNestedValue(formData, parentPath) as Record<string, unknown>);
		const insertPosition = parentObject ? Object.keys(parentObject).length : 0;
		const newFormData = insertNested(
			{ ...formData },
			parentPath,
			newKey,
			{},
			insertPosition
		);
		setFormData(newFormData);
		const newLabels = {
			...labels,
			[[...parentPath, newKey].join("_")]: `New Section ${
				newKey.split("_")[1]
			}`,
		};
		setLabels(newLabels);
		setNewlyAddedPath([...parentPath, newKey]);
	};

	const handleAddField = (parentPath: string[]) => {
		pushToUndoStack();
		const newKey = generateUniqueKey(parentPath);
		const newFormData = insertNested(
			{ ...formData },
			parentPath,
			newKey,
			"",
			0
		);
		setFormData(newFormData);
		const newLabels = {
			...labels,
			[[...parentPath, newKey].join("_")]: `New Field ${newKey.split("_")[1]}`,
		};
		setLabels(newLabels);
	};

	const handleMoveItem = (fromPath: string[], toPath: string[]) => {
		pushToUndoStack();

		const itemKey = fromPath[fromPath.length - 1];
		const sourcePath = fromPath.slice(0, -1);
		const targetPathString = toPath.join("_");

		// Prevent circular nesting
		if (
			sourcePath.join("_") === toPath.join("_") ||
			targetPathString.startsWith(fromPath.join("_"))
		) {
			return;
		}

		setFormData((prevData) => {
			const itemValue = getNestedValue(prevData, fromPath);
			if (itemValue === undefined) return prevData;

			const without = removeNested(prevData, fromPath);
			const toParent = getNestedValue(without, toPath) as Record<
				string,
				unknown
			>;
			const insertIndex = toParent ? Object.keys(toParent).length : 0;

			return insertNested(without, toPath, itemKey, itemValue, insertIndex);
		});

		setLabels((prevLabels) => {
			const newLabels = { ...prevLabels };
			const oldPath = fromPath.join("_");
			const newPath = [...toPath, itemKey].join("_");

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

			return newLabels;
		});
	};

	const handleRemoveFieldOrSection = (path: string[]) => {
		pushToUndoStack();
		const newFormData = removeNested({ ...formData }, path);
		setFormData(newFormData);
		setLabels((prevLabels) => {
			const newLabels = { ...prevLabels };
			const pathString = path.join("_");
			delete newLabels[pathString];
			const prefix = `${pathString}_`;
			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(prefix)) {
					delete newLabels[key];
				}
			});
			return newLabels;
		});
	};

	const handleBulkDelete = (paths: Set<string>) => {
		pushToUndoStack();
		let newFormData = { ...formData };
		const newLabels = { ...labels };
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
		setFormData(newFormData);
		setLabels(newLabels);
	};

	const handleBulkMove = (paths: Set<string>, destinationPath: string[]) => {
		pushToUndoStack();
		let newFormData = { ...formData };
		const newLabels = { ...labels };
		const sortedPaths = Array.from(paths).sort((a, b) => a.length - b.length);
		for (const pathString of sortedPaths) {
			const fromPath = pathString.split("_");
			const parentPath = fromPath.slice(0, -1).join("_");
			if (paths.has(parentPath)) continue;
			const itemKey = fromPath[fromPath.length - 1];
			const itemValue = getNestedValue(newFormData, fromPath);
			if (itemValue === undefined) continue;
			const sourcePath = fromPath.slice(0, -1);
			if (sourcePath.join("_") === destinationPath.join("_")) continue;
			newFormData = removeNested(newFormData, fromPath);
			const toParent = getNestedValue(newFormData, destinationPath) as Record<
				string,
				unknown
			>;
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
		setFormData(newFormData);
		setLabels(newLabels);
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
