// src/context/onboardingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FormOneResponse {
	user: {
		name: string;
		email: string;
		role: string;
		phone: string;
		id: number;
		is_active: boolean;
		email_verified: boolean;
		organization: {
			id: number;
			name: string;
			status: string;
			is_active: boolean;
		};
		is_organization_admin: boolean;
		registration_completed: boolean;
		onboarding_completed: boolean;
		last_onboarding_step: number;
	};
	access_token: string;
	token_type: string;
}

export interface FormTwoResponse {
	message: string;
	is_verified: boolean;
}

export interface FormThreeResponse {
	institutionName: string;
	adminstration_id: string;
	licenseNumber: string;
	institutionType: string;
	size: string;
	location: string;
	phone: string;
	email: string;
	website: string;
	description: string;
	id: number;
	is_active: boolean;
	status: "Pending" | "Approved" | "Rejected";
	created_at: string;
	created_by: number;
	updated_at: string;
	updated_by: number;
	verification_notes: string;
	verified_at: string;
	verified_by: string;
}

export interface OnboardingState {
	formOne: FormOneResponse | null;
	formTwo: {
		is_verified: boolean;
	};
	formThree: FormThreeResponse | null;
}

const initialState: OnboardingState = {
	formOne: null,
	formTwo: {
		is_verified: false,
	},
	formThree: null,
};

const onboardingSlice = createSlice({
	name: "onboarding",
	initialState,
	reducers: {
		updateFormOne: (state, action: PayloadAction<FormOneResponse>) => {
			state.formOne = action.payload;
		},
		updateFormTwo: (state, action: PayloadAction<{ is_verified: boolean }>) => {
			state.formTwo = action.payload;
		},
		updateFormThree: (state, action: PayloadAction<FormThreeResponse>) => {
			state.formThree = action.payload;
		},
		resetOnboardingState: (state) => {
			state.formOne = null;
			state.formTwo = {
				is_verified: false,
			};
			state.formThree = null;
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
