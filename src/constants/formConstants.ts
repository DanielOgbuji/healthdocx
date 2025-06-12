export const INITIAL_RESEND_TIMER = 30; // 30 seconds
export const MAX_RESEND_ATTEMPTS = 4;
export const RESEND_TIMER_INCREMENT = 30; // Increases by 30 seconds each time

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
