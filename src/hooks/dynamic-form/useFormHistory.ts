import { useState, useRef, useEffect } from "react";
import { toaster } from "@/components/ui/toaster";

interface FormState {
    formData: Record<string, unknown>;
    labels: Record<string, string>;
}

export const useFormHistory = (
    formState: FormState,
    setFormState: React.Dispatch<React.SetStateAction<FormState>>,
    initialDataLoaded: boolean
) => {
    const history = useRef<FormState[]>([]);
    const historyIndex = useRef(0);
    const [changesCount, setChangesCount] = useState(0);
    const isUndoingOrRedoing = useRef(false);
    const historyTimeout = useRef<number | null>(null);

    // Initialize history
    useEffect(() => {
        if (history.current.length === 0 && Object.keys(formState.formData).length > 0) {
            history.current = [formState];
            historyIndex.current = 0;
            setChangesCount(0);
        }
    }, [initialDataLoaded]); // Trigger once loaded

    useEffect(() => {
        if (!initialDataLoaded) return;

        if (isUndoingOrRedoing.current) {
            isUndoingOrRedoing.current = false;
        } else {
            if (historyTimeout.current) {
                clearTimeout(historyTimeout.current);
            }
            historyTimeout.current = window.setTimeout(() => {
                const lastRecordedState = history.current[historyIndex.current];
                // Deep comparison simplified (JSON.stringify is used in original)
                if (JSON.stringify(lastRecordedState) !== JSON.stringify(formState)) {
                    const newHistory = history.current.slice(0, historyIndex.current + 1);
                    newHistory.push(formState);
                    history.current = newHistory;
                    historyIndex.current = newHistory.length - 1;
                    setChangesCount(historyIndex.current);
                }
            }, 500);
        }

        return () => {
            if (historyTimeout.current) clearTimeout(historyTimeout.current);
        };
    }, [formState, initialDataLoaded]);

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

    return {
        undo,
        redo,
        changesCount,
        history,
        historyIndex
    };
};
