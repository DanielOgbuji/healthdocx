import React from "react";
import {
    Button,
    Field,
    Fieldset,
    Flex,
    Input,
    InputAddon,
    Link,
    Stack,
    Textarea,
    Icon,
    Group,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { MdArrowBack } from "react-icons/md";
import { toaster } from "@/components/ui/toaster";
import flagNg from "@/assets/images/ng.png";

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

const ContactForm: React.FC<ContactFormProps> = ({
    legendText,
    helperText,
    onSuccess,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset
    } = useForm<FormValues>({
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Form Submitted:", values);

        toaster.create({
            title: "Message Sent",
            description: "We've received your message and will get back to you shortly.",
            type: "success",
            duration: 5000,
        });

        reset();
        onSuccess?.();
    });

    return (
        <form onSubmit={onSubmit} className="onboarding-form" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Fieldset.Root size="lg" maxW="lg" width={{ base: "100%", lg: "lg" }}>
                <Link
                    href="/"
                    color="bg.emphasized"
                    textDecoration="none"
                    display={{ base: "flex", md: "none" }}
                    mb="4"
                >
                    <Button variant="ghost" padding="0">
                        <Icon fontSize="48px" color="primary">
                            <MdArrowBack />
                        </Icon>
                    </Button>
                </Link>
                <Stack role="banner">
                    <Fieldset.Legend
                        role="heading"
                        fontWeight="bold"
                        fontSize="3xl"
                        aria-level={1}
                        mb="12px"
                        color="onBackground"
                    >
                        {legendText}
                    </Fieldset.Legend>
                    <Fieldset.HelperText fontSize="lg">{helperText}</Fieldset.HelperText>
                </Stack>

                <Fieldset.Content colorPalette="green">
                    {/* First Name & Last Name */}
                    <Flex gap="3" direction={{ base: "column", lg: "row" }}>
                        <Field.Root invalid={!!errors.firstName} required flex="1">
                            <Field.Label htmlFor="firstName">
                                First Name
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                                id="firstName"
                                autoFocus
                                placeholder="Enter your first name"
                                title="Enter your first name"
                                type="text"
                                {...register("firstName", {
                                    required: "First name is required",
                                    minLength: { value: 2, message: "Must be at least 2 characters" },
                                    maxLength: { value: 50, message: "Must not exceed 50 characters" },
                                    pattern: {
                                        value: /^[a-zA-Z-]+$/,
                                        message: "Letters and hyphens only"
                                    }
                                })}
                            />
                            <Field.ErrorText id="firstName-error">
                                {errors.firstName?.message}
                            </Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.lastName} required flex="1">
                            <Field.Label htmlFor="lastName">
                                Last Name
                                <Field.RequiredIndicator />
                            </Field.Label>
                            <Input
                                id="lastName"
                                placeholder="Enter your last name"
                                title="Enter your last name"
                                type="text"
                                {...register("lastName", {
                                    required: "Last name is required",
                                    minLength: { value: 2, message: "Must be at least 2 characters" },
                                    maxLength: { value: 50, message: "Must not exceed 50 characters" },
                                    pattern: {
                                        value: /^[a-zA-Z-]+$/,
                                        message: "Letters and hyphens only"
                                    }
                                })}
                            />
                            <Field.ErrorText id="lastName-error">
                                {errors.lastName?.message}
                            </Field.ErrorText>
                        </Field.Root>
                    </Flex>

                    {/* Email */}
                    <Field.Root invalid={!!errors.email} required>
                        <Field.Label htmlFor="email">
                            Email Address
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input
                            id="email"
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email format"
                                },
                                maxLength: { value: 254, message: "Email too long" }
                            })}
                        />
                        <Field.ErrorText id="email-error">
                            {errors.email?.message}
                        </Field.ErrorText>
                    </Field.Root>

                    {/* Phone Number */}
                    <Field.Root invalid={!!errors.phone} required>
                        <Field.Label htmlFor="phone">
                            Phone Number
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Group attached width="100%">
                            <InputAddon aria-label="Country Code" paddingInline="2">
                                <img src={flagNg} alt="Nigerian Flag" style={{ width: "20px" }} />
                                &nbsp;+234
                            </InputAddon>
                            <Input
                                id="phone"
                                placeholder="Enter your phone number"
                                type="tel"
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "Must be exactly 10 digits"
                                    }
                                })}
                            />
                        </Group>
                        <Field.ErrorText id="phone-error">
                            {errors.phone?.message}
                        </Field.ErrorText>
                    </Field.Root>

                    {/* Message */}
                    <Field.Root invalid={!!errors.message} required>
                        <Field.Label htmlFor="message">
                            Message
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Textarea
                            id="message"
                            placeholder="Enter your message"
                            title="Enter your message"
                            minH="150px"
                            {...register("message", {
                                required: "Message is required",
                                minLength: { value: 10, message: "Must be at least 10 characters" }
                            })}
                        />
                        <Field.ErrorText id="message-error">
                            {errors.message?.message}
                        </Field.ErrorText>
                    </Field.Root>
                </Fieldset.Content>

                <Flex justify="space-between" mt="4">
                    <Link
                        href="/"
                        color="bg.emphasized"
                        textDecoration="none"
                        display={{ base: "none", md: "flex" }}
                    >
                        <Button
                            variant="outline"
                            color="onBackground"
                            bgColor="background/10"
                            _hover={{ bgColor: "background/50" }}
                            focusRingColor="surfaceVariant"
                        >
                            <Icon color="primary">
                                <MdArrowBack />
                            </Icon>
                            Go back
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        variant="solid"
                        width={{ base: "100%", md: "fit-content" }}
                        disabled={!isValid || isSubmitting}
                        loading={isSubmitting}
                        loadingText="Sending..."
                        color="onPrimary"
                        bgColor="primary"
                        _hover={{ bgColor: "primary/85" }}
                        _disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
                        focusRingColor="secondary"
                    >
                        Send message
                    </Button>
                </Flex>
            </Fieldset.Root>
        </form>
    );
};

export default ContactForm;
