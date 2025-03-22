import { 
       Button, 
       Checkbox, 
       Field, 
       Fieldset,  
       Stack, 
      } from '@chakra-ui/react';
import React from 'react'
import { PasswordInput } from '../components/ui/password-input';
import * as Yup  from 'yup';
import { useFormik } from 'formik';

interface ResetPasswordProps{
    legendText: string;
    onSuccess: () => void;
}

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


const validationSchema = Yup.object({
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

interface FormValues{
  password: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
    legendText,
    onSuccess
}) => {

  const initialValues: FormValues ={
    password: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: (values, {resetForm}) =>{
      console.log("Form submitted:", values);
      resetForm();
      onSuccess?.();
    }
  })
  const criteria = [
    { id: 'length', label: 'Minimum of 8 characters', check: formik.values.password.length >= PASSWORD_MIN_LENGTH },
    { id: 'uppercase', label: 'At least one uppercase letter', check: PASSWORD_REGEX.UPPERCASE.test(formik.values.password) },
    { id: 'lowercase', label: 'At least one lowercase letter', check: PASSWORD_REGEX.LOWERCASE.test(formik.values.password)},
    { id: 'number', label: 'At least one number', check: PASSWORD_REGEX.NUMBER.test(formik.values.password) },
    { id: 'specialCharacter', label: 'At least one special character', check: PASSWORD_REGEX.SPECIAL.test(formik.values.password) },
  ];


  

  const getFieldErrorProps = (fieldName: keyof FormValues) => ({
    invalid: formik.touched[fieldName] && !!formik.errors[fieldName],
    required: true,
    "aria-invalid": formik.touched[fieldName] && !!formik.errors[fieldName],
    "aria-describedby": `${fieldName}-error`,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Fieldset.Root>
        <Stack alignItems="flex-start">
            <Fieldset.Legend
                      role="heading"
                      fontWeight="bold"
                      fontSize="2xl"
                      display="flex"
                      gap="2"
                      aria-level={1}
                      mb="4px"
            >
                {legendText}
            </Fieldset.Legend>
            </Stack>

            <Fieldset.Content width={360}>
                <Field.Root {...getFieldErrorProps("password")}>
                <Field.Label>
                       Password 
                    <Field.RequiredIndicator/>
                </Field.Label>
            <Stack width="100%">
                <PasswordInput
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                        colorPalette="gray"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        aria-label="Password"

                />
            </Stack>
            <Field.ErrorText>
              {formik.errors.password}
            </Field.ErrorText>
       </Field.Root>
            </Fieldset.Content>

            <Stack alignItems="flex-start">
              {criteria.map((criterion) => (
                <Checkbox.Root 
                           key={criterion.id} 
                           size="sm"
                           checked={criterion.check} 
                           disabled={!criterion.check}
                           variant="outline"
                >
                  <Checkbox.HiddenInput/>
                  <Checkbox.Control/>
                  <Checkbox.Label fontSize="xs">{criterion.label}</Checkbox.Label>
                </Checkbox.Root>
              ))}
            
            </Stack>

            <Button
                 type="submit"
                 variant="surface"
                 disabled={!formik.isValid || formik.isSubmitting}
                 aria-disabled={!formik.isValid || formik.isSubmitting}
            >
                Reset
            </Button>
        
      </Fieldset.Root>
    </form>
  )
}

export default ResetPassword;
