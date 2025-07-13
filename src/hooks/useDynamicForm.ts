import { useState, useEffect } from "react";
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
	}, [structuredData, recordId]);

	const handleFieldChange = (path: string[], value: string) => {
		setAutoSaveStatus("Saving...");
		const newFormData = updateNested({ ...formData }, path, value);
		setFormData(newFormData);
		if (recordId) {
			localStorage.setItem(
				`autosave_form_${recordId}`,
				JSON.stringify(newFormData)
			);
			setTimeout(() => setAutoSaveStatus("Saved"), 1000);
		}
	};

	const handleLabelChange = (path: string, label: string) => {
		setAutoSaveStatus("Saving...");
		const newLabels = { ...labels, [path]: label };
		setLabels(newLabels);
		if (recordId) {
			localStorage.setItem(
				`autosave_labels_${recordId}`,
				JSON.stringify(newLabels)
			);
			setTimeout(() => setAutoSaveStatus("Saved"), 1000);
		}
	};

	const generateUniqueKey = (path: string[]) => {
		const base = path.length > 0 ? path[path.length - 1] : "root";
		return `${base}_${Date.now()}`;
	};

const handleAddSection = (parentPath: string[]) => {
  setAutoSaveStatus("Saving...");
  const newKey = generateUniqueKey(parentPath);
  
  // Safely get parent object
  const parentObject = parentPath.length === 0 
    ? formData 
    : getNestedValue(formData, parentPath);
  
  // Calculate position
  const insertPosition = parentPath.length === 0 
    ? 0 
    : parentObject 
      ? Object.keys(parentObject).length 
      : 0; // Fallback if parent doesn't exist

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

  if (recordId) {
    localStorage.setItem(
      `autosave_form_${recordId}`,
      JSON.stringify(newFormData)
    );
    localStorage.setItem(
      `autosave_labels_${recordId}`,
      JSON.stringify(newLabels)
    );
    setTimeout(() => setAutoSaveStatus("Saved"), 1000);
  }
};

const handleAddField = (parentPath: string[]) => {
  setAutoSaveStatus("Saving...");
  const newKey = generateUniqueKey(parentPath);
  
  // Fields always insert at top (position 0)
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
    [[...parentPath, newKey].join(".")]: `New Field ${newKey.split("_")[1]}`,
  };
  setLabels(newLabels);

  if (recordId) {
    localStorage.setItem(
      `autosave_form_${recordId}`,
      JSON.stringify(newFormData)
    );
    localStorage.setItem(
      `autosave_labels_${recordId}`,
      JSON.stringify(newLabels)
    );
    setTimeout(() => setAutoSaveStatus("Saved"), 1000);
  }
};

	const handleMoveField = (
		sourcePath: string[],
		destinationPath: string[],
		newIndex: number
	) => {
		setAutoSaveStatus("Saving...");
		const sourceKey = sourcePath[sourcePath.length - 1];

		let valueToMove: unknown;
		setFormData((prevFormData) => {
			const tempFormData = JSON.parse(JSON.stringify(prevFormData));
			valueToMove = removeNested(tempFormData, sourcePath);
			return tempFormData;
		});

		setFormData((prevFormData) => {
			const tempFormData = JSON.parse(JSON.stringify(prevFormData));
			insertNested(
				tempFormData,
				destinationPath,
				sourceKey,
				valueToMove,
				newIndex
			);
			return tempFormData;
		});

		setLabels((prevLabels) => {
			const newLabels = { ...prevLabels };
			const oldLabelKey = sourcePath.join(".");
			const newLabelKey = [...destinationPath, sourceKey].join(".");

			if (newLabels[oldLabelKey]) {
				newLabels[newLabelKey] = newLabels[oldLabelKey];
				delete newLabels[oldLabelKey];
			}
			return newLabels;
		});

		if (recordId) {
			localStorage.setItem(
				`autosave_form_${recordId}`,
				JSON.stringify(formData)
			);
			localStorage.setItem(
				`autosave_labels_${recordId}`,
				JSON.stringify(labels)
			);
			setTimeout(() => setAutoSaveStatus("Saved"), 1000);
		}
	};

	const handleRemoveFieldOrSection = (path: string[]) => {
		setAutoSaveStatus("Saving...");
		const newFormData = removeNested({ ...formData }, path);
		setFormData(newFormData);

		setLabels((prevLabels) => {
			const newLabels = { ...prevLabels };
			const pathString = path.join(".");
			// Remove the label for the deleted item
			delete newLabels[pathString];

			// If a section is deleted, also remove labels of its children
			const prefix = `${pathString}.`;
			Object.keys(newLabels).forEach((key) => {
				if (key.startsWith(prefix)) {
					delete newLabels[key];
				}
			});
			return newLabels;
		});

		if (recordId) {
			localStorage.setItem(
				`autosave_form_${recordId}`,
				JSON.stringify(newFormData)
			);
			localStorage.setItem(
				`autosave_labels_${recordId}`,
				JSON.stringify(labels)
			);
			setTimeout(() => setAutoSaveStatus("Saved"), 1000);
		}
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
		handleMoveField,
		handleRemoveFieldOrSection,
	};
};
