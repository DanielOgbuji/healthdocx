import { useState, useEffect } from "react";

interface FormState {
    formData: Record<string, unknown>;
    labels: Record<string, string>;
}

export const useFormAutoSave = (
    recordId: string | undefined,
    formState: FormState,
    initialDataLoaded: boolean
) => {
    const [autoSaveStatus, setAutoSaveStatus] = useState("Saved");

    useEffect(() => {
        if (!initialDataLoaded || !recordId) return;

        setAutoSaveStatus("Saving...");
        const autoSaveHandler = setTimeout(() => {
            sessionStorage.setItem(`autosave_form_${recordId}`, JSON.stringify(formState.formData));
            sessionStorage.setItem(`autosave_labels_${recordId}`, JSON.stringify(formState.labels));
            setAutoSaveStatus("Saved");
        }, 500);

        return () => {
            clearTimeout(autoSaveHandler);
        };
    }, [formState, recordId, initialDataLoaded]);

    return { autoSaveStatus };
};
