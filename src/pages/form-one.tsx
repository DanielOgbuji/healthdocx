import React, { useState, useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import {
	Button,
	Group,
	Field,
	Fieldset,
	Image,
	Input,
	InputAddon,
	Link,
	Stack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateFormOne } from "@/store/onboardingSlice";
import {
	NativeSelectField,
	NativeSelectRoot,
} from "@/components/ui/native-select";
import {
	PasswordInput,
	PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { InfoTip } from "@/components/ui/toggle-tip";
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

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

const PASSWORD_REGEX = {
	UPPERCASE: /[A-Z]/,
	LOWERCASE: /[a-z]/,
	NUMBER: /\d/,
	SPECIAL: /[!@#$.%^&*\-_]/,
	MULTIPLE_SPECIAL: /[!@#$.%^&*\-_]/g,
	NO_REPEATING: /(.)\1{2,}/,
	MIXED: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
};

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

const getPasswordStrength = (password: string): number => {
	if (!password) return 0;
	const criteria = {
		length: password.length >= PASSWORD_MIN_LENGTH,
		multipleSpecialChars:
			(password.match(PASSWORD_REGEX.MULTIPLE_SPECIAL) || []).length > 1,
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

const OnBoardingFormOne: React.FC<OnBoardingFormOneProps> = ({
	legendText,
	helperText,
	onSuccess,
}) => {
	const dispatch = useDispatch();
	const [passwordStrength, setPasswordStrength] = useState(0);

	// Memoize the validation schema to prevent its recreation on every render
	const memoizedValidationSchema = useMemo(
		() =>
			Yup.object({
				name: Yup.string()
					.required("Full name is required")
					.max(50, "Must not exceed 50 characters")
					.test(
						"min-length-each",
						"Each name must be at least 2 characters long",
						(value) =>
							value
								?.trim()
								.split(/\s+/)
								.every((part) => part.length >= 2)
					)
					.matches(
						/^(?:\p{L}+(?:[-']\p{L}+)*)\s+(?:\p{L}+(?:[-']\p{L}+)*)\s+(?:\p{L}+(?:[-']\p{L}+)*)$/u,
						"Enter your first, middle, and last name (letters, hyphens, and apostrophes only)"
					),
				email: Yup.string()
					.email("Invalid email format")
					.max(254, "Email must not exceed 254 characters")
					.required("Email is required"),
				phone: Yup.string()
					.matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
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
					.matches(
						PASSWORD_REGEX.UPPERCASE,
						"Password must contain at least one uppercase letter"
					)
					.matches(
						PASSWORD_REGEX.LOWERCASE,
						"Password must contain at least one lowercase letter"
					)
					.matches(
						PASSWORD_REGEX.NUMBER,
						"Password must contain at least one number"
					)
					.matches(
						PASSWORD_REGEX.SPECIAL,
						"Password must contain at least one special character"
					)
					.test(
						"no-repeating-chars",
						"Password cannot contain repeating characters",
						(value) => (value ? !PASSWORD_REGEX.NO_REPEATING.test(value) : true)
					)
					.required("Password is required"),
				role: Yup.string()
					.oneOf([...ROLE_OPTIONS], "Please select a valid role")
					.required("Role is required"),
			}),
		[]
	);

	const initialValues: FormValues = {
		name: "",
		email: "",
		role: "",
		phone: "",
		password: "",
	};

	const formik = useFormik({
		initialValues,
		validationSchema: memoizedValidationSchema,
		validateOnChange: false,
		validateOnMount: true,
		onSubmit: (values) => {
			//console.log("Form Submitted:", values);
			dispatch(updateFormOne(values as unknown as Record<string, unknown>));
			onSuccess?.();
		},
	});

	const debouncedValidate = useCallback(
		debounce(() => formik.validateForm(), 400),
		[formik.validateForm]
	);

	useEffect(() => {
		return () => {
			debouncedValidate.cancel();
		};
	}, [debouncedValidate]);

	const handleChangeDebounced = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			formik.handleChange(e);
			debouncedValidate();
		},
		[formik.handleChange, debouncedValidate]
	);

	const handlePasswordChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			formik.handleChange(e);
			debouncedValidate();
			setPasswordStrength(getPasswordStrength(e.target.value));
		},
		[formik.handleChange, debouncedValidate]
	);

	const getFieldErrorProps = useCallback(
		(fieldName: keyof FormValues) => ({
			invalid: formik.touched[fieldName] && !!formik.errors[fieldName],
			required: true,
			"aria-invalid": formik.touched[fieldName] && !!formik.errors[fieldName],
			"aria-describedby": `${fieldName}-error`,
		}),
		[formik.touched, formik.errors]
	);

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
						display="flex"
						alignItems="center"
						gap="2"
						aria-level={1}
						mb="4px"
					>
						{legendText}{" "}
						<InfoTip
							content={
								<>
									We will never share your information.{" "}
									<Link href="#" variant="underline" width="fit-content">
										Our Privacy Policy
									</Link>
								</>
							}
						/>
					</Fieldset.Legend>
					<Fieldset.HelperText textAlign="center">{helperText}</Fieldset.HelperText>
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
								title="Enter your full name"
								name="name"
								type="text"
								value={formik.values.name}
								onChange={handleChangeDebounced}
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
								onChange={handleChangeDebounced}
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
								onChange={handleChangeDebounced}
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
								title="Enter your 10 digit phone number."
								name="phone"
								type="tel"
								value={formik.values.phone}
								onChange={handleChangeDebounced}
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
							{formik.values.password && (
								<>
									<Field.ErrorText id="password-error">
										{formik.errors.password}
									</Field.ErrorText>
									<PasswordStrengthMeter
										value={passwordStrength}
										aria-label="Password Strength"
									/>
								</>
							)}
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

export default React.memo(OnBoardingFormOne);
