// useDynamicForm.ts
import { useState, useEffect, useRef } from "react";
import { api } from "../api/axios";
import { type ApiError } from "../types/api.types";
import { toaster } from "../components/ui/toaster";
import {
	updateNested,
	buildPayload,
	removeNested,
	insertNested,
	getNestedValue,
	PATH_SEPARATOR,
} from "../utils/dynamicFormUtils";

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

	// --- NEW HISTORY-BASED UNDO/REDO ---
	const history = useRef<Array<{ formData: Record<string, unknown>; labels: Record<string, string> }>>([]);
	const historyIndex = useRef(0);
	const [changesCount, setChangesCount] = useState(0);
    const isUndoingOrRedoing = useRef(false);
    const historyTimeout = useRef<number | null>(null);

	const undo = () => {
		if (historyIndex.current <= 0) return;
        isUndoingOrRedoing.current = true;
		historyIndex.current--;
		setFormState(history.current[historyIndex.current]);
		setChangesCount(historyIndex.current);
		toaster.create({
			title: "Action Undone",
			description: "You can click Ctrl + Y to redo.",
			type: "info",
			duration: 3000,
		});
	};

	const redo = () => {
		if (historyIndex.current >= history.current.length - 1) return;
        isUndoingOrRedoing.current = true;
		historyIndex.current++;
		setFormState(history.current[historyIndex.current]);
		setChangesCount(historyIndex.current);
		toaster.create({
			title: "Action Redone",
			description: "You can click Ctrl + Z to undo.",
			type: "info",
			duration: 3000,
		});
	};
    // --- END OF NEW UNDO/REDO ---

	const toggleCollapse = (pathString: string) => {
		setCollapsedMap((prev) => ({
			...prev,
			[pathString]: !prev[pathString],
		}));
	};

	const isCollapsed = (pathString: string) => collapsedMap[pathString] ?? false;

	useEffect(() => {
		if (!recordId) return;

		const autoSavedFormData = sessionStorage.getItem(`autosave_form_${recordId}`);
		const autoSavedLabels = sessionStorage.getItem(`autosave_labels_${recordId}`);

        let initialState;
		if (autoSavedFormData && autoSavedLabels) {
			initialState = {
				formData: JSON.parse(autoSavedFormData),
				labels: JSON.parse(autoSavedLabels),
			};
		} else {
			try {
				let parsedData: Record<string, unknown>;
				if (typeof structuredData === "string") {
					const cleanData = structuredData.replace(/^```json\n/, "").replace(/\n```$/, "");
					parsedData = JSON.parse(cleanData);
				} else {
					parsedData = structuredData as Record<string, unknown>;
				}
				initialState = { formData: parsedData, labels: {} };
			} catch (e) {
				console.error("Error parsing structuredData:", e);
				setError("Error parsing data. Please check the format.");
                initialState = { formData: {}, labels: {} };
			}
		}
        setFormState(initialState);
        history.current = [initialState];
        historyIndex.current = 0;
        setChangesCount(0);
		initialDataLoaded.current = true;
	}, [structuredData, recordId]);

	useEffect(() => {
		if (!initialDataLoaded.current || !recordId) return;

        // --- HISTORY RECORDING ---
        if (isUndoingOrRedoing.current) {
            isUndoingOrRedoing.current = false;
        } else {
            if (historyTimeout.current) {
                clearTimeout(historyTimeout.current);
            }
            historyTimeout.current = window.setTimeout(() => {
                const lastRecordedState = history.current[historyIndex.current];
                if (JSON.stringify(lastRecordedState) !== JSON.stringify(formState)) {
                    const newHistory = history.current.slice(0, historyIndex.current + 1);
                    newHistory.push(formState);
                    history.current = newHistory;
                    historyIndex.current = newHistory.length - 1;
                    setChangesCount(historyIndex.current);
                }
            }, 500);
        }

        // --- AUTOSAVE ---
		setAutoSaveStatus("Saving...");
		const autoSaveHandler = setTimeout(() => {
			sessionStorage.setItem(`autosave_form_${recordId}`, JSON.stringify(formState.formData));
			sessionStorage.setItem(`autosave_labels_${recordId}`, JSON.stringify(formState.labels));
			setAutoSaveStatus("Saved");
		}, 500);

		return () => {
            if (historyTimeout.current) clearTimeout(historyTimeout.current);
            clearTimeout(autoSaveHandler);
        }
	}, [formState, recordId]);

	const generateUniqueKey = (path: string[]) => {
		const base = path.length > 0 ? path[path.length - 1] : "root";
		return `${base}_${Date.now()}`;
	};

    // --- ACTION HANDLERS ---
	const handleFieldChange = (path: string[], value: string) => {
		setFormState((prevState) => {
			const currentValue = getNestedValue(prevState.formData, path);
			const normalizedCurrentValue = currentValue === null || currentValue === undefined ? "" : String(currentValue);
			const normalizedNewValue = value === null || value === undefined ? "" : String(value);
			if (normalizedCurrentValue === normalizedNewValue) return prevState;
			const newFormData = updateNested({ ...prevState.formData }, path, value);
			return { ...prevState, formData: newFormData };
		});
	};

	const handleLabelChange = (path: string, label: string) => {
		setFormState((prevState) => {
			if (prevState.labels[path] === label) return prevState;
			const newLabels = { ...prevState.labels, [path]: label };
			return { ...prevState, labels: newLabels };
		});
	};

	const handleAddSection = (parentPath: string[]) => {
		setFormState((prevState) => {
			const newKey = generateUniqueKey(parentPath);
			const parentObject = parentPath.length === 0 ? prevState.formData : (getNestedValue(prevState.formData, parentPath) as Record<string, unknown>);
			const insertPosition = parentObject ? Object.keys(parentObject).length : 0;
			const newFormData = insertNested({ ...prevState.formData }, parentPath, newKey, {}, insertPosition);
			const newLabels = { ...prevState.labels, [[...parentPath, newKey].join(PATH_SEPARATOR)]: `New Section ${newKey.split("_")[1]}` };
			setNewlyAddedPath([...parentPath, newKey]);
			return { formData: newFormData, labels: newLabels };
		});
	};

	const handleAddField = (parentPath: string[]) => {
		setFormState((prevState) => {
			const newKey = generateUniqueKey(parentPath);
			const newFormData = insertNested({ ...prevState.formData }, parentPath, newKey, "", 0);
			const newLabels = { ...prevState.labels, [[...parentPath, newKey].join(PATH_SEPARATOR)]: `New Field ${newKey.split("_")[1]}` };
			return { formData: newFormData, labels: newLabels };
		});
	};

	const handleMoveItem = (
		fromPath: string[],
		toPath: string[],
		moveType: "reorder" | "moveInto" = "moveInto"
	) => {
		setFormState((prevState) => {
			const itemKey = fromPath[fromPath.length - 1];
			const sourcePath = fromPath.slice(0, -1);
			const targetPathString = toPath.join(PATH_SEPARATOR);

			if (
				sourcePath.join(PATH_SEPARATOR) === targetPathString ||
				targetPathString.startsWith(fromPath.join(PATH_SEPARATOR))
			) {
				return prevState;
			}

			const itemValue = getNestedValue(prevState.formData, fromPath);
			if (itemValue === undefined) return prevState;

			const without = removeNested(prevState.formData, fromPath);
			const targetValue = getNestedValue(without, toPath);
			const isTargetASection =
				typeof targetValue === "object" &&
				targetValue !== null &&
				!Array.isArray(targetValue);

			let toParentPath: string[];
			let insertIndex: number;

			if (toPath.length === 0) {
				toParentPath = [];
				insertIndex = Object.keys(without).length;
			} else if (isTargetASection && moveType === "moveInto") {
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

				const sourceParentPath = fromPath.slice(0, -1);
				if (
					sourceParentPath.join(PATH_SEPARATOR) ===
					toParentPath.join(PATH_SEPARATOR)
				) {
					const sourceParent = getNestedValue(
						prevState.formData,
						sourceParentPath
					) as Record<string, unknown>;
					if (sourceParent) {
						const sourceKeys = Object.keys(sourceParent);
						const originalFromIndex = sourceKeys.indexOf(itemKey);
						const originalToIndex = sourceKeys.indexOf(toItemKey);

						if (
							originalFromIndex !== -1 &&
							originalToIndex !== -1 &&
							originalFromIndex < originalToIndex
						) {
							insertIndex += 1;
						}
					}
				}
			}

			const newFormData = insertNested(
				without,
				toParentPath,
				itemKey,
				itemValue,
				insertIndex
			);

			const newLabels = { ...prevState.labels };
			const oldPathStr = fromPath.join(PATH_SEPARATOR);
			const newPathStr = [...toParentPath, itemKey].join(PATH_SEPARATOR);

			if (newLabels[oldPathStr]) {
				newLabels[newPathStr] = newLabels[oldPathStr];
				delete newLabels[oldPathStr];
			}

			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(`${oldPathStr}${PATH_SEPARATOR}`)) {
					const newKey = key.replace(
						`${oldPathStr}${PATH_SEPARATOR}`,
						`${newPathStr}${PATH_SEPARATOR}`
					);
					newLabels[newKey] = newLabels[key];
					delete newLabels[key];
				}
			});

			return { formData: newFormData, labels: newLabels };
		});
	};

	const handleRemoveFieldOrSection = (path: string[]) => {
		setFormState((prevState) => {
			const newFormData = removeNested({ ...prevState.formData }, path);
			const newLabels = { ...prevState.labels };
			const pathString = path.join(PATH_SEPARATOR);
			delete newLabels[pathString];
			const prefix = `${pathString}${PATH_SEPARATOR}`;
			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(prefix)) {
					delete newLabels[key];
				}
			});
			return { formData: newFormData, labels: newLabels };
		});
	};

	const handleBulkDelete = (paths: Set<string>) => {
		setFormState((prevState) => {
			let newFormData = { ...prevState.formData };
			const newLabels = { ...prevState.labels };
			paths.forEach((pathString) => {
				const path = pathString.split(PATH_SEPARATOR);
				newFormData = removeNested(newFormData, path);
				delete newLabels[pathString];
				const prefix = `${pathString}${PATH_SEPARATOR}`;
				Object.keys(newLabels).forEach((key) => {
					if (key.startsWith(prefix)) {
						delete newLabels[key];
					}
				});
			});
			return { formData: newFormData, labels: newLabels };
		});
	};

	const handleBulkMove = (paths: Set<string>, destinationPath: string[]) => {
		setFormState((prevState) => {
			let newFormData = { ...prevState.formData };
			const newLabels = { ...prevState.labels };

			const sortedPaths = Array.from(paths).sort((a, b) => a.length - b.length);

			for (const pathString of sortedPaths) {
				const fromPath = pathString.split(PATH_SEPARATOR);
				const parentPathStr = fromPath.slice(0, -1).join(PATH_SEPARATOR);
				if (paths.has(parentPathStr)) continue;

				const itemKey = fromPath[fromPath.length - 1];
				const itemValue = getNestedValue(newFormData, fromPath);
				if (itemValue === undefined) continue;

				const sourcePath = fromPath.slice(0, -1);
				if (
					sourcePath.join(PATH_SEPARATOR) ===
					destinationPath.join(PATH_SEPARATOR)
				)
					continue;

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

				const oldPath = fromPath.join(PATH_SEPARATOR);
				const newPath = [...destinationPath, itemKey].join(PATH_SEPARATOR);
				if (newLabels[oldPath]) {
					newLabels[newPath] = newLabels[oldPath];
					delete newLabels[oldPath];
				}
				Object.keys(newLabels).forEach((key) => {
					if (key.startsWith(`${oldPath}${PATH_SEPARATOR}`)) {
						const newKey = key.replace(
							`${oldPath}${PATH_SEPARATOR}`,
							`${newPath}${PATH_SEPARATOR}`
						);
						newLabels[newKey] = newLabels[key];
						delete newLabels[key];
					}
				});
			}
			return { formData: newFormData, labels: newLabels };
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
		changesCount,
	};
};
