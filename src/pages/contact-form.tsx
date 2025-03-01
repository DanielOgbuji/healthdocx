import { Box,
         Button, 
         Fieldset, 
         Flex, 
         Group, 
         Heading, 
         HStack, 
         Image, 
         Input, 
         InputAddon, 
         Link, 
         Stack, 
         Status, 
         Text, 
         Textarea, 
         Wrap } 
    from '@chakra-ui/react'
import { Field } from "@chakra-ui/react"
import { useFormik } from 'formik';
import { withMask } from 'use-mask-input';
import  * as Yup  from 'yup';


  
const isOnline = false;

//constants
const PHONE_MASK = "(9) 99-999-99999";
const PHONE_REGEX = /^\(\d\) \d{2}-\d{3}-\d{5}$/;

interface FormValues {
	firstName: string;
    lastName: string;
	email: string;
	phone: string;
	message: string;
}

//form validation
const validationSchema= Yup.object({
    firstName: Yup.string()
                .trim()
                .required("First name is required")
                .min(3, "Must be at least 3 characters")
                .max(50, "Must not exceed 50 characters")
                .matches(/^[A-Za-z]+$/, "First name should only contain letters"),
    lastName: Yup.string()
               .trim()
               .required("Last name is required")
               .min(3, "Must be at least 3 characters")
               .max(50, "Must not exceed 50 characters")
               .matches(/^[A-Za-z]+$/, "last name should only contain letters"),
    email: Yup.string()
            .email("Invalid email format")
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Invalid email format"
            )
            .max(254, "Email must not exceed 254 characters")
            .required("Email is required"),
    phone: Yup.string()
            .matches(PHONE_REGEX, "Phone number must be exactly 11 digits")
            .required("Phone number is required"),
    message: Yup.string()
              .min(10, "Message must be at least 10 characters")
              .max(500, "Message cannot exceed 500 characters")
              .required("Message is required"),
})


const ContactForm = () => {
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
            validateOnChange: true,
            validateOnMount: true,
            onSubmit: (values, { resetForm }) => {
                console.log("Form Submitted:", values);
                resetForm();
            },
        });

    const getFieldErrorProps = (fieldName: keyof FormValues) => ({
            invalid: formik.touched[fieldName] && !!formik.errors[fieldName],
            required: true,
            "aria-invalid": formik.touched[fieldName] && !!formik.errors[fieldName],
            "aria-describedby": `${fieldName}-error`,
        });
  return (
    <Flex ml="950px" >
        {/*side bar*/}
      <Flex
      display={{ base: "none", md: "flex" }}
          direction="column"
          position="fixed"
          justify="flex-start"
          bg="gray.200/10"
          width="450px"
          height="full-screen"
          left="6px"
          gap="32px"
          borderRadius="md"
          >
        <HStack gap="2" py="4" pl="4" mr="8">
            <Status.Root colorPalette="red">
                <Status.Indicator />
           </Status.Root>
           <Status.Root colorPalette="yellow">
              <Status.Indicator />
           </Status.Root>
           <Status.Root colorPalette="green">
              <Status.Indicator />
           </Status.Root>
      </HStack>
            <Wrap gap="1" maxWidth="25" pl="64px" pr="32px">
        <Stack py="2">
              <Heading fontSize="lg">Email support</Heading>
               <Text color="gray.400">Email us and we'll get back to you within 24 hours</Text>
            <Link
              href="#"
              variant="underline"
              fontWeight="bold"
              color="black">support@healthdocx.io
            </Link>
        </Stack>

    <Stack py="2">
          <Heading fontSize="lg">Chat support</Heading>
          <Text color="gray.400">Chat our staff 24/7 for instant access to support</Text>
        <Link
              href="#"
              variant="underline"
              fontWeight="bold"
              color="black">Start Live Chat
            <Box >
              <Status.Root colorPalette={isOnline ? "green" : "red"} ml="6" size="sm">
                                   <Status.Indicator />
                 <Text fontSize="sm" fontWeight="sm" color={isOnline ? "green.500" : "red.500"}>{isOnline ? "Online" : "Offline"}</Text>
              </Status.Root>
            </Box>
        </Link>
    </Stack>

        <Stack py="2">
          <Heading fontSize="lg">Call Us</Heading>
          <Text color="gray.400">Mon-Sat &bull; 9:00AM - 5.00PM (WAT) </Text>
          <Link
              href="#"
              variant="underline"
              fontWeight="bold"
              color="black">+234 800 000 0000 <br />
                            +234 700 000 0001
         </Link>
        </Stack>

        <Stack py="2">
          <Heading fontSize="lg">Lagos</Heading>
          <Text color="gray.400">Visit our office Mon-Sat &bull; 9:00AM - 5.00PM</Text>
          <Link
              href="#"
              variant="underline"
              fontWeight="bold"
              color="black">
                <Image src="src/assets/location.png"
         boxSize={5}/>
                20, Ikeja Street Road, <br />
                Lagos, Nigeria.
          </Link>
        </Stack>
     </Wrap>

        <Stack direction="row" mt="155px" pl="4" gap={4} py="8px">
            <Image src="src/assets/youtube.png" boxSize="20px"/>
            <Image src="src/assets/linkedin.png" boxSize="20px"/>
            <Image src="src/assets/instagram.png" boxSize="20px"/>
            <Image src="src/assets/github.png" boxSize="20px"/>
            <Image src="src/assets/twitter.png" boxSize="20px"/>  
        </Stack>
      </Flex>

       {/*contact form*/}
       <Box p={4} w={{ base: "100%", md: "auto" }}>
        <form onSubmit={formik.handleSubmit} className="onboarding-form">
        <Fieldset.Root>
            <Stack gap={8}>
                <Fieldset.Legend role="heading" aria-level={1} fontWeight="650" fontSize="36px" >
                    Get in touch
                </Fieldset.Legend>
                <Fieldset.HelperText fontWeight="400" fontSize="20px" color="#8B938A" pb="8">Our friendly team would love to hear from you.</Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
                <Flex gap={6}>
                <Field.Root {...getFieldErrorProps("firstName")}>
                    <Field.Label>
                        First name
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                       id="firstName"
                       name="firstName"
                       placeholder="First name"
                       type="text"
                       autoFocus
                       value={formik.values.firstName}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       aria-label="Full Name"
                    />
                    <Field.ErrorText id="firstName-error">
                        {formik.errors.firstName}
                    </Field.ErrorText>
                </Field.Root>
                <Field.Root {...getFieldErrorProps("lastName")}>
                    <Field.Label>
                        Last name
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <Input 
                       id="lastName"
                       name="lastName"
                       type="text"
                       autoFocus
                       placeholder="Last name"
                       value={formik.values.lastName}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       aria-label='Last Name'
                    />
                       <Field.ErrorText id='lastName-error'>
                        {formik.errors.lastName}
                        </Field.ErrorText>
                </Field.Root>
                </Flex>
                <Field.Root {...getFieldErrorProps("email")}>
                    <Field.Label>
                        Email
                        </Field.Label>
                        <Field.RequiredIndicator />
                    <Input 
                       id="email"
                       name="email"
                       type="email"
                       placeholder="you@company.com"
                       autoFocus
                       value={formik.values.email}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       aria-label='Email'
                    />
                       <Field.ErrorText id='email-error'>
                        {formik.errors.email}
                        </Field.ErrorText>
                </Field.Root>
                <Field.Root {...getFieldErrorProps("phone")}>
                    <Field.Label>
                        Phone number
                        </Field.Label>
                        <Field.RequiredIndicator />
                        <Group attached width="full">
                            <InputAddon aria-label='country'>NG</InputAddon>
                    <Input 
                       id="phone"
                       placeholder={PHONE_MASK}
                       ref={withMask(PHONE_MASK)}
                       name="phone"
                       type="tel"
                       autoFocus
                       value={formik.values.phone}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       aria-label='Phone number'
                       />
                       </Group>
                       <Field.ErrorText id='phone-error'>
                        {formik.errors.phone}
                        </Field.ErrorText>
                </Field.Root>
                <Field.Root {...getFieldErrorProps("message")}>
                    <Field.Label>Message</Field.Label>
                    <Field.RequiredIndicator />
                    <Textarea
                        id="message"
                        name="message"
                        autoFocus
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        aria-label='Message'
                        size="lg"
                        height="120px"
                        />
                        <Field.ErrorText id='message-error'>
                            {formik.errors.message} 
                        </Field.ErrorText>
                </Field.Root>
                
                <Flex justify="space-between">
                <Button 
                    variant="solid"
                    rounded="full"
                >
                <span className='material-symbols-outlined'>arrow_circle_left</span>
                    Go back
                </Button>
                <Button
                   type='submit'
                   rounded="full"
                disabled={!formik.isValid || formik.isSubmitting}
                aria-disabled={!formik.isValid || formik.isSubmitting}>Send message</Button>
                </Flex>
            </Fieldset.Content>
        </Fieldset.Root>
      </form>
      </Box>
    </Flex>
  )
}

export default ContactForm
