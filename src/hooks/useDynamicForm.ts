// useDynamicForm.ts
import { useState, useEffect, useRef } from "react";
import { api } from "../api/axios";
import { type ApiError } from "../types/api.types";
import { toaster } from "../components/ui/toaster";
import { buildPayload } from "../utils/dynamicFormUtils";

import { useFormHistory } from "./dynamic-form/useFormHistory";
import { useFormAutoSave } from "./dynamic-form/useFormAutoSave";
import { useFormActions } from "./dynamic-form/useFormActions";

export const useDynamicForm = (
	structuredData: string | Record<string, unknown>,
	recordId: string | undefined,
	ocrText: string | null,
	recordTypeGroup?: string,
	recordType?: string
) => {
	console.log("✅ Using recordId for API calls:", recordId);
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
    const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
	const initialDataLoaded = useRef(false);

    // --- Hooks Composition ---
    const { undo, redo, changesCount } = useFormHistory(formState, setFormState, initialDataLoaded.current);
    const { autoSaveStatus } = useFormAutoSave(recordId, formState, initialDataLoaded.current);
    const actions = useFormActions(setFormState);

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
				// Remove recordTypeGroup and recordType from form data as they should be top-level fields
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { recordTypeGroup, recordType, ...formDataWithoutTypes } = parsedData;
				initialState = { formData: formDataWithoutTypes, labels: {} };
			} catch (e) {
				console.error("Error parsing structuredData:", e);
				setError("Error parsing data. Please check the format.");
                initialState = { formData: {}, labels: {} };
			}
		}
        setFormState(initialState);
		initialDataLoaded.current = true;
	}, [structuredData, recordId, recordTypeGroup, recordType]);

	const handleSubmit = async (recordTypeGroup?: string, recordType?: string) => {
		if (!recordId) {
			setError("Record ID is missing.");
			return;
		}
		setLoading(true);
		setError("");
		setSuccessMessage("");
		const payload = buildPayload(formData, labels, ocrText);

		try {
			// Update the main record data
			const response = await api.patch(`/patient-records/${recordId}`, payload);
			if (response.status === 200) {
				setSuccessMessage("Form submitted successfully!");
				toaster.create({
					title: "Success",
					description: "Form submitted successfully!",
					type: "success",
					duration: 3000,
				});
				console.log("API response:", response.data, payload);
			} else {
				setError(`Submission failed: ${response.data.error}`);
				console.error("API response error:", response.data, payload);
				return; // Exit if main update fails
			}

			// If recordTypeGroup or recordType are provided, update them separately
			if (recordTypeGroup || recordType) {
				try {
					const typePayload: { recordType?: string; recordTypeGroup?: string } = {};
					if (recordTypeGroup) typePayload.recordTypeGroup = recordTypeGroup;
					if (recordType) typePayload.recordType = recordType;

					const typeResponse = await api.patch(`/patient-records/${recordId}/type`, typePayload);
					if (typeResponse.status !== 200) {
						console.error("Type update failed:", typeResponse.data);
						// Optionally show a warning, but don't override success
						toaster.create({
							title: "Warning",
							description: "Record updated, but type update failed.",
							type: "warning",
							duration: 3000,
						});
					}
				} catch (typeError: unknown) {
					console.error("Type update error:", typeError);
					toaster.create({
						title: "Warning",
						description: "Record updated, but type update failed.",
						type: "warning",
						duration: 3000,
					});
				}
			}
		} catch (error: unknown) {
			const apiError = error as ApiError;
			if (apiError.response?.data?.error) {
				setError(`Submission failed: ${apiError.response.data.error}`);
				console.error("API response error:", apiError.response.data, payload);
			} else if (error instanceof Error) {
				setError(`Submission failed: ${error.message}`);
				console.error("API response error:", error.message, payload);
			} else {
				setError("Submission failed: An unknown error occurred.");
				console.error("API response error:", payload);
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
        ...actions, // Spread all action handlers
		handleSubmit,
		undo,
		redo,
		isCollapsed,
		toggleCollapse,
		changesCount,
	};
};
