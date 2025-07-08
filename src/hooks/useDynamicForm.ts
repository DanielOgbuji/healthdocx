import { useState, useEffect } from "react";
import { api } from "@/api/axios";
import { toaster } from "@/components/ui/toaster";
import {
  updateNested,
  buildPayload,
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
      const response = await api.patch(
        `/patient-records/update/${recordId}`,
        payload
      );

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
  };
};