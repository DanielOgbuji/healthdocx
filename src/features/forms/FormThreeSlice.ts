import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const INSTITUTION_TYPE_OPTIONS = [
    "Hospital",
    "Clinic",
    "Primary Health Center",
    "Diagnostic Center",
    "Pharmacy",
    "Rehabilitation Center",
    "Public Health Institution",
    "Health Insurance Organization (HMO)",
    "Long-Term Care Facility",
    "Specialty Care Center",
    "Ambulatory Surgery Center",
    "Blood Banks & Organ Transplant Center",
    "Research & Regulatory Institution",
    "Educational & Training Institution",
] as const;

export const SIZE_OPTIONS = [
    "Small (1 - 50 staff)",
    "Medium (51 - 150 staff)",
    "Large (151 - 250 staff)",
    "Enterprise (250+ staff)",
] as const;

export type InstitutionType = (typeof INSTITUTION_TYPE_OPTIONS)[number];
export type InstitutionSize = (typeof SIZE_OPTIONS)[number];

export interface FormThreeData {
    institutionName: string;
    location: string;
    institutionType: InstitutionType | undefined;
    size: InstitutionSize | undefined;
    licenseNumber: string;
    isSubmitting: boolean;
}

export const initialState: FormThreeData = {
    institutionName: "",
    location: "",
    institutionType: undefined,
    size: undefined,
    licenseNumber: "",
    isSubmitting: false,
};

export const formThreeSlice = createSlice({
    name: "formThree",
    initialState,
    reducers: {
        updateField: (
            state,
            action: PayloadAction<{ field: keyof FormThreeData; value: string }>
        ) => {
            const { field, value } = action.payload;
            if (field in state) {
                (state[field] as string) = value;
            }
        },
        setSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        submitForm: (state, action: PayloadAction<FormThreeData>) => {
            return {
                ...state,
                ...action.payload,
                isSubmitting: false,
            };
        },
    },
});

export const { setSubmitting, submitForm } = formThreeSlice.actions;

export default formThreeSlice.reducer;