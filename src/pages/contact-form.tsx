import React from "react";
import {
	Button,
	Group,
	Field,
	Fieldset,
	Flex,
	Input,
	InputAddon,
	Link,
	Stack,
	Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputGroup } from "@/components/ui/input-group";

// Updated interface for form values
interface FormValues {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;
}

interface ContactFormProps {
	legendText: string;
	helperText: string;
	onSuccess?: () => void;
}

// Updated validation schema for new fields
const validationSchema = Yup.object({
	firstName: Yup.string()
		.required("First name is required")
		.min(2, "Must be at least 2 characters")
		.max(50, "Must not exceed 50 characters")
		.matches(/^[a-zA-Z-]+$/, "First name can only contain letters and hyphens"),
	lastName: Yup.string()
		.required("Last name is required")
		.min(2, "Must be at least 2 characters")
		.max(50, "Must not exceed 50 characters")
		.matches(/^[a-zA-Z-]+$/, "Last name can only contain letters and hyphens"),
	email: Yup.string()
		.email("Invalid email format")
		.max(254, "Email must not exceed 254 characters")
		.required("Email is required"),
	phone: Yup.string()
		.matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
		.required("Phone number is required"),
	message: Yup.string()
		.required("Message is required")
		.min(10, "Message must be at least 10 characters"),
});

const ContactForm: React.FC<ContactFormProps> = ({
	legendText,
	helperText,
	onSuccess,
}) => {
	const initialValues: FormValues = {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		message: "",
	};

	const formik = useFormik({
		initialValues,
		validationSchema,
		validateOnChange: false,
		validateOnMount: true,
		onSubmit: (values, { resetForm }) => {
			console.log("Form Submitted:", values);
			resetForm();
			onSuccess?.();
		},
	});

	const getFieldErrorProps = (fieldName: keyof FormValues) => ({
		invalid: formik.touched[fieldName] && !!formik.errors[fieldName],
		required: true,
		"aria-invalid": formik.touched[fieldName] && !!formik.errors[fieldName],
		"aria-describedby": `${fieldName}-error`,
	});

	return (
		<form onSubmit={formik.handleSubmit} className="onboarding-form">
			<Fieldset.Root size="lg" maxW="lg" width={{ base: "75%", lg: "50%" }}>
				<Link
					href="/"
					color="bg.emphasized"
					textDecoration="none"
					display={{ base: "flex", md: "none" }}
				>
					<Button variant="ghost" padding="0">
						<span className="material-symbols-outlined" style={{ fontSize: '48px' }}>arrow_circle_left</span>
					</Button>
				</Link>
				<Stack role="banner">
					<Fieldset.Legend
						role="heading"
						fontWeight="bold"
						fontSize="3xl"
						aria-level={1}
						mb="12px"
					>
						{legendText}
					</Fieldset.Legend>
					<Fieldset.HelperText fontSize="lg">{helperText}</Fieldset.HelperText>
				</Stack>

				<Fieldset.Content>
					{/* First Name */}
					<Flex gap="3" direction={{ base: "column", lg: "row" }}>
						<Field.Root {...getFieldErrorProps("firstName")}>
							<Field.Label htmlFor="firstName">
								First Name
								<Field.RequiredIndicator />
							</Field.Label>
							<InputGroup flex="1" width="100%">
								<Input
									id="firstName"
									autoFocus
									placeholder="Enter your first name"
									title="Enter your first name"
									name="firstName"
									type="text"
									value={formik.values.firstName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									aria-label="First Name"
								/>
							</InputGroup>
							<Field.ErrorText id="firstName-error">
								{formik.errors.firstName}
							</Field.ErrorText>
						</Field.Root>

						{/* Last Name */}
						<Field.Root {...getFieldErrorProps("lastName")}>
							<Field.Label htmlFor="lastName">
								Last Name
								<Field.RequiredIndicator />
							</Field.Label>
							<InputGroup flex="1" width="100%">
								<Input
									id="lastName"
									placeholder="Enter your last name"
									title="Enter your last name"
									name="lastName"
									type="text"
									value={formik.values.lastName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									aria-label="Last Name"
								/>
							</InputGroup>
							<Field.ErrorText id="lastName-error">
								{formik.errors.lastName}
							</Field.ErrorText>
						</Field.Root>
					</Flex>

					{/* Email */}
					<Field.Root {...getFieldErrorProps("email")}>
						<Field.Label htmlFor="email">
							Email Address
							<Field.RequiredIndicator />
						</Field.Label>
						<InputGroup flex="1" width="100%">
							<Input
								id="email"
								placeholder="Enter your email"
								name="email"
								type="email"
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								aria-label="Email Address"
							/>
						</InputGroup>
						<Field.ErrorText id="email-error">
							{formik.errors.email}
						</Field.ErrorText>
					</Field.Root>

					{/* Phone Number */}
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

					{/* Message */}
					<Field.Root {...getFieldErrorProps("message")}>
						<Field.Label htmlFor="message">
							Message
							<Field.RequiredIndicator />
						</Field.Label>
						<InputGroup flex="1" width="100%">
							<Textarea
								id="message"
								placeholder="Enter your message"
								title="Enter your message"
								name="message"
								value={formik.values.message}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								aria-label="Message"
							/>
						</InputGroup>
						<Field.ErrorText id="message-error">
							{formik.errors.message}
						</Field.ErrorText>
					</Field.Root>
				</Fieldset.Content>

				<Flex justify="space-between">
					<Link
						href="/"
						color="bg.emphasized"
						textDecoration="none"
						display={{ base: "none", md: "flex" }}
					>
						<Button variant="outline">
							<span className="material-symbols-outlined">
								arrow_circle_left
							</span>
							Go back
						</Button>
					</Link>
					<Button
						type="submit"
						variant="solid"
						width={{ base: "100%", md: "fit-content" }}
						disabled={!formik.isValid || formik.isSubmitting}
						aria-disabled={!formik.isValid || formik.isSubmitting}
					>
						Send message
					</Button>
				</Flex>
			</Fieldset.Root>
		</form>
	);
};

export default ContactForm;
