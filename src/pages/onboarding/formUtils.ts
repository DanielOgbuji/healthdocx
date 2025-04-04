import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "./formConstants";

export const formatPhoneNumber = (phone: string) => {
	// Remove all non-digits
	const cleaned = phone.replace(/\D/g, "");

	// Format as XXX-XXX-XXXX
	if (cleaned.length >= 10) {
		return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
	}

	return cleaned;
};
export const getPasswordStrength = (password: string): number => {
	if (!password) return 0;
	const criteria = {
		length: password.length >= PASSWORD_MIN_LENGTH,
		multipleSpecialChars: (password.match(PASSWORD_REGEX.MULTIPLE_SPECIAL) || []).length > 1,
		uppercase: PASSWORD_REGEX.UPPERCASE.test(password),
		lowercase: PASSWORD_REGEX.LOWERCASE.test(password),
		numbers: PASSWORD_REGEX.NUMBER.test(password),
		specialChar: PASSWORD_REGEX.SPECIAL.test(password),
		noRepeatingChars: !PASSWORD_REGEX.NO_REPEATING.test(password),
		mixedChars: PASSWORD_REGEX.MIXED.test(password),
	};

	const strengthScore = Object.values(criteria).filter(Boolean).length;
	if (password.length < PASSWORD_MIN_LENGTH) return 0;
	if (strengthScore <= 2) return 0;
	if (strengthScore <= 4) return 1;
	if (strengthScore <= 6) return 2;
	if (strengthScore <= 7) return 3;
	return 4;
};
