import {
	Box,
	Button,
	Field,
	Fieldset,
	Image,
	Input,
	Link,
	Stack,
	Text,
} from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/images/Off-Jeay.svg";
import LogoDark from "@/assets/images/Off-Jeay-Dark.svg";
import { useColorMode } from "@/components/ui/color-mode";
import * as motion from "motion/react-client";

interface SignInValues {
	email: string;
	password: string;
}
export type { SignInValues };

interface SignInProps {
	legendText: string;
	helperText: string;
}

const validationSchema = yup.object({
	email: yup
		.string()
		.email("Invalid email address")
		.required("Email is required"),
	password: yup.string().required("Password is required"),
});

const SignIn: React.FC<SignInProps> = ({ legendText, helperText }) => {
	const { colorMode } = useColorMode();
	const navigate = useNavigate(); // Add this hook to navigate after form submission

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validateOnMount: true,
		validationSchema,
		onSubmit: (values) => {
			console.log("Form submitted with values:", values);
			navigate("/home");
		},
	});

	// Get error props for form fields
	const getFieldErrorProps = useCallback(
		(fieldName: keyof SignInValues) => ({
			invalid: formik.touched[fieldName] && !!formik.errors[fieldName],
			required: true,
			"aria-invalid": formik.touched[fieldName] && !!formik.errors[fieldName],
			"aria-describedby": `${fieldName}-error`,
		}),
		[formik.touched, formik.errors]
	);

	return (
		<form className="onboarding-form" onSubmit={formik.handleSubmit}>
			<Fieldset.Root size="lg" maxW="lg" width={{ base: "80%", lg: "lg" }}>
				<Stack alignItems="center">
					<Image
						src={colorMode === "dark" ? LogoDark : Logo}
						mb="12px"
						width="48px"
						height="48px"
						alt="Company Logo"
						loading="lazy"
					/>
					<Fieldset.Legend
						fontWeight="bold"
						fontSize="2xl"
						display="flex"
						alignItems="center"
						gap="2"
						aria-level={1}
						mb="4px"
					>
						{legendText}
					</Fieldset.Legend>
					<Fieldset.HelperText>{helperText}</Fieldset.HelperText>
				</Stack>

				<Fieldset.Content colorPalette="green">
					<Field.Root {...getFieldErrorProps("email")}>
						<Field.Label>Email Address or Administrator ID</Field.Label>
						<Input
							name="email"
							placeholder="Enter your email or Admin ID"
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<Field.ErrorText id="email-error">
							{formik.errors.email}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root {...getFieldErrorProps("password")}>
						<Field.Label>Password</Field.Label>
						<Input
							name="password"
							type="password"
							placeholder="Enter password"
							value={formik.values.password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<Field.ErrorText id="password-error">
							{formik.errors.password}
						</Field.ErrorText>
					</Field.Root>
				</Fieldset.Content>

				<Box textAlign="right">
					<Link href="/forgot-password" variant="underline">
						<Text fontSize="14px" cursor="pointer">
							Forgot password
						</Text>
					</Link>
				</Box>

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
					Access Workspace
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

export default SignIn;
