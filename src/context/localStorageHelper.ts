// localStorageHelper.ts
export const updateOnboardingData = (
  formKey: string,
  values: Record<string, unknown>
): void => {
  // Retrieve the current combined data or initialize as empty object
  const existingData = JSON.parse(localStorage.getItem("onboardingData") || "{}");
  // Merge in the new values under the given form key (e.g., "formOne")
  const updatedData = { ...existingData, [formKey]: values };
  localStorage.setItem("onboardingData", JSON.stringify(updatedData));
};

export const getOnboardingData = (formKey: string): Record<string, unknown> => {
  // Retrieve the current data from localStorage
  const data = JSON.parse(localStorage.getItem("onboardingData") || "{}");
  return data[formKey] || {};
};
