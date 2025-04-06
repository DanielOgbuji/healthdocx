import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { debounce } from "lodash";
import {
	Button,
	Box,
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
import { updateFormOne } from "@/context/onboardingSlice";
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
import Logo from "@/assets/images/Off-Jeay.svg";
import LogoDark from "@/assets/images/Off-Jeay-Dark.svg";
import NigerianFlag from "@/assets/images/ng.png";
import * as motion from "motion/react-client";
import {
	RoleType,
	PASSWORD_MIN_LENGTH,
	PASSWORD_REGEX,
	PASSWORD_MAX_LENGTH,
	ROLE_OPTIONS,
} from "./formConstants";
import { formatPhoneNumber, getPasswordStrength } from "@/utils/forms/formUtils";

interface FormOneValues {
	name: string;
	email: string;
	role: RoleType | "";
	phone: string;
	password: string;
}
export type { FormOneValues };

interface OnBoardingFormOneProps {
	legendText: string;
	helperText: string;
	onSuccess?: () => void;
}

const OnBoardingFormOne: React.FC<OnBoardingFormOneProps> = ({
	legendText,
	helperText,
	onSuccess,
}) => {
	const { colorMode } = useColorMode();
	const dispatch = useDispatch();
	const [passwordStrength, setPasswordStrength] = useState(0);

	// Memoized validation schema for form fields
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
						// Ensure the regex matches your requirements
						/^(?:\p{L}+(?:[-']\p{L}+)*)\s+(?:\p{L}+(?:[-']\p{L}+)*)\s+(?:\p{L}+(?:[-']\p{L}+)*)$/u,
						"Enter your first, middle, and last name (letters, hyphens, and apostrophes only)"
					),
				email: Yup.string()
					.email("Invalid email format")
					.max(254, "Email must not exceed 254 characters")
					.required("Email is required"),
				phone: Yup.string()
					.matches(
						/^\d{3}-\d{3}-\d{4}$/,
						"Phone number must be 10 digits in the format 999-999-9999"
					)
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

	// Initial form values
	const initialValues: FormOneValues = {
		name: "",
		email: "",
		role: "",
		phone: "",
		password: "",
	};

	// Formik setup for form handling
	const formik = useFormik({
		initialValues,
		validationSchema: memoizedValidationSchema,
		validateOnChange: false,
		validateOnMount: true,
		onSubmit: async (values) => {
			try {
				// Uncomment the following block to simulate submission to a real backend in production.
				/*
				const response = await fetch("/api/submit", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				});
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const result = await response.json();
				// Optionally, we can handle the result (display a success message)
				*/
				dispatch(updateFormOne(values));
				onSuccess?.();
			} catch (error) {
				// Handle error appropriately in production
				console.error("Error submitting form:", error);
			}
		},
	});

	// Debounced validation to improve performance
	const debouncedValidate = useCallback(
		debounce(() => formik.validateForm(), 400),
		[formik.validateForm]
	);

	// Cleanup debounced validation on unmount
	useEffect(() => {
		return () => {
			debouncedValidate.cancel();
		};
	}, [debouncedValidate]);

	// Handle autofill for phone input
	useEffect(() => {
		const handleAutofill = () => {
			const phoneInput = document.getElementById("phone") as HTMLInputElement;
			if (phoneInput && phoneInput.value) {
				const formatted = formatPhoneNumber(phoneInput.value);
				formik.setFieldValue("phone", formatted, false);
			}
		};

		const phoneInput = document.getElementById("phone");
		if (phoneInput) {
			phoneInput.addEventListener("animationstart", handleAutofill);
			phoneInput.addEventListener("animationiteration", handleAutofill);
			phoneInput.addEventListener("animationend", handleAutofill);
			return () => {
				phoneInput.removeEventListener("animationstart", handleAutofill);
				phoneInput.removeEventListener("animationiteration", handleAutofill);
				phoneInput.removeEventListener("animationend", handleAutofill);
			};
		}
	}, [formik.setFieldValue]);

	// Handle input changes with debounced validation
	const handleChangeDebounced = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			formik.handleChange(e);
			debouncedValidate();
		},
		[formik.handleChange, debouncedValidate]
	);

	// Handle password input changes and update strength meter
	const handlePasswordChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			formik.handleChange(e);
			debouncedValidate();
			setPasswordStrength(getPasswordStrength(e.target.value));
		},
		[formik.handleChange, debouncedValidate]
	);

	// Get error props for form fields
	const getFieldErrorProps = useCallback(
		(fieldName: keyof FormOneValues) => ({
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
				{/* Form Header */}
				<Stack alignItems="center" role="banner">
					<Image
						src={colorMode === "dark" ? LogoDark : Logo}
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
						color="onBackground"
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
					<Fieldset.HelperText textAlign="center">
						{helperText}
					</Fieldset.HelperText>
				</Stack>

				{/* Form Fields */}
				<Fieldset.Content colorPalette="green">
					{/* Full Name Field */}
					<Field.Root {...getFieldErrorProps("name")}>
						<Field.Label htmlFor="name">
							Full Name
							<Field.RequiredIndicator />
						</Field.Label>
						<InputGroup
							flex="1"
							startElement={
								<Box className="material-symbols-outlined">person</Box>
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

					{/* Email Address Field */}
					<Field.Root {...getFieldErrorProps("email")}>
						<Field.Label htmlFor="email">
							Email Address
							<Field.RequiredIndicator />
						</Field.Label>
						<InputGroup
							flex="1"
							startElement={
								<Box
									className="material-symbols-outlined"
									style={{ fontSize: "22px" }}
								>
									mail
								</Box>
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

					{/* Role Field */}
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

					{/* Phone Number Field */}
					<Field.Root {...getFieldErrorProps("phone")}>
						<Field.Label htmlFor="phone">
							Phone Number
							<Field.RequiredIndicator />
						</Field.Label>
						<Group attached width="100%">
							<InputAddon aria-label="Country Code">
								<img src={NigerianFlag} alt="Nigerian Flag" />
								&nbsp;+234
							</InputAddon>
							<Input
								id="phone"
								placeholder="Enter your phone number"
								title="Enter your 10 digit phone number."
								name="phone"
								type="tel"
								value={formik.values.phone}
								onChange={(e) => {
									const formatted = formatPhoneNumber(e.target.value);
									formik.setFieldValue("phone", formatted);
								}}
								onBlur={formik.handleBlur}
								aria-label="Phone Number"
							/>
						</Group>
						<Field.ErrorText id="phone-error">
							{formik.errors.phone}
						</Field.ErrorText>
					</Field.Root>

					{/* Password Field */}
					<Field.Root {...getFieldErrorProps("password")}>
						<Field.Label htmlFor="password">
							Password
							<Field.RequiredIndicator />
						</Field.Label>
						<Stack width="100%">
							<InputGroup
								flex="1"
								startElement={
									<Box
										className="material-symbols-outlined"
										style={{
											fontSize: "22px",
											fontVariationSettings: "'opsz' 48",
										}}
									>
										password
									</Box>
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
							{formik.values.password && (
								<PasswordStrengthMeter
									value={passwordStrength}
									aria-label="Password Strength"
								/>
							)}
						</Stack>
					</Field.Root>
				</Fieldset.Content>

				{/* Submit Button */}
				<Button
					type="submit"
					variant="solid"
					bgColor="primary"
					color="onPrimary"
					fontWeight="bold"
					_hover={{ bgColor: "primary/85" }}
					_disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
					focusRingColor="secondary"
					disabled={!formik.isValid || formik.isSubmitting}
					aria-disabled={!formik.isValid || formik.isSubmitting}
				>
					Get Started
					<Box className="material-symbols-outlined" fontSize="lg">
						{!formik.isSubmitting && formik.isValid && (
							<motion.div
								initial={{ transform: "translateX(0px)" }}
								animate={{
									transform: [
										"translateX(10px)",
										"translate(0px)",
										"translateX(10px)",
									],
								}}
								transition={{
									ease: "easeInOut",
									duration: 1,
									repeat: Infinity,
								}}
							>
								arrow_forward
							</motion.div>
						)}
					</Box>
				</Button>
			</Fieldset.Root>
		</form>
	);
};

export default React.memo(OnBoardingFormOne);
