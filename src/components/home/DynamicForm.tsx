import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";

interface DynamicFormProps {
  structuredData: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ structuredData }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setFormData({ ...formData, [key]: e.target.value });
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
    } catch (error: any) {
      setError(`Submission failed: ${error.message}`);
      console.error("Form submission error:", error);
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

      {Object.keys(formData).map((key) => (
        <div key={key} style={{ marginBottom: "15px" }}>
          <label htmlFor={key}>{key}</label>
          <input
            type="text"
            id={key}
            value={formData[key] || ""}
            onChange={(e) => handleChange(e, key)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
      ))}

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
