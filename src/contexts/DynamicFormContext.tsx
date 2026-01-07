import { createContext, useContext, type ReactNode } from "react";
import { useDynamicForm } from "@/hooks/useDynamicForm";

type DynamicFormReturn = ReturnType<typeof useDynamicForm>;

interface DynamicFormContextType extends DynamicFormReturn {
    // Add any extra context-specific props here if needed
}

const DynamicFormContext = createContext<DynamicFormContextType | undefined>(undefined);

export const useDynamicFormContext = () => {
    const context = useContext(DynamicFormContext);
    if (!context) {
        throw new Error("useDynamicFormContext must be used within a DynamicFormProvider");
    }
    return context;
};

interface DynamicFormProviderProps {
    children: ReactNode;
    value: DynamicFormReturn;
}

export const DynamicFormProvider = ({ children, value }: DynamicFormProviderProps) => {
    return (
        <DynamicFormContext.Provider value={value}>
            {children}
        </DynamicFormContext.Provider>
    );
};
