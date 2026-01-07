import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
  completedSteps: boolean[];
}

const initialState: OnboardingState = {
  completedSteps: [false, false, false, false, false], // one for each step
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    completeStep: (state, action: PayloadAction<number>) => {
      state.completedSteps[action.payload] = true;
    },
    resetSteps: (state) => {
      state.completedSteps = initialState.completedSteps.slice();
    },
  },
});

export const { completeStep, resetSteps } = onboardingSlice.actions;
export default onboardingSlice.reducer;