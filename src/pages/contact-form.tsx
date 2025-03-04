import { Box,
         Button, 
         Circle, 
         Fieldset, 
         Flex, 
         Group, 
         HStack, 
         Image, 
         Input, 
         InputAddon, 
         Link, 
         Stack, 
         Status, 
         StatusIndicator, 
         Text, 
         Textarea, 
         } 
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
    <Flex minH="100vh" justifyContent="center">
      {/*side panel*/}
      <Box bg="bg.muted" w= "445px" m="2" borderRadius="25px" display={{base: "none", md: "block"}} >
        <Stack py="4" px="4">
          <HStack>
            <Status.Root>
              <StatusIndicator colorPalette="red"/>
              <StatusIndicator colorPalette="yellow"/>
              <StatusIndicator colorPalette="green"/>
            </Status.Root>
          </HStack>
        </Stack>

         <Stack pl="16" width="318px" gap="30px" py="2">
              <Stack>
                <Text fontWeight="700" fontSize="18px">Email support</Text>
                <Text fontSize="12px" color="#8B938A" width="285px">Email us and we&apos;ll get back to you within 24 hours.</Text>
                <Link href="#" fontSize="12px" fontWeight="700" textDecor="underline" _hover={{textDecor: "none", color: "black"}} color="black">support@healthdocx.io</Link>
              </Stack>

              <Stack>
                <Text fontWeight="700" fontSize="18px">Chat support</Text>
                <Text fontSize="12px" color="#8B938A" width="278px">
                    Chat our staff 24/7 for instant access to support.
                </Text>
                <Flex>
                <Link 
                   href="#" 
                   fontSize="12px"
                   color="black" 
                   fontWeight="700" 
                   textDecor="underline"
                   _hover={{textDecor: "none", color: "black"}} >
                Start Live Chat
                </Link>
              <Status.Root colorPalette={isOnline ? "green" : "red"} ml="6" size="sm">
                <Circle size="fit-content" background="white" width="43px" padding="4px">
                                   <Status.Indicator />
                 <Text 
                    ml="2"
                    fontSize="10px" 
                    fontWeight="500" 
                    color={isOnline ? "green.500" : "red.500"}> {isOnline ? "Online" : "Offline"}
                 </Text>
                </Circle>
              </Status.Root>
              </Flex>
            </Stack>

            <Stack>
              <Text fontWeight="700" fontSize="18px">Call Us</Text>
              <Text fontSize="12px" color="#8B938A" width="208px">
                Mon - Sat &bull; 9:00AM - 5:00PM (WAT)
              </Text>
              <Link 
                 href="#" 
                 color="black"
                 fontSize="12px" 
                 fontWeight="700" 
                 textDecor="underline" 
                 _hover={{textDecor: "none", color: "black"}} >
                           +234 800 000 0000
                     <br/> +234 700 000 0001
              </Link>
              </Stack>
              
              <Stack>
              <Text fontWeight="700" fontSize="18px">Lagos</Text>
              <Text fontSize="12px" color="#8B938A" width="259px">
                 Visit our office Mon - Sat &bull; 9:00AM - 5:00PM.
              </Text>
              <Link
                  href="#" 
                  color="black"
                  fontSize="12px" 
                  fontWeight="700" 
                  textDecor="underline" 
                  _hover={{textDecor: "none", color: "black"}} >
                     <Image src="src/assets/location.png" boxSize={4}/>
                          20, Ikeja Street Road, <br/>
                          Lagos, Nigeria.
              </Link>
              </Stack>
            </Stack>

            <Stack mt={230} px="4" gap={3} direction="row">
            <Image src="src/assets/youtube.png" boxSize="20px"/>
            <Image src="src/assets/linkedin.png" boxSize="20px"/>
            <Image src="src/assets/instagram.png" boxSize="20px"/>
            <Image src="src/assets/github.png" boxSize="20px"/>
            <Image src="src/assets/twitter.png" boxSize="20px"/>
            </Stack>
      </Box>

    
       {/*contact form*/}
       <Box 
          p="2px" 
          mx="auto" 
          ml={{base: "200px", md: "500px"}} 
          alignItems="center" 
          maxWidth={{ base: "100%", md: "40%" }} 
          width={{base: "100%", md: "40%"}} >
        <form onSubmit={formik.handleSubmit} className="onboarding-form">
        <Fieldset.Root>
            <Flex direction="start">
                 <Button  
                     display={{base: "column", md: "none"}}
                     variant="ghost">
                     <span className='material-symbols-outlined'>arrow_circle_left</span>
                 </Button>
            </Flex>

						<Stack gap={4}>
							<Fieldset.Legend
								role="heading"
								aria-level={1}
								fontWeight="650"
								fontSize={{ base: "26px", md: "36px" }}
							>
								Get in touch
							</Fieldset.Legend>
							<Fieldset.HelperText
								fontWeight="400"
								fontSize={{ base: "10px", md: "20px" }}
								color="#8B938A"
								pb="2"
							>
								Our friendly team would love to hear from you.
							</Fieldset.HelperText>
						</Stack>

						<Fieldset.Content width={{ base: "60%", md: "full" }}>
							<Flex direction={{ base: "column", md: "row" }} gap={6}>
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
										aria-label="Last Name"
									/>
									<Field.ErrorText id="lastName-error">
										{formik.errors.lastName}
									</Field.ErrorText>
								</Field.Root>
							</Flex>
							<Field.Root {...getFieldErrorProps("email")}>
								<Field.Label>
									Email
									<Field.RequiredIndicator />
								</Field.Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="you@company.com"
									autoFocus
									value={formik.values.email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									aria-label="Email"
								/>
								<Field.ErrorText id="email-error">
									{formik.errors.email}
								</Field.ErrorText>
							</Field.Root>
							<Field.Root {...getFieldErrorProps("phone")}>
								<Field.Label>
									Phone number
									<Field.RequiredIndicator />
								</Field.Label>
								<Group attached width="full">
									<InputAddon aria-label="country">NG</InputAddon>
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
										aria-label="Phone number"
									/>
								</Group>
								<Field.ErrorText id="phone-error">
									{formik.errors.phone}
								</Field.ErrorText>
							</Field.Root>
							<Field.Root {...getFieldErrorProps("message")}>
								<Field.Label>
									Message
									<Field.RequiredIndicator />
								</Field.Label>
								<Textarea
									id="message"
									name="message"
									autoFocus
									value={formik.values.message}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									aria-label="Message"
									size="lg"
									height="120px"
								/>
								<Field.ErrorText id="message-error">
									{formik.errors.message}
								</Field.ErrorText>
							</Field.Root>

							<Flex justify="space-between">
								<Link href="/" color="bg.emphasized" textDecoration="none">
									<Button
										variant="solid"
										rounded="full"
										display={{ base: "none", md: "flex" }}
									>
										<Box className="material-symbols-outlined">
											arrow_circle_left
										</Box>
										Go back
									</Button>
								</Link>
								<Button
									type="submit"
									rounded={{ base: "md", md: "full" }}
									width={{ base: "100%", md: "auto" }}
									disabled={!formik.isValid || formik.isSubmitting}
									aria-disabled={!formik.isValid || formik.isSubmitting}
								>
									Send message
								</Button>
							</Flex>
						</Fieldset.Content>
					</Fieldset.Root>
				</form>
			</Box>
		</Flex>
	);
};

export default ContactForm;
