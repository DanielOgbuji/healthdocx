// src/store/onboardingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormOneValues } from "@/pages/onboarding/form-one";
import { FormThreeValues } from "@/pages/onboarding/form-three";

export interface OnboardingState {
	formOne: FormOneValues;
	formTwo: Record<string, unknown>;
	formThree: FormThreeValues;
}

const initialState: OnboardingState = {
	formOne: {
		name: "",
		email: "",
		role: "",
		phone: "",
		password: "",
	},
	formTwo: {},
	formThree: {
		institutionName: "",
		location: "",
		institutionType: "",
		size: "",
		licenseNumber: "",
	},
};

const onboardingSlice = createSlice({
	name: "onboarding",
	initialState,
	reducers: {
		updateFormOne(state, action: PayloadAction<FormOneValues>) {
			state.formOne = { ...state.formOne, ...action.payload };
		},
		updateFormTwo(state, action: PayloadAction<Record<string, unknown>>) {
			state.formTwo = { ...state.formTwo, ...action.payload };
		},
		updateFormThree(state, action: PayloadAction<FormThreeValues>) {
			state.formThree = { ...state.formThree, ...action.payload };
		},
		resetOnboardingState(state) {
			state.formOne = {
				name: "",
				email: "",
				role: "",
				phone: "",
				password: "",
			};
			state.formTwo = {};
			state.formThree = {
				institutionName: "",
				location: "",
				institutionType: "",
				size: "",
				licenseNumber: "",
			};
		},
	},
});

export const {
	updateFormOne,
	updateFormTwo,
	updateFormThree,
	resetOnboardingState,
} = onboardingSlice.actions;
export default onboardingSlice.reducer;
