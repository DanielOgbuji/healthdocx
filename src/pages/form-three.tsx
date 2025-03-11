import React, { useState, useMemo, useEffect, useCallback } from "react";
import { debounce } from "lodash";
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
import {
	GeoapifyGeocoderAutocomplete,
	GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { updateFormThree } from "@/store/onboardingSlice";
import {
	NativeSelectField,
	NativeSelectRoot,
} from "@/components/ui/native-select";
import Logo from "@/assets/Off-Jeay.svg";

// Constants
const INSTITUTION_TYPE_OPTIONS = [
	"Hospital",
	"Clinic",
	"Specialist Hospital",
	"Diagnostic Center",
	"Laboratory",
	"Pharmacy",
	"Rehabilitation Center",
	"Other",
] as const;

const SIZE_OPTIONS = [
	"Small (1 - 50 staff)",
	"Medium (51 - 150 staff)",
	"Large (151 - 250 staff)",
	"Enterprise (250+ staff)",
] as const;

const LICENSE_REGEX = /\d{7}$/;

type InstitutionType = (typeof INSTITUTION_TYPE_OPTIONS)[number];
type SizeType = (typeof SIZE_OPTIONS)[number];

interface FormValues {
	institutionName: string;
	location: string;
	institutionType: InstitutionType | "";
	size: SizeType | "";
	licenseNumber: string;
}

interface OnBoardingFormThreeProps {
	legendText: string;
	helperText: string;
	onSuccess?: () => void;
}

const OnBoardingFormThree: React.FC<OnBoardingFormThreeProps> = ({
	legendText,
	helperText,
	onSuccess,
}) => {
	const dispatch = useDispatch();
	const [rawLocation, setRawLocation] = useState("");

	// Memoize the validation schema to prevent its recreation on every render
	const memoizedValidationSchema = useMemo(
		() =>
			Yup.object({
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
					.max(200, "Must not exceed 200 characters"),
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
			}),
		[]
	);

	const initialValues: FormValues = {
		institutionName: "",
		location: "",
		institutionType: "",
		size: "",
		licenseNumber: "",
	};

	const formik = useFormik<FormValues>({
		initialValues,
		validationSchema: memoizedValidationSchema,
		validateOnChange: false,
		validateOnMount: true,
		onSubmit: (values) => {
			const finalLocation = values.location || rawLocation;
			const formThreeData = { ...values, location: finalLocation };
			dispatch(updateFormThree(formThreeData));
			onSuccess?.();
		},
	});

	const debouncedValidate = useMemo(
		() => debounce(() => formik.validateForm(), 300),
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

				<Fieldset.Content>
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
							aria-label="Institution Name"
						/>
						<Field.ErrorText id="institutionName-error">
							{formik.errors.institutionName}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root {...getFieldErrorProps("location")}>
						<Field.Label htmlFor="location">
							Location
							<Field.RequiredIndicator />
						</Field.Label>
						<GeoapifyContext apiKey="4657b6618d154832ae551a32f100795e">
							<GeoapifyGeocoderAutocomplete
								type="amenity"
								lang="en"
								limit={10}
								filterByCountryCode={["auto"]}
								biasByCountryCode={["auto"]}
								addDetails
								allowNonVerifiedHouseNumber
								allowNonVerifiedStreet
								debounceDelay={200}
								placeSelect={(feature) => {
									if (feature.properties) {
										const { formatted, county } = feature.properties;
										const locationValue =
											county && !formatted.includes(county)
												? `${formatted}, ${county}`
												: formatted;
										console.log("Final location value:", locationValue);
										formik.setFieldValue("location", locationValue);
									}
								}}
								aria-label="Institution Location"
								placeholder="Add the location of your institution"
								onUserInput={(input: string) => {
									setRawLocation(input);
									formik.setFieldValue("location", input);
									debouncedValidate();
								}}
							/>
						</GeoapifyContext>
						<Field.ErrorText id="location-error">
							{formik.errors.location}
						</Field.ErrorText>
					</Field.Root>

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
								aria-label="Institution Type"
							/>
						</NativeSelectRoot>
						<Field.ErrorText id="institutionType-error">
							{formik.errors.institutionType}
						</Field.ErrorText>
					</Field.Root>

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
								aria-label="Institution Size"
							/>
						</NativeSelectRoot>
						<Field.ErrorText id="size-error">
							{formik.errors.size}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root {...getFieldErrorProps("licenseNumber")}>
						<Field.Label htmlFor="licenseNumber">
							License Number
							<Field.RequiredIndicator />
						</Field.Label>
						<Group attached width="100%">
							<InputAddon aria-label="Country Code">No.</InputAddon>
							<Input
								id="licenseNumber"
								placeholder="Enter license or reg number"
								name="licenseNumber"
								type="text"
								value={formik.values.licenseNumber}
								onChange={handleChangeDebounced}
								onBlur={formik.handleBlur}
								aria-label="License Number"
							/>
						</Group>
						<Field.HelperText>
							Must be Government-issued license or reg number
						</Field.HelperText>
						<Field.ErrorText id="licenseNumber-error">
							{formik.errors.licenseNumber}
						</Field.ErrorText>
					</Field.Root>
				</Fieldset.Content>

				<Button
					type="submit"
					variant="solid"
					disabled={!formik.isValid || formik.isSubmitting}
					aria-disabled={!formik.isValid || formik.isSubmitting}
				>
					Confirm
				</Button>
			</Fieldset.Root>
		</form>
	);
};

export default React.memo(OnBoardingFormThree);
