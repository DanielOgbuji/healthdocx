// src/store/onboardingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OnboardingState {
  formOne: Record<string, unknown>;
  formTwo: Record<string, unknown>;
  formThree: Record<string, unknown>;
}

const initialState: OnboardingState = {
  formOne: {},
  formTwo: {},
  formThree: {},
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    updateFormOne(state, action: PayloadAction<Record<string, unknown>>) {
      state.formOne = { ...state.formOne, ...action.payload };
    },
    updateFormTwo(state, action: PayloadAction<Record<string, unknown>>) {
      state.formTwo = { ...state.formTwo, ...action.payload };
    },
    updateFormThree(state, action: PayloadAction<Record<string, unknown>>) {
      state.formThree = { ...state.formThree, ...action.payload };
    },
    resetOnboardingState(state) {
      state.formOne = {};
      state.formTwo = {};
      state.formThree = {};
    },
  },
});

export const { updateFormOne, updateFormTwo, updateFormThree, resetOnboardingState } =
  onboardingSlice.actions;
export default onboardingSlice.reducer;
