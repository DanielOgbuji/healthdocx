// Constants
"use client";

/*--- For form-two.tsx ---*/
export const ROLE_OPTIONS = [
	"IT Administrator",
	"Health Records Officer",
	"Medical Data Analyst",
	"Operations Manager",
	"Hospital Administrator",
	"Medical Researcher",
	"Healthcare Provider",
	"Other",
] as const;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;
export const PASSWORD_REGEX = {
	UPPERCASE: /[A-Z]/,
	LOWERCASE: /[a-z]/,
	NUMBER: /\d/,
	SPECIAL: /[!@#$.%^&*\-_]/,
	MULTIPLE_SPECIAL: /[!@#$.%^&*\-_]/g,
	NO_REPEATING: /(.)\1{2,}/,
	MIXED: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
};
export type RoleType = (typeof ROLE_OPTIONS)[number];


/*--- For form-two.tsx ---*/
// NOTE to self: Client-side OTP validation is insecure.
export const CORRECT_OTP = import.meta.env.VITE_CORRECT_OTP; // Default for testing - remove in production

export const RESEND_TIMER_INCREMENT = parseInt(
	import.meta.env.VITE_RESEND_TIMER_INCREMENT,
	10
);
export const INITIAL_RESEND_TIMER = parseInt(
	import.meta.env.VITE_INITIAL_RESEND_TIMER,
	10
);
// Number of resend attempts allowed before resetting the timer
export const MAX_RESEND_ATTEMPTS = 3;


/*--- For form-three.tsx ---*/
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
export const LICENSE_REGEX = /^\d{7}$/;
