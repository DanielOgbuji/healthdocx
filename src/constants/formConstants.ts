export const INITIAL_RESEND_TIMER = 30; // 30 seconds
export const MAX_RESEND_ATTEMPTS = 4;
export const RESEND_TIMER_INCREMENT = 30; // Increases by 30 seconds each time

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const STORAGE_KEYS = {
    ONBOARDING_EMAIL: "onboardingEmail",
    RESET_PWD_EMAIL: "resetPasswordEmail",
    RESET_PWD_OTP: "resetPasswordOtp",
};


export const ROLE_OPTIONS = [
	"IT Administrator",
	"Health Records Officer",
	"Medical Data Analyst",
	"Operations Manager",
	"Hospital Administrator",
	"Medical Researcher",
	"Healthcare Provider",
] as const;

export const INSTITUTION_TYPE_OPTIONS = [
	"Hospital",
	"Clinic",
	"Primary Health Center",
	"Veterinary",
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
	"1 - 100 staff",
	"500 - 1,000 staff",
	"1,000 - 10,000",
	"15,000 - 20,000",
	"20,000 and more",
] as const;
