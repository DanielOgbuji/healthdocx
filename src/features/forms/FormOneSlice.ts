import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const ROLE_OPTIONS = [
	"IT Administrator",
	"Health Records Officer",
	"Medical Data Analyst",
	"Operations Manager",
	"Hospital Administrator",
	"Medical Researcher",
	"Healthcare Provider",
] as const;

export type Role = (typeof ROLE_OPTIONS)[number];

export interface FormOneData {
	name: string;
	email: string;
	role: Role | undefined;
	phone: string;
	password: string;
	isSubmitting: boolean;
}

export const initialState: FormOneData = {
	name: "",
	email: "",
	role: undefined,
	phone: "",
	password: "",
	isSubmitting: false,
};

export const formOneSlice = createSlice({
	name: "formOne",
	initialState,
	reducers: {
		updateField: (
			state,
			action: PayloadAction<{ field: keyof FormOneData; value: string }>
		) => {
			const { field, value } = action.payload;
			if (field in state) {
				(state[field] as string) = value;
			}
		},
		setSubmitting: (state, action: PayloadAction<boolean>) => {
			state.isSubmitting = action.payload;
		},
		submitForm: (state, action: PayloadAction<FormOneData>) => {
			return {
				...state,
				...action.payload,
				isSubmitting: false,
			};
		},
	},
});

export const { setSubmitting, submitForm } = formOneSlice.actions;

export default formOneSlice.reducer;
