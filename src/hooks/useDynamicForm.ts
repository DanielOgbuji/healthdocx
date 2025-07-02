import { useState, useEffect } from "react";
import { api } from "@/api/axios";
import { toaster } from "@/components/ui/toaster";
import {
  updateNested,
  buildPayload,
} from "@/utils/dynamicFormUtils";

export const useDynamicForm = (structuredData: string) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
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

    const storedId = localStorage.getItem("id");
    if (storedId) setId(storedId);
  }, [structuredData]);

  const handleFieldChange = (path: string[], value: string) => {
    setFormData((prevData) => updateNested(prevData, path, value));
  };

  const handleLabelChange = (path: string, label: string) => {
    setLabels((prevLabels) => ({ ...prevLabels, [path]: label }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const payload = buildPayload(formData, labels);
    try {
      const response = await api.patch(
        `/patient-records/update/${id}`,
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
    handleFieldChange,
    handleLabelChange,
    handleSubmit,
  };
};