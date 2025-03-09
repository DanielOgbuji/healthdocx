import React, { useState } from "react";
import {
	Button,
	Group,
	Field,
	Fieldset,
	Image,
	Input,
	InputAddon,
	Stack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateOnboardingData } from "@/context/localStorageHelper";
import {
	NativeSelectField,
	NativeSelectRoot,
} from "@/components/ui/native-select";
import {
	PasswordInput,
	PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { InputGroup } from "@/components/ui/input-group";
import Logo from "@/assets/Off-Jeay.svg";

// Constants
const ROLE_OPTIONS = [
	"IT Administrator",
	"Health Records Officer",
	"Medical Data Analyst",
	"Operations Manager",
	"Hospital Administrator",
	"Medical Researcher",
	"Healthcare Provider",
	"Other",
] as const;

// Password validation constants
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

type RoleType = (typeof ROLE_OPTIONS)[number];

interface FormValues {
	name: string;
	email: string;
	role: RoleType | "";
	phone: string;
	password: string;
}

interface OnBoardingFormOneProps {
	legendText: string;
	helperText: string;
	onSuccess?: () => void;
}

// Enhanced password strength calculation
const getPasswordStrength = (password: string): number => {
	if (!password) return 0;

	const criteria = {
		length: password.length >= PASSWORD_MIN_LENGTH,
		multipleSpecialChars: (password.match(/[!@#$.%^&*-_]/g) || []).length > 1,
		uppercase: /[A-Z]/.test(password),
		lowercase: /[a-z]/.test(password),
		numbers: /\d/.test(password),
		specialChar: /[!@#$.%^&*-_]/.test(password),
		noRepeatingChars: !/(.)\1{2,}/.test(password),
		mixedChars: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(password),
	};

	const strengthScore = Object.values(criteria).filter(Boolean).length;

	// Enhanced scoring system
	if (password.length < PASSWORD_MIN_LENGTH) return 0;
	if (strengthScore <= 2) return 0; // Weak
	if (strengthScore <= 4) return 1; // Fair
	if (strengthScore <= 6) return 2; // Good
	if (strengthScore <= 7) return 3; // Strong
	return 4; // Very Strong
};

// Enhanced validation schema
const validationSchema = Yup.object({
	name: Yup.string()
		.required("Name is required")
		.min(3, "Must be at least 3 characters")
		.max(50, "Must not exceed 50 characters")
		.matches(
			/^[a-zA-Z-]+(\s[a-zA-Z-]+){2}$/,
			"Please provide your first name, middle name, and last name"
		)
		.test(
			"name-components",
			"Each name must be at least 2 characters and contain only letters and hyphens",
			(value) => {
				if (!value) return false;
				const names = value.split(/\s+/);
				return (
					names.length === 3 &&
					names.every((name) => name.length >= 2 && /^[a-zA-Z-]+$/.test(name))
				);
			}
		),
	email: Yup.string()
		.email("Invalid email format")
		.matches(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Invalid email format"
		)
		.max(254, "Email must not exceed 254 characters")
		.required("Email is required"),
	phone: Yup.string()
		.matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
		.required("Phone number is required"),
	password: Yup.string()
		.min(
			PASSWORD_MIN_LENGTH,
			`Password must be at least ${PASSWORD_MIN_LENGTH} characters`
		)
		.max(
			PASSWORD_MAX_LENGTH,
			`Password must not exceed ${PASSWORD_MAX_LENGTH} characters`
		)
		.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
		.matches(/[a-z]/, "Password must contain at least one lowercase letter")
		.matches(/\d/, "Password must contain at least one number")
		.matches(
			/[!@#$.%^&*-_]/,
			"Password must contain at least one special character"
		)
		.test(
			"no-repeating-chars",
			"Password cannot contain repeating characters",
			(value) => (value ? !/(.)\1{2,}/.test(value) : true)
		)
		.required("Password is required"),
	role: Yup.string()
		.oneOf([...ROLE_OPTIONS], "Please select a valid role")
		.required("Role is required"),
});

const OnBoardingFormOne: React.FC<OnBoardingFormOneProps> = ({
	legendText,
	helperText,
	onSuccess,
}) => {
	const [passwordStrength, setPasswordStrength] = useState(0);

	const initialValues: FormValues = {
		name: "",
		email: "",
		role: "",
		phone: "",
		password: "",
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		validateOnChange: true,
		validateOnMount: true,
		onSubmit: (values, { resetForm }) => {
			console.log("Form Submitted:", values);
			// Update local storage for form one
			updateOnboardingData(
				"formOne",
				values as unknown as Record<string, unknown>
			);
			resetForm();
			onSuccess?.();
		},
	});

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const password = e.target.value;
		formik.handleChange(e);
		setPasswordStrength(getPasswordStrength(password));
	};

	const getFieldErrorProps = (fieldName: keyof FormValues) => ({
		invalid: formik.touched[fieldName] && !!formik.errors[fieldName],
		required: true,
		"aria-invalid": formik.touched[fieldName] && !!formik.errors[fieldName],
		"aria-describedby": `${fieldName}-error`,
	});

	return (
		<form onSubmit={formik.handleSubmit} className="onboarding-form">
			<Fieldset.Root size="lg" maxW="lg">
				<Stack alignItems="center" role="banner">
					<Image
						src={Logo}
						mb="12px"
						width="48px"
						height="48px"
						alt="Company Logo"
						loading="lazy"
					/>
					<Fieldset.Legend
						role="heading"
						fontWeight="bold"
						fontSize="2xl"
						aria-level={1}
						mb="4px"
					>
						{legendText}
					</Fieldset.Legend>
					<Fieldset.HelperText>{helperText}</Fieldset.HelperText>
				</Stack>

				<Fieldset.Content>
					<Field.Root {...getFieldErrorProps("name")}>
						<Field.Label htmlFor="name">
							Full Name
							<Field.RequiredIndicator />
						</Field.Label>
						<InputGroup
							flex="1"
							startElement={
								<span className="material-symbols-outlined">person</span>
							}
							width="100%"
						>
							<Input
								id="name"
								autoFocus
								placeholder="Enter your full name"
								title="Enter as it appears on official documents."
								name="name"
								type="text"
								value={formik.values.name}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								aria-label="Full Name"
								ps="42px"
							/>
						</InputGroup>
						<Field.ErrorText id="name-error">
							{formik.errors.name}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root {...getFieldErrorProps("email")}>
						<Field.Label htmlFor="email">
							Email Address
							<Field.RequiredIndicator />
						</Field.Label>
						<InputGroup
							flex="1"
							startElement={
								<span
									className="material-symbols-outlined"
									style={{ fontSize: "22px" }}
								>
									mail
								</span>
							}
							width="100%"
						>
							<Input
								id="email"
								placeholder="Add work email"
								name="email"
								type="email"
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								aria-label="Email Address"
								ps="42px"
							/>
						</InputGroup>
						<Field.ErrorText id="email-error">
							{formik.errors.email}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root {...getFieldErrorProps("role")}>
						<Field.Label htmlFor="role">
							Role
							<Field.RequiredIndicator />
						</Field.Label>
						<NativeSelectRoot>
							<NativeSelectField
								id="role"
								title="Select your role"
								placeholder="Choose your role"
								name="role"
								value={formik.values.role}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								items={[...ROLE_OPTIONS]}
								aria-label="Select Role"
							/>
						</NativeSelectRoot>
						<Field.ErrorText id="role-error">
							{formik.errors.role}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root {...getFieldErrorProps("phone")}>
						<Field.Label htmlFor="phone">
							Phone Number
							<Field.RequiredIndicator />
						</Field.Label>
						<Group attached width="100%">
							<InputAddon aria-label="Country Code">
								<img src="https://flagcdn.com/w20/ng.png" alt="Nigerian Flag" />
								&nbsp;+234
							</InputAddon>
							<Input
								id="phone"
								placeholder="Enter your phone number"
								title="Enter your 11 digit phone number."
								name="phone"
								type="tel"
								value={formik.values.phone}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								aria-label="Phone Number"
							/>
						</Group>
						<Field.ErrorText id="phone-error">
							{formik.errors.phone}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root {...getFieldErrorProps("password")}>
						<Field.Label htmlFor="password">
							Password
							<Field.RequiredIndicator />
						</Field.Label>
						<Stack width="100%">
							<InputGroup
								flex="1"
								startElement={
									<span
										className="material-symbols-outlined"
										style={{
											fontSize: "22px",
											fontVariationSettings: "'opsz' 48",
										}}
									>
										password
									</span>
								}
								width="100%"
							>
								<PasswordInput
									id="password"
									placeholder="Create a password"
									name="password"
									value={formik.values.password}
									onChange={handlePasswordChange}
									onBlur={formik.handleBlur}
									aria-label="Password"
									ps="44px"
								/>
							</InputGroup>
							<Field.ErrorText id="password-error">
								{formik.errors.password}
							</Field.ErrorText>
							<PasswordStrengthMeter
								value={passwordStrength}
								aria-label="Password Strength"
							/>
						</Stack>
					</Field.Root>
				</Fieldset.Content>

				<Button
					type="submit"
					variant="solid"
					disabled={!formik.isValid || formik.isSubmitting}
					aria-disabled={!formik.isValid || formik.isSubmitting}
				>
					Get Started
				</Button>
			</Fieldset.Root>
		</form>
	);
};

export default OnBoardingFormOne;
