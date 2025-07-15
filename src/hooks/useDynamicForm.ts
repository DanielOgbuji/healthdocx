import { useState, useEffect, useRef } from "react";
import { api } from "@/api/axios";
import { toaster } from "@/components/ui/toaster";
import {
	updateNested,
	buildPayload,
	removeNested,
	insertNested,
	getNestedValue,
} from "@/utils/dynamicFormUtils";

export const useDynamicForm = (
	structuredData: string,
	recordId: string | undefined
) => {
	const [formData, setFormData] = useState<Record<string, unknown>>({});
	const [labels, setLabels] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [autoSaveStatus, setAutoSaveStatus] = useState("Saved");
	const initialDataLoaded = useRef(false);

	// Load initial data
	useEffect(() => {
		if (!recordId) return;

		const autoSavedFormData = localStorage.getItem(`autosave_form_${recordId}`);
		const autoSavedLabels = localStorage.getItem(`autosave_labels_${recordId}`);

		if (autoSavedFormData && autoSavedLabels) {
			setFormData(JSON.parse(autoSavedFormData));
			setLabels(JSON.parse(autoSavedLabels));
		} else {
			try {
				const cleanData = structuredData
					.replace(/^```json\n/, "")
					.replace(/\n```$/, "");
				const parsed = JSON.parse(cleanData);
				setFormData(parsed);
				setLabels({}); // Reset labels when data changes
			} catch (e) {
				console.error("Error parsing structuredData:", e);
				setError("Error parsing data. Please check the format.");
			}
		}
		initialDataLoaded.current = true;
	}, [structuredData, recordId]);

	// Debounced autosave
	useEffect(() => {
		if (!initialDataLoaded.current) {
			return;
		}

		setAutoSaveStatus("Saving...");
		const handler = setTimeout(() => {
			if (recordId) {
				localStorage.setItem(
					`autosave_form_${recordId}`,
					JSON.stringify(formData)
				);
				localStorage.setItem(
					`autosave_labels_${recordId}`,
					JSON.stringify(labels)
				);
				setAutoSaveStatus("Saved");
			}
		}, 1000);

		return () => {
			clearTimeout(handler);
		};
	}, [formData, labels, recordId]);

	const handleFieldChange = (path: string[], value: string) => {
		const newFormData = updateNested({ ...formData }, path, value);
		setFormData(newFormData);
	};

	const handleLabelChange = (path: string, label: string) => {
		const newLabels = { ...labels, [path]: label };
		setLabels(newLabels);
	};

	const generateUniqueKey = (path: string[]) => {
		const base = path.length > 0 ? path[path.length - 1] : "root";
		return `${base}_${Date.now()}`;
	};

	const handleAddSection = (parentPath: string[]) => {
		const newKey = generateUniqueKey(parentPath);

		const parentObject =
			parentPath.length === 0
				? formData
				: (getNestedValue(formData, parentPath) as Record<string, unknown>);

		const insertPosition =
			parentPath.length === 0
				? 0
				: parentObject
				? Object.keys(parentObject).length
				: 0;

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
			[[...parentPath, newKey].join(".")]: `New Section ${newKey.split("_")[1]}`,
		};
		setLabels(newLabels);
	};

	const handleAddField = (parentPath: string[]) => {
		const newKey = generateUniqueKey(parentPath);

		const newFormData = insertNested({ ...formData }, parentPath, newKey, "", 0);

		setFormData(newFormData);

		const newLabels = {
			...labels,
			[[...parentPath, newKey].join(".")]: `New Field ${newKey.split("_")[1]}`,
		};
		setLabels(newLabels);
	};

	const handleMoveItem = (fromPath: string[], toPath: string[]) => {
		const itemKey = fromPath[fromPath.length - 1];
		const sourcePath = fromPath.slice(0, -1);

		if (
			sourcePath.join(".") === toPath.join(".") ||
			toPath.join(".").startsWith(fromPath.join("."))
		) {
			return;
		}

		setFormData((prevData) => {
			const itemValue = getNestedValue(prevData, fromPath);
			if (itemValue === undefined) return prevData;

			const newData = removeNested(prevData, fromPath);

			const toParent = getNestedValue(newData, toPath) as Record<
				string,
				unknown
			>;
			let insertIndex = toParent ? Object.keys(toParent).length : 0;

			if (toPath.length === 0) {
				const firstSectionIndex = Object.values(newData).findIndex(
					(v) => typeof v === "object" && v !== null && !Array.isArray(v)
				);
				if (firstSectionIndex !== -1) {
					insertIndex = firstSectionIndex;
				}
			}

			return insertNested(newData, toPath, itemKey, itemValue, insertIndex);
		});

		setLabels((prevLabels) => {
			const newLabels = { ...prevLabels };
			const oldPath = fromPath.join(".");
			const newPath = [...toPath, itemKey].join(".");

			if (newLabels[oldPath]) {
				newLabels[newPath] = newLabels[oldPath];
				delete newLabels[oldPath];
			}

			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(`${oldPath}.`)) {
					const newKey = key.replace(`${oldPath}.`, `${newPath}.`);
					newLabels[newKey] = newLabels[key];
					delete newLabels[key];
				}
			});

			return newLabels;
		});
	};

	const handleRemoveFieldOrSection = (path: string[]) => {
		const newFormData = removeNested({ ...formData }, path);
		setFormData(newFormData);

		setLabels((prevLabels) => {
			const newLabels = { ...prevLabels };
			const pathString = path.join(".");
			delete newLabels[pathString];

			const prefix = `${pathString}.`;
			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(prefix)) {
					delete newLabels[key];
				}
			});
			return newLabels;
		});
	};

	const handleBulkDelete = (paths: Set<string>) => {
		let newFormData = { ...formData };
		const newLabels = { ...labels };

		paths.forEach(pathString => {
			const path = pathString.split('.');
			newFormData = removeNested(newFormData, path);
			
			delete newLabels[pathString];
			const prefix = `${pathString}.`;
			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(prefix)) {
					delete newLabels[key];
				}
			});
		});

		setFormData(newFormData);
		setLabels(newLabels);
	}

	const handleBulkMove = (paths: Set<string>, destinationPath: string[]) => {
		let newFormData = { ...formData };
		const newLabels = { ...labels };

		const sortedPaths = Array.from(paths).sort((a, b) => a.length - b.length);

		for (const pathString of sortedPaths) {
			const fromPath = pathString.split(".");
			const parentPath = fromPath.slice(0, -1).join(".");

			if (paths.has(parentPath)) {
				continue;
			}

			const itemKey = fromPath[fromPath.length - 1];
			const itemValue = getNestedValue(newFormData, fromPath);

			if (itemValue === undefined) continue;

			const sourcePath = fromPath.slice(0, -1);
			if (sourcePath.join(".") === destinationPath.join(".")) {
				continue;
			}

			newFormData = removeNested(newFormData, fromPath);

			const toParent = getNestedValue(newFormData, destinationPath) as Record<
				string,
				unknown
			>;
			let insertIndex = toParent ? Object.keys(toParent).length : 0;

			if (destinationPath.length === 0) {
				const firstSectionIndex = Object.values(newFormData).findIndex(
					(v) => typeof v === "object" && v !== null && !Array.isArray(v)
				);
				if (firstSectionIndex !== -1) {
					insertIndex = firstSectionIndex;
				}
			}

			newFormData = insertNested(
				newFormData,
				destinationPath,
				itemKey,
				itemValue,
				insertIndex
			);

			const oldPath = fromPath.join(".");
			const newPath = [...destinationPath, itemKey].join(".");

			if (newLabels[oldPath]) {
				newLabels[newPath] = newLabels[oldPath];
				delete newLabels[oldPath];
			}

			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(`${oldPath}.`)) {
					const newKey = key.replace(`${oldPath}.`, `${newPath}.`);
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

		const payload = buildPayload(formData, labels);
		try {
			const response = await api.put(`/patient-records/${recordId}`, payload);

			if (response.status === 200) {
				setSuccessMessage("Form submitted successfully!");
				console.log("Form submitted successfully:", response, payload);
				toaster.create({
					title: "Success",
					description: "Form submitted successfully!",
					type: "success",
					duration: 3000,
				});
			} else {
				setError(`Submission failed: ${response.statusText}`);
				console.error("Submission failed:", response, payload);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(`Submission failed: ${error.message}`);
				console.error("Submission failed:", error, payload);
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
	};
};
