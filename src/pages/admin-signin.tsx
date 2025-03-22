import { 
         Button, 
         Field,
         Fieldset,
         Image, 
         Input, 
         Link, 
         Stack, 
         Text 
        } from '@chakra-ui/react';
import React from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import { PasswordInput } from './../components/ui/password-input';


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMINID_REGEX =/^[A-Z0-9]{6,}$/;  //You might need to adjust this

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

interface FormValues{
  emailOrId: string;
  password: string;
}

interface AdminSignInProps{
  legendText: string;
  helperText: string;
  onSuccess?: () => void;
}

//Form Validation
const validationSchema = Yup.object({
  emailOrId: Yup.string()
         .test(
            "email-or-id'",
            "Must be a valid email or administrative ID",
            (value) => {
              EMAIL_REGEX;
              ADMINID_REGEX;
              return EMAIL_REGEX.test(value || "") || ADMINID_REGEX.test(value || "");
            }
         )
         .required("This field is requirred"),

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
		})

const AdminSignIn: React.FC<AdminSignInProps> = ({
  legendText,
  helperText,
  onSuccess,
}) => {

    const initialValues:FormValues = {
      emailOrId:"",
      password:"",
    };

    const formik = useFormik({
      initialValues,
      validationSchema,
      validateOnChange: true,
      validateOnMount: true,
      onSubmit: (values, {resetForm})=>{
        console.log("Form Submitted:", values);
        resetForm();
        onSuccess?.();
      }
    });

    const getFieldErrorProps = (fieldName: keyof FormValues) => ({
      invalid: formik.touched[fieldName] && !!formik.errors[fieldName],
      required: true,
      "aria-invalid": formik.touched[fieldName] && !!formik.errors[fieldName],
      "aria-describedby": `${fieldName}-error`,
    });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Fieldset.Root size="lg" alignItems="center">
        <Stack alignItems="center">
          <Image 
              src="../src/assets/off-jeay.svg"
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
            {legendText}
          </Fieldset.Legend>

          <Fieldset.HelperText>
            {helperText}
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content width="full">
          <Field.Root {...getFieldErrorProps("emailOrId")}>
            <Field.Label htmlFor='emailOrId'>
                Email Address or Administrator ID 
                <Field.RequiredIndicator/>
            </Field.Label>
            <Input
                id="emailOrId"
								name="emailOrId"
								type="email"
								value={formik.values.emailOrId}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								aria-label="Email Address or Administrative ID"
                placeholder='Enter your email or Admin ID'
            />
            <Field.ErrorText id="email-error">
							{formik.errors.emailOrId}
						</Field.ErrorText>
          </Field.Root>

          <Field.Root {...getFieldErrorProps("password")}>
            <Field.Label>
              Password 
              <Field.RequiredIndicator/>
            </Field.Label>
            <Stack width="100%">
              <PasswordInput
                  id="password"
                  type="password"
									placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-label="Password"
              />
            </Stack>
            {formik.values.password && (
								<>
									<Field.ErrorText id="password-error">
										{formik.errors.password}
									</Field.ErrorText>
								</>
							)}
          </Field.Root>
        </Fieldset.Content>

        <Link href="./forgot-password" ml={150}>
         <Text fontSize="2xs">Forgot Password</Text>
        </Link>

        <Button
             type="submit"
             variant="surface"
             width={{ base: "100%", md: "fit-content" }}
             disabled={!formik.isValid || formik.isSubmitting}
             aria-disabled={!formik.isValid || formik.isSubmitting}>Access Workspace</Button>
      </Fieldset.Root>

    </form>
  )
}

export default AdminSignIn;
