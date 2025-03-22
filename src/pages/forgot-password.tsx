import { 
        Button, 
        Field, 
        Fieldset, 
        Flex, 
        Input, 
        Link, 
        Stack, 
        Text 
      } from '@chakra-ui/react';
import { useFormik } from 'formik';
import React from 'react'
import * as Yup  from 'yup';

interface ForgotPasswordProps{
  legendText: string;
  helperText: string;
  onSuccess?:() => void;
}
 
  const validationSchema = Yup.object({
    email: Yup.string()
		.email("Invalid email format")
		.max(254, "Email must not exceed 254 characters")
		.required("Email is required"),
  })

  interface FormValues{
    email: string;
   }

  
const ForgotPassword: React.FC<ForgotPasswordProps> = ({
    legendText,
    helperText,
    onSuccess,
}) => {

  const initialValues: FormValues = {
    email: "",
  }


  const formik = useFormik({
    initialValues,
      validationSchema,
      validateOnChange: true,
      validateOnMount: true,
      onSubmit: (values, {resetForm})=>{
        console.log("Form Submitted:", values)
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
      <Fieldset.Root>
      <Stack textAlign="left" width="360px">
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

      <Fieldset.Content>
        <Field.Root {...getFieldErrorProps("email")}>
          <Field.Label htmlFor='email'>Email Address</Field.Label>
          <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-label="Email Address or Administrative ID"
              placeholder='Enter your Email '
          />
          <Field.ErrorText id="email-error">
                        {formik.errors.email}
                      </Field.ErrorText>
        </Field.Root>
      </Fieldset.Content>

      <Button
            type="submit"
            variant="surface"
            disabled={!formik.isValid || formik.isSubmitting}
            aria-disabled={!formik.isValid || formik.isSubmitting} 
      >
        Submit
      </Button>

      <Flex justify="space-between" fontSize="xs">
        <Link href="#"> <Text>Just remembered password?</Text> </Link>
         <Button variant="ghost">Go back to login</Button>
      </Flex>
      </Fieldset.Root>
    </form>
  )
}

export default ForgotPassword;
