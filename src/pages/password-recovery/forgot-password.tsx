"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	Field,
	Fieldset,
	Flex,
	Stack,
	Input,
	Link,
} from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AnimatePresence, motion } from "motion/react";

interface FormValues {
	email: string;
}

const ForgotPassword: React.FC = () => {
	const navigate = useNavigate(); // Add this hook to navigate after form submission
	const [isVisible, setIsVisible] = useState(true);
	// Memoize the validation schema
	const memoizedValidationSchema = useMemo(
		() =>
			Yup.object({
				email: Yup.string()
					.email("Invalid email format")
					.max(254, "Email must not exceed 254 characters")
					.required("Email is required"),
			}),
		[]
	);

	const initialValues: FormValues = {
		email: "",
	};

	const formik = useFormik({
		initialValues,
		validationSchema: memoizedValidationSchema,
		validateOnChange: true,
		validateOnMount: true,
		onSubmit: async (values) => {
			// Handle form submission logic here
			console.log("Password reset email submitted:", values);

			// Example API call to the backend for sending a password reset email
			// Uncomment and replace with your actual API endpoint and logic
			/*
			try {
				const response = await fetch('/api/password-recovery', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email: values.email }),
				});

				if (response.ok) {
					// Handle successful response
					setIsVisible(false);
				setTimeout(() => {
                        navigate('/verify-email');  // Use navigate instead
                    }, 500);
					console.log('Password reset email sent successfully');
				} else {
					// Handle error response
					console.error('Failed to send password reset email');
				}
			} catch (error) {
				// Handle network or other errors
				console.error('An error occurred:', error);
			}
			*/

			// Logic moved from the button's onClick
			if (formik.isValid) {
				setIsVisible(false);
				setTimeout(() => {
					navigate('/verify-email');  // Use navigate instead
				}, 500);
			}
		},
	});

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
			className="password-recovery"
		>
			<Box
				w="100%"
				h="100%"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				py={{ base: "0px", lg: "12" }}
				px="4"
				overflow="hidden"
				css={{
					"& > *": {
						shadow: "0px -42px 200px 0px var(--shadow-color)",
						shadowColor: "primary/20",
						borderRadius: "md",
					},
				}}
			>
				<AnimatePresence initial={true}>
					{isVisible ? (
						<motion.div
							initial={{ y: "100%", opacity: 0 }}
							animate={{ y: "0", opacity: 1 }}
							exit={{ opacity: 0, y: "-100%" }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							style={{ overflow: "hidden" }}
							key="box"
						>
							<Fieldset.Root
								size="lg"
								w={{ base: "100%", lg: "lg" }}
								px={{ base: "4", lg: "8" }}
								pb={{ base: "4", lg: "6" }}
								pt={{ base: "4", lg: "8" }}
								borderStyle="solid"
								borderWidth="thin"
								borderColor="outline/40"
								borderRadius="md"
								bgGradient="to-t"
								gradientFrom="transparent"
								gradientTo="primary/15"
								overflow="hidden"
								backdropFilter={"blur(1.25px)"}
							>
								<Stack alignItems="flex-start" role="banner" w="100%">
									<Fieldset.Legend
										role="heading"
										fontWeight="bold"
										color="onSurface"
										fontSize="2xl"
										display="flex"
										alignItems="center"
										gap="2"
										aria-level={1}
										mb="4px"
									>
										Password recovery
									</Fieldset.Legend>
									<Fieldset.HelperText lineHeight="tall">
										Please enter your account email, and we&apos;ll send an OTP
										to reset your password.
									</Fieldset.HelperText>
								</Stack>

								<Fieldset.Content colorPalette="green">
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
												autoFocus
												placeholder="Enter your email"
												name="email"
												type="email"
												aria-label="Email Address"
												ps="42px"
												value={formik.values.email}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											/>
										</InputGroup>
										<Field.ErrorText id="email-error">
											{formik.errors.email}
										</Field.ErrorText>
									</Field.Root>
								</Fieldset.Content>
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
									loading={formik.isSubmitting} // Add this line for loading state
									loadingText="Submitting..." // Optional: Text to display while loading
								>
									Submit
								</Button>
								<Flex w="full" fontSize="sm" gap="1" alignItems="center" mt="6">
									<Box className="material-symbols-outlined" color="primary">
										arrow_circle_left
									</Box>
									<Link href="/" variant="plain">
										Back to login
									</Link>
								</Flex>
							</Fieldset.Root>
						</motion.div>
					) : null}
				</AnimatePresence>
			</Box>
		</form>
	);
};

export default ForgotPassword;
