import { useState, useCallback } from "react";
import {
	updateNested,
	removeNested,
	insertNested,
	getNestedValue,
	addArrayItem as utilAddArrayItem,
	removeArrayItem as utilRemoveArrayItem,
	reorderArrayItem as utilReorderArrayItem,
	PATH_SEPARATOR,
} from "../../utils/dynamicFormUtils";

interface FormState {
    formData: Record<string, unknown>;
    labels: Record<string, string>;
}

export const useFormActions = (
    setFormState: React.Dispatch<React.SetStateAction<FormState>>
) => {
    const [newlyAddedPath, setNewlyAddedPath] = useState<string[] | null>(null);

    const generateUniqueKey = (path: string[]) => {
		const base = path.length > 0 ? path[path.length - 1] : "root";
		return `${base}_${Date.now()}`;
	};

    const handleFieldChange = useCallback((path: string[], value: string | Array<Record<string, string>> | string[]) => {
		setFormState((prevState) => {
			const currentValue = getNestedValue(prevState.formData, path);
			// Special handling for array types to avoid unnecessary updates
			if (Array.isArray(currentValue) && Array.isArray(value)) {
				if (JSON.stringify(currentValue) === JSON.stringify(value)) return prevState;
			} else if (currentValue === value) {
				return prevState;
			}
			const newFormData = updateNested({ ...prevState.formData }, path, value);
			return { ...prevState, formData: newFormData };
		});
	}, [setFormState]);

	const handleLabelChange = useCallback((path: string, label: string) => {
		setFormState((prevState) => {
			if (prevState.labels[path] === label) return prevState;
			const newLabels = { ...prevState.labels, [path]: label };
			return { ...prevState, labels: newLabels };
		});
	}, [setFormState]);

	const handleAddSection = useCallback((parentPath: string[]) => {
		setFormState((prevState) => {
			const newKey = generateUniqueKey(parentPath);
			const parentObject = parentPath.length === 0 ? prevState.formData : (getNestedValue(prevState.formData, parentPath) as Record<string, unknown>);
			const insertPosition = parentObject ? Object.keys(parentObject).length : 0;
			const newFormData = insertNested({ ...prevState.formData }, parentPath, newKey, {}, insertPosition);
			const newLabels = { ...prevState.labels, [[...parentPath, newKey].join(PATH_SEPARATOR)]: `New Section ${newKey.split("_")[1]}` };
			setNewlyAddedPath([...parentPath, newKey]);
			return { formData: newFormData, labels: newLabels };
		});
	}, [setFormState]);

	const handleAddField = useCallback((parentPath: string[]) => {
		setFormState((prevState) => {
			const newKey = generateUniqueKey(parentPath);
			const newFormData = insertNested({ ...prevState.formData }, parentPath, newKey, "", 0);
			const newLabels = { ...prevState.labels, [[...parentPath, newKey].join(PATH_SEPARATOR)]: `New Field ${newKey.split("_")[1]}` };
			setNewlyAddedPath([...parentPath, newKey]);
			return { formData: newFormData, labels: newLabels };
		});
	}, [setFormState]);

	const handleAddTable = useCallback((parentPath: string[]) => {
		setFormState((prevState) => {
			const newKey = generateUniqueKey(parentPath);
			const parentObject = parentPath.length === 0 ? prevState.formData : (getNestedValue(prevState.formData, parentPath) as Record<string, unknown>);
			const insertPosition = parentObject ? Object.keys(parentObject).length : 0;
			const newFormData = insertNested({ ...prevState.formData }, parentPath, newKey, [{ "New Column 1": "" }], insertPosition);
			const newLabels = { ...prevState.labels, [[...parentPath, newKey].join(PATH_SEPARATOR)]: `New Table ${newKey.split("_")[1]}` };
			setNewlyAddedPath([...parentPath, newKey]);
			return { formData: newFormData, labels: newLabels };
		});
	}, [setFormState]);

	const handleAddList = useCallback((parentPath: string[]) => {
		setFormState((prevState) => {
			const newKey = generateUniqueKey(parentPath);
			const parentObject = parentPath.length === 0 ? prevState.formData : (getNestedValue(prevState.formData, parentPath) as Record<string, unknown>);
			const insertPosition = parentObject ? Object.keys(parentObject).length : 0;
			const newFormData = insertNested({ ...prevState.formData }, parentPath, newKey, [], insertPosition);
			const newLabels = { ...prevState.labels, [[...parentPath, newKey].join(PATH_SEPARATOR)]: `New List ${newKey.split("_")[1]}` };
			setNewlyAddedPath([...parentPath, newKey]);
			return { formData: newFormData, labels: newLabels };
		});
	}, [setFormState]);

	const handleAddArrayItem = useCallback((path: string[], item: Record<string, string> | string) => {
		setFormState((prevState) => {
			const newFormData = utilAddArrayItem({ ...prevState.formData }, path, item);
			return { ...prevState, formData: newFormData };
		});
	}, [setFormState]);

	const handleRemoveArrayItem = useCallback((path: string[], index: number) => {
		setFormState((prevState) => {
			const newFormData = utilRemoveArrayItem({ ...prevState.formData }, path, index);
			return { ...prevState, formData: newFormData };
		});
	}, [setFormState]);

	const handleReorderArrayItem = useCallback((path: string[], fromIndex: number, toIndex: number) => {
		setFormState((prevState) => {
			const newFormData = utilReorderArrayItem({ ...prevState.formData }, path, fromIndex, toIndex);
			return { ...prevState, formData: newFormData };
		});
	}, [setFormState]);

	const handleMoveItem = useCallback((
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

			const oldPathStr = fromPath.join(PATH_SEPARATOR);
			const newPathStr = [...toParentPath, itemKey].join(PATH_SEPARATOR);
			const newLabels = { ...prevState.labels };

			const labelsToMove: Record<string, string> = {};

			// Collect the item's own label
			if (newLabels[oldPathStr]) {
				labelsToMove[oldPathStr] = newLabels[oldPathStr];
			}

			// Collect children's labels
			const prefix = `${oldPathStr}${PATH_SEPARATOR}`;
			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(prefix)) {
					labelsToMove[key] = newLabels[key];
				}
			});

			// Delete all old labels
			Object.keys(labelsToMove).forEach((key) => {
				delete newLabels[key];
			});

			// Add labels back with new paths
			for (const oldKey in labelsToMove) {
				const newKey = newPathStr + oldKey.substring(oldPathStr.length);
				newLabels[newKey] = labelsToMove[oldKey];
			}

			return { formData: newFormData, labels: newLabels };
		});
	}, [setFormState]);

	const handleRemoveFieldOrSection = useCallback((path: string[]) => {
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
	}, [setFormState]);

	const handleBulkDelete = useCallback((paths: Set<string>) => {
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
	}, [setFormState]);

	const handleBulkMove = useCallback((paths: Set<string>, destinationPath: string[]) => {
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

				const labelsToMove: Record<string, string> = {};
				
				// Collect the item's own label
				if (newLabels[oldPath]) {
					labelsToMove[oldPath] = newLabels[oldPath];
				}
				const prefix = `${oldPath}${PATH_SEPARATOR}`;
				// Collect children's labels
				Object.keys(newLabels).forEach((key) => {
					if (key.startsWith(prefix)) {
						labelsToMove[key] = newLabels[key];
					}
				});

				// Delete all old labels
				Object.keys(labelsToMove).forEach((key) => {
					delete newLabels[key];
				});

				// Add labels back with new paths
				for (const oldKey in labelsToMove) {
					const newKey = newPath + oldKey.substring(oldPath.length);
					newLabels[newKey] = labelsToMove[oldKey];
				}
			}
			return { formData: newFormData, labels: newLabels };
		});
	}, [setFormState]);

    return {
        handleFieldChange,
		handleLabelChange,
		handleAddSection,
		handleAddField,
		handleAddTable,
		handleAddList,
		handleAddArrayItem,
		handleRemoveArrayItem,
		handleReorderArrayItem,
		handleMoveItem,
		handleRemoveFieldOrSection,
		handleBulkDelete,
		handleBulkMove,
        newlyAddedPath,
		setNewlyAddedPath,
    };
};
