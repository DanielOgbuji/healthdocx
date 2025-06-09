"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Box,
    Button,
    Field,
    Fieldset,
    Flex,
    Stack,
    Input,
    InputGroup,
    Icon,
    Link,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { MdOutlineArrowCircleRight, MdOutlineAlternateEmail } from "react-icons/md";

interface FormValues {
    email: string;
}

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    // Handle submission for development
    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            console.log("Password reset email submitted:", values);

            // Simulated success for testing
            setIsVisible(false);
            setTimeout(() => {
                navigate("/verify-email");
            }, 500);

            toaster.create({
                duration: 3000,
                title: "Success",
                description: "Password reset email sent successfully",
                type: "success",
            });
        } catch (error) {
            console.error('An error occurred:', error);
            toaster.create({
                duration: 3000,
                title: "Error",
                description: "An error occurred while submitting the form. Please try again later.",
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    /* Handle submission for production
    const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
        const response = await axios.post('/api/password-reset', { email: values.email });

        if (response.status === 200) {
            console.log('Password reset email submitted:', values);
            setIsVisible(false);
            setTimeout(() => {
                navigate("/verify-email");
            }, 500);

            toaster.create({
                duration: 3000,
                title: "Success",
                description: "Password reset email sent successfully",
                type: "success",
            });
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('User not found');
            toaster.create({
                duration: 3000,
                title: "Error",
                description: "User not found.",
                type: "error",
            });
        } else {
            console.error('An error occurred:', error);
            toaster.create({
                duration: 3000,
                title: "Error",
                description: "An error occurred while submitting the form. Please try again later.",
                type: "error",
            });
        }
    } finally {
        setIsSubmitting(false);
    }
};
     */

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
            className="auth-layout"
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
                                colorPalette="brand"
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
                                    <Field.Root invalid={!!errors.email} required>
                                        <Field.Label htmlFor="email">
                                            Email Address
                                            <Field.RequiredIndicator />
                                        </Field.Label>
                                        <InputGroup
                                            startElement={<Icon size="md" color="outline"><MdOutlineAlternateEmail /></Icon>}>
                                            <Input
                                                id="email"
                                                autoFocus
                                                placeholder="Enter your email"
                                                ps="42px"
                                                aria-label="Email Address"
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email format",
                                                    },
                                                    maxLength: {
                                                        value: 254,
                                                        message: "Email must not exceed 254 characters",
                                                    },
                                                })}
                                            />
                                        </InputGroup>
                                        <Field.ErrorText id="email-error">
                                            {errors.email?.message}
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
                                    disabled={!isValid || isSubmitting}
                                    aria-disabled={!isValid || isSubmitting}
                                    loading={isSubmitting}
                                    loadingText="Submitting..."
                                >
                                    Submit
                                </Button>
                                <Flex w="full" fontSize="sm" gap="1" alignItems="center" mt="6">
                                    <Box className="material-symbols-outlined">
                                        <Icon size="lg" color="primary"><MdOutlineArrowCircleRight /></Icon>
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