import React, { useState, useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { Button, Box, Field, Fieldset, Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
	PasswordInput,
	PasswordStrengthMeter,
} from "@/components/ui/password-input";
import * as motion from "motion/react-client";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

const PASSWORD_REGEX = {
	UPPERCASE: /[A-Z]/,
	LOWERCASE: /[a-z]/,
	NUMBER: /\d/,
	SPECIAL: /[!@#$.%^&*\-_]/,
	NO_REPEATING: /(.)\1{2,}/,
};

interface FormValues {
	password: string;
	confirmPassword: string;
}

interface PasswordResetFormProps {
	onSuccess?: () => void;
}

const getPasswordStrength = (password: string): number => {
	if (!password) return 0;
	const criteria = {
		length: password.length >= PASSWORD_MIN_LENGTH,
		uppercase: PASSWORD_REGEX.UPPERCASE.test(password),
		lowercase: PASSWORD_REGEX.LOWERCASE.test(password),
		numbers: PASSWORD_REGEX.NUMBER.test(password),
		specialChar: PASSWORD_REGEX.SPECIAL.test(password),
		noRepeatingChars: !PASSWORD_REGEX.NO_REPEATING.test(password),
	};

	const strengthScore = Object.values(criteria).filter(Boolean).length;
	if (password.length < PASSWORD_MIN_LENGTH) return 0;
	if (strengthScore <= 2) return 0;
	if (strengthScore <= 4) return 1;
	if (strengthScore <= 5) return 2;
	return 3;
};

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onSuccess }) => {
	const [passwordStrength, setPasswordStrength] = useState(0);

	const memoizedValidationSchema = useMemo(
		() =>
			Yup.object({
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
				confirmPassword: Yup.string()
					.oneOf([Yup.ref("password")], "Passwords must match")
					.required("Input new password again"),
			}),
		[]
	);

	const initialValues: FormValues = {
		password: "",
		confirmPassword: "",
	};

	const formik = useFormik({
		initialValues,
		validationSchema: memoizedValidationSchema,
		validateOnChange: false,
		validateOnMount: true,
		onSubmit: () => {
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

	const handlePasswordChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			formik.handleChange(e);
			debouncedValidate();
			if (e.target.name === "password") {
				setPasswordStrength(getPasswordStrength(e.target.value));
			}
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
		<form
			onSubmit={formik.handleSubmit}
			style={{ width: "100%", height: "100%", overflow: "hidden" }}
		>
			<Box
				w="100%"
				h="100%"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				py={{ base: "12", lg: "0" }}
				overflow="hidden"
			>
				<motion.div
					initial={{ y: "100%", opacity: 0 }}
					animate={{ y: "0", opacity: 1 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					style={{ overflow: "hidden", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
				>
					<Fieldset.Root
						size="lg"
						w={{ base: "100%", lg: "lg" }}
						px={{ base: "4", lg: "8" }}
						pb={{ base: "4", lg: "8" }}
						pt={{ base: "4", lg: "8" }}
						borderStyle="solid"
						borderWidth="thin"
						borderColor="outline-variant"
						borderRadius="md"
						overflow="hidden"
					>
						<Stack alignItems="flex-start" role="banner" w="100%">
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
								Reset Password
							</Fieldset.Legend>
							<Fieldset.HelperText lineHeight="tall">
								Enter your new password
							</Fieldset.HelperText>
						</Stack>

						<Fieldset.Content colorPalette="green">
							<Field.Root {...getFieldErrorProps("password")}>
								<Field.Label htmlFor="password">
									Password
									<Field.RequiredIndicator />
								</Field.Label>
								<Stack width="100%">
									<PasswordInput
										id="password"
										placeholder="Create a password"
										name="password"
										value={formik.values.password}
										onChange={handlePasswordChange}
										onBlur={formik.handleBlur}
										aria-label="Password"
									/>
									<Field.ErrorText id="password-error">
										{formik.errors.password}
									</Field.ErrorText>
									{formik.values.password && (
										<>
											<PasswordStrengthMeter
												value={passwordStrength}
												aria-label="Password Strength"
											/>
										</>
									)}
								</Stack>
							</Field.Root>

							<Field.Root {...getFieldErrorProps("confirmPassword")}>
								<Field.Label htmlFor="confirmPassword">
									Confirm Password
									<Field.RequiredIndicator />
								</Field.Label>
								<PasswordInput
									id="confirmPassword"
									placeholder="Confirm your password"
									name="confirmPassword"
									value={formik.values.confirmPassword}
									onChange={handlePasswordChange}
									onBlur={formik.handleBlur}
									aria-label="Confirm Password"
								/>
								<Field.ErrorText id="confirmPassword-error">
									{formik.errors.confirmPassword}
								</Field.ErrorText>
							</Field.Root>
						</Fieldset.Content>

						<Button
							type="submit"
							variant="solid"
							bgColor="primary"
							color="onPrimary"
							mt={{ base: "4", lg: "8" }}
							fontWeight="bold"
							_hover={{ bgColor: "primary/85" }}
							_disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
							focusRingColor="secondary"
							disabled={!formik.isValid || formik.isSubmitting}
							aria-disabled={!formik.isValid || formik.isSubmitting}
							onClick={() => {
								if (formik.isValid) {
									formik.handleSubmit();
									window.location.href = "/reset-successful";
								}
							}}
						>
							Reset
						</Button>
					</Fieldset.Root>
				</motion.div>
			</Box>
		</form>
	);
};

export default React.memo(PasswordResetForm);
