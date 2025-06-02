// src/utils/password-utils.ts
export const PASSWORD_MIN_LENGTH = 8;

// Shared regex patterns
const PASSWORD_REGEX = {
	UPPER: /[A-Z]/,
	LOWER: /[a-z]/,
	NUMBER: /[0-9]/,
	SPECIAL_CHAR: /[!@#$%^&*(),._?":{}|<>]/,
	REPEATING_CHARS: /(.)\1\1/,
};

const { UPPER, LOWER, NUMBER, SPECIAL_CHAR, REPEATING_CHARS } = PASSWORD_REGEX;

export const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;

    const hasUpper = UPPER.test(pwd);
    const hasLower = LOWER.test(pwd);
    const hasNumber = NUMBER.test(pwd);
    const specialChars = (pwd.match(/[!@#$%^&*(),._?":{}|<>]/g) || []).length;
    const hasSpecialChar = specialChars > 0;

    let strength = 0;
    if (hasUpper && hasLower) strength++;
    if (hasNumber && hasSpecialChar) strength++;
    if (specialChars >= 2) strength++;
    if (pwd.length >= PASSWORD_MIN_LENGTH) strength++;
    if (REPEATING_CHARS.test(pwd) && strength > 0) strength--;

    return Math.min(strength, 4);
};

export const validatePassword = (value: string) => {
	const errors = [];

	if (!UPPER.test(value) || !LOWER.test(value))
		errors.push("Include both uppercase and lowercase letters");
	if (!NUMBER.test(value)) errors.push("Include at least one number");
	if (!SPECIAL_CHAR.test(value))
		errors.push("Include at least one special character");
	if (REPEATING_CHARS.test(value))
		errors.push("Avoid three or more repeating characters");

	return errors.length ? errors.join(". ") : true;
};
