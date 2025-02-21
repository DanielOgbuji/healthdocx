import React, { useState } from "react";
import {
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
import {
	NativeSelectField,
	NativeSelectRoot,
} from "@/components/ui/native-select";
import {
	PasswordInput,
	PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { withMask } from "use-mask-input";

interface OnBoardingFormProps {
	legendText: string;
	helperText: string;
}

// Function to calculate password strength (0 - Weak, 1 - Fair, 2 - Good, 3 - Strong)
const getPasswordStrength = (password: string): number => {
	let strength = 0;
	if (password.length > 7) strength++;
	if ((password.match(/[!@#$%^&*]/g) || []).length > 1) strength++; // Extra point for 2+ special chars
	if (/[A-Z]/.test(password)) strength++;
	if (/[a-z]/.test(password)) strength++;
	if (/\d/.test(password)) strength++;
	if (/[!@#$%^&*]/.test(password)) strength++;

	// Normalize strength to a 0-4 scale
	if (strength <= 2) return 0; // Weak
	if (strength === 3) return 1; // Fair
	if (strength === 4) return 2; // Good
	if (strength === 5) return 3; // Strong
	return 4; // Strong
};

const validationSchema = Yup.object({
	name: Yup.string()
		.min(3, "Must be at least 3 characters")
		.required("Name is required"),
	email: Yup.string()
		.email("Invalid email format")
		.required("Email is required"),
	phone: Yup.string()
		.matches(
			/^\([0-9]\) \d{2}-\d{3}-\d{5}$/,
			"Phone number must be exactly 11 digits"
		)
		.required("Phone number is required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
		.matches(/[a-z]/, "Password must contain at least one lowercase letter")
		.matches(/\d/, "Password must contain at least one number")
		.matches(
			/[!@#$%^&*]/,
			"Password must contain at least one special character"
		)
		.required("Password is required"),
});

const OnBoardingForm: React.FC<OnBoardingFormProps> = ({
	legendText,
	helperText,
}) => {
	const [passwordStrength, setPasswordStrength] = useState(0);

	const formik = useFormik({
		initialValues: { name: "", email: "", password: "", phone: "" },
		validationSchema: validationSchema,
		onSubmit: (values) => {
			console.log("Form Submitted:", values);
		},
	});

	// Handle password input change
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const password = e.target.value;
		formik.handleChange(e);
		setPasswordStrength(getPasswordStrength(password));
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<Fieldset.Root size="lg" maxW="lg">
				<Stack alignItems="center">
					<Image src="src/assets/Off-Jeay.svg" mb="12px" />
					<Fieldset.Legend>{legendText}</Fieldset.Legend>
					<Fieldset.HelperText textAlign="center">
						{helperText}
					</Fieldset.HelperText>
				</Stack>

				<Fieldset.Content>
					<Field.Root invalid={formik.touched.name && !!formik.errors.name}>
						<Field.Label>Full Name</Field.Label>
						<Input
							placeholder="Enter as it appears on official documents"
							name="name"
                            type="text"
							value={formik.values.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<Field.ErrorText>{formik.errors.name}</Field.ErrorText>
					</Field.Root>

					<Field.Root invalid={formik.touched.email && !!formik.errors.email}>
						<Field.Label>Email Address</Field.Label>
						<Input
							placeholder="Add work email"
							name="email"
                            type="email"
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<Field.ErrorText>{formik.errors.email}</Field.ErrorText>
					</Field.Root>

					<Field.Root>
						<Field.Label>Role</Field.Label>
						<NativeSelectRoot>
							<NativeSelectField
								items={[
									"Nil",
									"IT Administrator",
									"Health Records Officer",
									"Medical Data Analyst",
									"Operations Manager",
									"Hospital Administrator",
									"Medical Researcher",
									"Healthcare Provider",
								]}
							/>
						</NativeSelectRoot>
					</Field.Root>

					<Field.Root invalid={formik.touched.phone && !!formik.errors.phone}>
						<Field.Label>Phone Number</Field.Label>
						<Group attached width="100%">
							<InputAddon>+234</InputAddon>
							<Input
								placeholder="(9) 99-999-99999"
								ref={withMask("(9) 99-999-99999")}
								name="phone"
                                type="tel"
								value={formik.values.phone}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</Group>
						<Field.ErrorText>{formik.errors.phone}</Field.ErrorText>
					</Field.Root>

					<Field.Root
						invalid={formik.touched.password && !!formik.errors.password}
					>
						<Field.Label>Password</Field.Label>
						<Stack width="100%">
							<PasswordInput
								placeholder="Enter a password"
								name="password"
								value={formik.values.password}
								onChange={handlePasswordChange} // Use custom handler
								onBlur={formik.handleBlur}
							/>
							<Field.ErrorText>{formik.errors.password}</Field.ErrorText>
							<PasswordStrengthMeter value={passwordStrength} />
						</Stack>
					</Field.Root>
				</Fieldset.Content>
			</Fieldset.Root>
		</form>
	);
};

export default OnBoardingForm;
