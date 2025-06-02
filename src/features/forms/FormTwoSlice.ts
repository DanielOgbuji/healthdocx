import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FormTwoState {
    otp: string;
    isSubmitting: boolean;
    defaultPin: string[];
    resendTimer: number;
    resendAttempts: number;
}

export const initialState: FormTwoState = {
    otp: "",
    isSubmitting: false,
    defaultPin: ['', '', '', ''],
    resendTimer: 0,
    resendAttempts: 0
};

const formTwoSlice = createSlice({
	name: "formTwo",
	initialState,
	reducers: {
		setOtp: (state, action: PayloadAction<string>) => {
			state.otp = action.payload;
		},
		setIsSubmitting: (state, action: PayloadAction<boolean>) => {
			state.isSubmitting = action.payload;
		},
        setResendTimer: (state, action: PayloadAction<number>) => {
            state.resendTimer = action.payload;
        },
        incrementResendAttempts: (state) => {
            state.resendAttempts += 1;
        },
        resetResendAttempts: (state) => {
            state.resendAttempts = 0;
        }
	},
});

export const { setOtp, setIsSubmitting, setResendTimer, incrementResendAttempts, resetResendAttempts } = formTwoSlice.actions;

export default formTwoSlice.reducer;
