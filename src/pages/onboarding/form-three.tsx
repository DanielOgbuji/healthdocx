import React, { useMemo, useEffect, useCallback } from "react";
import { FormThreeResponse } from "@/context/onboardingSlice";
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
	Stack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateFormThree } from "@/context/onboardingSlice";
import {
	NativeSelectField,
	NativeSelectRoot,
} from "@/components/ui/native-select";
import { toaster } from "@/components/ui/toaster";
//import axios from "axios";
import Logo from "@/assets/images/Off-Jeay.svg";
import LogoDark from "@/assets/images/Off-Jeay-Dark.svg";
import { useColorMode } from "@/components/ui/color-mode";
import * as motion from "motion/react-client";
import {
	INSTITUTION_TYPE_OPTIONS,
	SIZE_OPTIONS,
	LICENSE_REGEX,
} from "@/pages/onboarding/formConstants";
import LocationInput from "@/components/ui/location-input";

// Memoized validation schema for form validation
const validationSchema = Yup.object({
	institutionName: Yup.string()
		.required("Institution name is required")
		.min(3, "Must be at least 3 characters")
		.max(100, "Must not exceed 100 characters")
		.matches(
			/^[a-zA-Z0-9&'-.\s]+$/,
			"Only letters, numbers, &, ', and hyphens are allowed"
		),
	location: Yup.string()
		.required("Location is required")
		.min(5, "Must be at least 5 characters")
		.max(100, "Must not exceed 100 characters"),
	institutionType: Yup.string()
		.oneOf(
			[...INSTITUTION_TYPE_OPTIONS],
			"Please select a valid institution type"
		)
		.required("Institution type is required"),
	size: Yup.string()
		.oneOf([...SIZE_OPTIONS], "Please select a valid size category")
		.required("Size category is required"),
	licenseNumber: Yup.string()
		.matches(
			LICENSE_REGEX,
			"License number must be a 7 digits (e.g. No. 8550483)"
		)
		.required("License number is required"),
});

export type FormThreeValues = {
	institutionName: string;
	location: string;
	institutionType: (typeof INSTITUTION_TYPE_OPTIONS)[number] | "";
	size: (typeof SIZE_OPTIONS)[number] | "";
	licenseNumber: string;
};

interface OnBoardingFormThreeProps {
	legendText: string;
	helperText: string;
	onSuccess?: () => void;
}

// Custom hook to encapsulate debounced validation logic
function useDebouncedValidation(validateForm: () => void, delay: number) {
	const debouncedValidate = useMemo(
		() => debounce(() => validateForm(), delay),
		[validateForm, delay]
	);
	// Cleanup for debounced validation
	useEffect(() => {
		return () => {
			debouncedValidate.cancel();
		};
	}, [debouncedValidate]);
	return debouncedValidate;
}

const OnBoardingFormThree: React.FC<OnBoardingFormThreeProps> = ({
	legendText,
	helperText,
	onSuccess,
}) => {
	const { colorMode } = useColorMode();
	const dispatch = useDispatch();

	// Initial form values
	const initialValues: FormThreeValues = {
		institutionName: "",
		location: "",
		institutionType: "",
		size: "",
		licenseNumber: "",
	};

	// Formik setup for form handling
	const formik = useFormik<FormThreeValues>({
		initialValues,
		validationSchema,
		validateOnChange: false,
		validateOnMount: true,
		onSubmit: async (values) => {
			// Ensure the latest location is used
			//const formThreeData = { ...values };
			formik.setSubmitting(true);
			/*
			try {
				const response = await axios.post(
					"/api/v1/organizations",
					formThreeData
				);
				if (response.status === 200) {
					dispatch(updateFormThree(response.data as FormThreeResponse));
					onSuccess?.();
					toaster.create({
						duration: 3000,
						title: "Success",
						description: "Your organization has been created successfully.",
						type: "success",
					});
				} else if (response.status === 422) {
					// Handle validation errors
					const errors: ValidationError[] = response.data.detail;
					errors.forEach((error: ValidationError) => {
						formik.setFieldError(error.loc[0], error.msg);
					});
					toaster.create({
						duration: 3000,
						title: "Error",
						description:
							"There were errors in your submission. Please correct them.",
						type: "error",
					});
				} else {
					throw new Error("Network response was not ok");
				}
			} catch (error: unknown) {
				console.error("Submission error:", error);
				let errorMessage = "An error occurred while submitting the form.";

				// Check if the error is an Axios error
				if (axios.isAxiosError(error)) {
					// Check if the error has a response
					if (error.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						errorMessage =
							error.response.data.detail?.[0]?.msg ||
							`Request failed with status code ${error.response.status}. Please try again later.`;
						console.log("Response data:", error.response.data);
						console.log("Response status:", error.response.status);
						console.log("Response headers:", error.response.headers);
					} else if (error.request) {
						// The request was made but no response was received
						// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
						// http.ClientRequest in node.js
						errorMessage =
							"No response received from the server. Please check your network connection and try again.";
						console.log("Request:", error.request);
					} else {
						// Something happened in setting up the request that triggered an Error
						errorMessage = `An unexpected error occurred: ${error.message}. Please try again.`;
						console.log("Error", error.message);
					}
				} else if (error instanceof Error) {
					// If it is a known error, use its message
					errorMessage = `An unexpected error occurred: ${error.message}. Please try again.`;
				}
				toaster.create({
					duration: 3000,
					title: "Error",
					description: errorMessage,
					type: "error",
				});
			} finally {
				formik.setSubmitting(false);
			}
		}*/
		if (formik.isValid) {
			// Perform any additional actions if needed when the form is valid
			console.log("Form is valid:", values);

			const formThreeResponse: FormThreeResponse = {
				institutionName: values.institutionName,
				location: values.location,
				institutionType: values.institutionType,
				size: values.size,
				licenseNumber: values.licenseNumber,
				adminstration_id: "", // Provide appropriate value
				phone: "", // Provide appropriate value
				email: "", // Provide appropriate value
				website: "", // Provide appropriate value
				description: "", // Provide appropriate value
				id: 0, // Provide appropriate value
				is_active: true, // Default to true or provide appropriate value
				status: "Pending", // Provide appropriate value
				created_at: new Date().toISOString(), // Provide appropriate value
				updated_at: new Date().toISOString(), // Provide appropriate value
				verification_notes: "", // Provide appropriate value
				verified_at: "", // Provide appropriate value
				created_by: 0, // Provide appropriate value
				updated_by: 0, // Provide appropriate value
				verified_by: "", // Provide appropriate value
			};
			dispatch(updateFormThree(formThreeResponse));
			onSuccess?.();
			toaster.create({
				duration: 3000,
				title: "Success",
				description: "Your institution has been created successfully.",
				type: "success",
			});
		}
	}
	});

	/*interface ValidationError {
		loc: string[];
		msg: string;
		type: string;
	}*/

	// Debounced validation to improve performance using custom hook
	const debouncedValidate = useDebouncedValidation(formik.validateForm, 300);

	// Consolidated location update handler for both user input and change events
	const handleLocationUpdate = useCallback(
		(value: string) => {
			formik.setFieldValue("location", value);
			debouncedValidate();
		},
		[formik, debouncedValidate]
	);

	// Handle blur event for the location field to mark it as touched
	const handleLocationBlur = useCallback(() => {
		formik.setFieldTouched("location", true); // Mark the field as touched
	}, [formik]);

	// Handle input changes with debounced validation
	const handleChangeDebounced = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			formik.handleChange(e);
			debouncedValidate();
		},
		[formik.handleChange, debouncedValidate]
	);

	// Get error props for fields
	const getFieldErrorProps = useCallback(
		(fieldName: keyof FormThreeValues) => ({
			invalid: formik.touched[fieldName] && !!formik.errors[fieldName],
			required: true,
			"aria-invalid": formik.touched[fieldName] && !!formik.errors[fieldName],
			"aria-describedby": `${fieldName}-error`,
		}),
		[formik.touched, formik.errors]
	);

	return (
		<form onSubmit={formik.handleSubmit} className="onboarding-form">
			{/* Form header */}
			<Fieldset.Root size="lg" maxW="lg">
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
						aria-level={1}
						mb="4px"
						textAlign="center"
					>
						{legendText}
					</Fieldset.Legend>
					<Fieldset.HelperText textAlign="center">
						{helperText}
					</Fieldset.HelperText>
				</Stack>

				{/* Form fields */}
				<Fieldset.Content colorPalette="green">
					{/* Institution Name Field */}
					<Field.Root {...getFieldErrorProps("institutionName")}>
						<Field.Label htmlFor="institutionName">
							Institution Name
							<Field.RequiredIndicator />
						</Field.Label>
						<Input
							autoFocus
							id="institutionName"
							placeholder="Add the corporate name"
							name="institutionName"
							type="text"
							value={formik.values.institutionName}
							onChange={handleChangeDebounced}
							onBlur={formik.handleBlur}
							aria-label="Institution Name - Add the corporate name"
						/>
						<Field.ErrorText id="institutionName-error">
							{formik.errors.institutionName}
						</Field.ErrorText>
					</Field.Root>

					{/* Location Field */}
					<Field.Root {...getFieldErrorProps("location")}>
						<Field.Label htmlFor="location">
							Location
							<Field.RequiredIndicator />
						</Field.Label>
						<LocationInput
							value={formik.values.location}
							error={formik.errors.location}
							onPlaceSelect={handleLocationUpdate}
							onUserInput={handleLocationUpdate}
							onChange={handleLocationUpdate} // Using consolidated update handler
							onBlur={handleLocationBlur}
						/>
						<Field.HelperText>
							Enter your location manually if it isn&apos;t listed.
						</Field.HelperText>
						<Field.ErrorText id="location-error">
							{formik.errors.location}
						</Field.ErrorText>
					</Field.Root>

					{/* Institution Type Field */}
					<Field.Root {...getFieldErrorProps("institutionType")}>
						<Field.Label htmlFor="institutionType">
							Institution Type
							<Field.RequiredIndicator />
						</Field.Label>
						<NativeSelectRoot>
							<NativeSelectField
								id="institutionType"
								title="Select institution type"
								placeholder="Choose type"
								name="institutionType"
								value={formik.values.institutionType}
								onChange={handleChangeDebounced}
								onBlur={formik.handleBlur}
								items={[...INSTITUTION_TYPE_OPTIONS]}
								aria-label="Institution Type - Choose type"
							/>
						</NativeSelectRoot>
						<Field.ErrorText id="institutionType-error">
							{formik.errors.institutionType}
						</Field.ErrorText>
					</Field.Root>

					{/* Institution Size Field */}
					<Field.Root {...getFieldErrorProps("size")}>
						<Field.Label htmlFor="size">
							Institution Size
							<Field.RequiredIndicator />
						</Field.Label>
						<NativeSelectRoot>
							<NativeSelectField
								id="size"
								title="Select staff size"
								placeholder="Choose size category"
								name="size"
								value={formik.values.size}
								onChange={handleChangeDebounced}
								onBlur={formik.handleBlur}
								items={[...SIZE_OPTIONS]}
								aria-label="Institution Size - Choose size category"
							/>
						</NativeSelectRoot>
						<Field.ErrorText id="size-error">
							{formik.errors.size}
						</Field.ErrorText>
					</Field.Root>

					{/* License Number Field */}
					<Field.Root {...getFieldErrorProps("licenseNumber")}>
						<Field.Label htmlFor="licenseNumber">
							License Number
							<Field.RequiredIndicator />
						</Field.Label>
						<Group attached width="100%">
							<InputAddon>No.</InputAddon>
							<Input
								id="licenseNumber"
								placeholder="Enter license or reg number"
								name="licenseNumber"
								type="text"
								value={formik.values.licenseNumber}
								onChange={handleChangeDebounced}
								onBlur={formik.handleBlur}
								aria-label="License Number - Enter license or reg number"
							/>
						</Group>
						<Field.HelperText>
							Must be Government-issued license or reg number.
						</Field.HelperText>
						<Field.ErrorText id="licenseNumber-error">
							{formik.errors.licenseNumber}
						</Field.ErrorText>
					</Field.Root>
				</Fieldset.Content>

				{/* Submit Button */}
				<Button
					type="submit"
					variant="solid"
					loading={formik.isSubmitting}
					disabled={!formik.isValid || formik.isSubmitting}
					aria-disabled={!formik.isValid || formik.isSubmitting}
					color="onPrimary"
					bgColor="primary"
					fontWeight="bold"
					_hover={{ bgColor: "primary/85" }}
					_disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
					focusRingColor="secondary"
					aria-label="Confirm form submission"
				>
					Confirm
					<Box className="material-symbols-outlined" fontSize="xl" aria-hidden>
						{!formik.isSubmitting && formik.isValid && (
							<motion.div
								initial={{ transform: "translateX(0px)" }}
								animate={{
									rotate: 360,
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
								send
							</motion.div>
						)}
					</Box>
				</Button>
			</Fieldset.Root>
		</form>
	);
};

export default React.memo(OnBoardingFormThree);
