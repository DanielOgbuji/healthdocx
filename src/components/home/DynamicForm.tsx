import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

interface DynamicFormProps {
  structuredData: string;
}

// Helper function to update nested object
const updateNested = (obj: Record<string, unknown>, path: string[], value: string): Record<string, unknown> => {
  if (path.length === 0) {
    // This should not happen at the top level, but for type safety, return the original object
    return obj;
  }

  const [head, ...rest] = path;
  if (rest.length === 0) {
    return {
      ...obj,
      [head]: value,
    };
  }
  return {
    ...obj,
    [head]: updateNested(
      (obj[head] as Record<string, unknown>) || {},
      rest,
      value
    ),
  };
};

interface FormFieldProps {
  data: Record<string, unknown>;
  path: string[];
  onFieldChange: (path: string[], value: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({ data, path, onFieldChange }) => {
  return (
    <>
      {Object.keys(data).map((key) => {
        const currentPath = [...path, key];
        const value = data[key];

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value) &&
          Object.prototype.toString.call(value) === "[object Object]"
        ) {
          return (
            <div key={currentPath.join(".")} style={{ marginBottom: "15px", border: "1px solid #eee", padding: "10px", borderRadius: "5px" }}>
              <h3 style={{ marginTop: "0", marginBottom: "10px", color: "#333" }}>{key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').trim().replace(/^./, (str) => str.toUpperCase())}</h3>
              <FormField data={value as Record<string, unknown>} path={currentPath} onFieldChange={onFieldChange} />
            </div>
          );
        }

        return (
          <div key={currentPath.join(".")} style={{ marginBottom: "15px" }}>
            <label htmlFor={currentPath.join(".")}>{key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').trim().replace(/^./, (str) => str.toUpperCase())}</label>
            <input
              type="text"
              id={currentPath.join(".")}
              value={typeof value === "string" || typeof value === "number" ? value : ""}
              onChange={(e) => onFieldChange(currentPath, e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
        );
      })}
    </>
  );
};

const DynamicForm: React.FC<DynamicFormProps> = ({ structuredData }) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    try {
      // Remove the ```json and ``` from the string
      const cleanStructuredData = structuredData.replace(/^```json\n/, '').replace(/\n```$/, '');
      const parsedData = JSON.parse(cleanStructuredData);
      setFormData(parsedData);
    } catch (e) {
      console.error("Error parsing structuredData:", e);
      setError("Error parsing data. Please check the format.");
    }

    // Retrieve id from local storage
    const storedId = localStorage.getItem("id");
    if (storedId) {
      setId(storedId);
    }
  }, [structuredData]);

  const handleFieldChange = (path: string[], value: string) => {
    setFormData((prevData) => updateNested(prevData, path, value));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.patch(
        `/patient-records/update/${id}`,
        formData
      );

      if (response.status === 200) {
        setSuccessMessage("Form submitted successfully!");
      } else {
        setError(`Submission failed: ${response.statusText}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Submission failed: ${error.message}`);
        console.error("Form submission error:", error);
      } else {
        setError("Submission failed: An unknown error occurred.");
        console.error("Form submission error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        marginTop: "200px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2>Patient Record Details</h2>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {successMessage && (
        <p style={{ color: "green" }}>{successMessage}</p>
      )}

      <FormField data={formData} path={[]} onFieldChange={handleFieldChange} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Updating..." : "Update Record"}
      </button>
    </div>
  );
};

export default DynamicForm;
