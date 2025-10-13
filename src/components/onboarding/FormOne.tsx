import {
    Field,
    Fieldset,
    Icon,
    Image,
    Input,
    InputGroup,
    IconButton,
    NativeSelect,
    Button,
    For,
    Flex
} from "@chakra-ui/react";
import { MdOutlineUndo, MdOutlinePersonOutline, MdOutlineAlternateEmail, MdOutlinePassword, MdOutlineArrowForward, MdOutlineConfirmationNumber } from "react-icons/md";
import Flag from "@/assets/images/ng.png";
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { toaster } from "@/components/ui/toaster";
import { useDispatch } from "react-redux";
import * as motion from "motion/react-client";
import { completeStep } from "@/features/OnboardingSlice";
import { PASSWORD_MIN_LENGTH, calculatePasswordStrength, validatePassword } from "@/utils/passwordUtils";
import { type ApiError } from '@/types/api.types';
import { ROLE_OPTIONS } from "@/constants/formConstants";
import { register as registerUser } from "@/api/auth";

interface FormOneProps {
    invitationCode?: string | null;
}

export default function FormOne({ invitationCode }: FormOneProps) {
    const { register, handleSubmit, formState, watch, reset } = useForm({
        mode: 'onChange',
        defaultValues: {
            fullName: "",
            email: "",
            role: "",
            phoneNumber: "",
            password: "",
            invitationCode: invitationCode || "",
        }
    });

    const { errors, isSubmitting, isValid } = formState;
    const registerWithMask = useHookFormMask(register);
    const password = watch("password", "");
    const dispatch = useDispatch();

    // Handle form submission
    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await registerUser(data);
            console.log('Form submitted successfully:', response);
            toaster.create({
                duration: 3000,
                title: "Success",
                description: "Account created successfully.",
                type: "success",
            });
            sessionStorage.setItem("onboardingEmail", data.email);
            sessionStorage.setItem("userID", response.userId);
            // Mark the first step as completed
            dispatch(completeStep(0));
            reset();
        } catch (err) {
            console.error('Form submission failed:', err);
            const apiError = err as ApiError;
            toaster.create({
                title: "Registration Failed",
                description: apiError.response?.data?.error ?? "An error occurred during registration. Please try again.",
                type: "error",
                duration: 5000,
            });
            console.error('Error details:', apiError.response?.data);
        }
    });

    return (
        <form onSubmit={onSubmit} onReset={() => reset({})} noValidate aria-label="User registration form">
            <Fieldset.Root size="lg" width={{ base: "full", md: "lg", lg: "lg" }}>
                <Fieldset.Content>
                    <Field.Root invalid={!!errors.fullName} required>
                        <Field.Label>Name<Field.RequiredIndicator /></Field.Label>
                        <InputGroup
                            startElement={<Icon size="md" color="outline"><MdOutlinePersonOutline /></Icon>}>
                            <Input
                                autoFocus
                                autoCorrect="off"
                                aria-describedby={errors.fullName ? "name-error" : undefined}
                                id="name"
                                type="text"
                                placeholder="Enter as it appears on official documents"
                                {...register("fullName", {
                                    required: "Name is required",
                                    maxLength: { value: 100, message: "Maximum length is 100" },
                                    pattern: {
                                        value: /^[\p{L}\p{M}.'\- ]+$/u,
                                        message: "Enter a valid name",
                                    },
                                    validate: (value: string) => {
                                        const names = value.trim().split(/\s+/);
                                        if (names.length < 2) return "Please enter at least two names";
                                        if (names.length > 3) return "Please enter no more than three names";
                                        if (names.some((n) => n.length < 2)) return "Each name must have more than 1 letter";
                                        return true;
                                    }
                                })}
                            />
                        </InputGroup>
                        <Field.ErrorText id="name-error">{errors.fullName?.message?.toString()}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.email} required>
                        <Field.Label>Email Address<Field.RequiredIndicator /></Field.Label>
                        <InputGroup
                            startElement={<Icon size="md" color="outline"><MdOutlineAlternateEmail /></Icon>}>
                            <Input
                                aria-describedby={errors.email ? "email-error" : undefined}
                                id="email"
                                type="email"
                                placeholder="Add your work email"
                                {...register("email", {
                                    required: "Email is required",
                                    maxLength: { value: 75, message: "Maximum length is 75" },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Please enter a valid email address"
                                    }
                                })}
                            />
                        </InputGroup>
                        <Field.ErrorText id="email-error">{errors.email?.message?.toString()}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.role} required>
                        <Field.Label>Role<Field.RequiredIndicator /></Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                aria-describedby={errors.role ? "role-error" : undefined}
                                id="role"
                                placeholder="Select role"
                                {...register("role", { required: "Role is required" })}
                            >
                                <For each={ROLE_OPTIONS}>
                                    {(option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    )}
                                </For>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        <Field.ErrorText id="role-error">{errors.role?.message?.toString()}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.phoneNumber} required>
                        <Field.Label>Phone Number<Field.RequiredIndicator /></Field.Label>
                        <InputGroup
                            startElement={<Image src={Flag} />}>
                            <Input
                                aria-describedby={errors.phoneNumber ? "phone-error" : undefined}
                                id="phone"
                                type="tel"
                                placeholder="+234 123 456 7890"
                                {...registerWithMask(
                                    "phoneNumber",
                                    ["+234 999 999 9999"],
                                    {
                                        required: "Phone is required",
                                        validate: (value: string) => {
                                            // Remove non-digits for length check
                                            const digits = value.replace(/\D/g, "");
                                            if (digits.length === 13) {
                                                return true;
                                            }
                                            return "Enter a valid Nigerian phone number";
                                        }
                                    }
                                )}
                            />
                        </InputGroup>
                        <Field.ErrorText id="phone-error">{errors.phoneNumber?.message?.toString()}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.invitationCode} required>
                        <Field.Label>Invitation Code<Field.RequiredIndicator /></Field.Label>
                        <InputGroup
                            startElement={<Icon size="md" color="outline"><MdOutlineConfirmationNumber /></Icon>}>
                            <Input
                                aria-describedby={errors.invitationCode ? "invitation-code-error" : undefined}
                                id="invitationCode"
                                type="text"
                                placeholder="Enter your invitation code"
                                {...register("invitationCode", {
                                    required: "Invitation code is required",
                                    minLength: {
                                        value: 6,
                                        message: "Invitation code must be at least 6 characters"
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Invitation code must not exceed 50 characters"
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9]+$/i,
                                        message: "Invitation code can only contain letters and numbers"
                                    }
                                })}
                            />
                        </InputGroup>
                        <Field.ErrorText id="invitation-code-error">{errors.invitationCode?.message?.toString()}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root invalid={!!errors.password} required>
                        <Field.Label>Password<Field.RequiredIndicator /></Field.Label>
                        <InputGroup
                            startElement={<Icon size="md" color="outline"><MdOutlinePassword /></Icon>}>
                            <PasswordInput
                                aria-describedby={errors.password ? "password-error" : undefined}
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: PASSWORD_MIN_LENGTH,
                                        message: "Password must be at least 8 characters"
                                    },
                                    validate: validatePassword
                                })}
                            />
                        </InputGroup>
                        <Field.ErrorText id="password-error">
                            {errors.password?.message?.toString() ||
                                (errors.password?.type === "validate" && errors.password?.message)}
                        </Field.ErrorText>
                        {password && <PasswordStrengthMeter value={calculatePasswordStrength(password)} width="full" />}
                    </Field.Root>
                </Fieldset.Content>
                <Flex width="full" gap="2">
                    <Button
                        display="flex"
                        flex="1"
                        type="submit"
                        fontWeight="bold"
                        loading={isSubmitting}
                        loadingText="Creating..."
                        disabled={!isValid || isSubmitting}
                        _disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
                    >
                        Get Started
                        {!isSubmitting && formState.isValid && (
                            <motion.div
                                initial={{ transform: "translateX(0px)" }}
                                animate={{
                                    transform: [
                                        "translateX(10px)",
                                        "translate(0px)",
                                        "translateX(10px)",
                                    ],
                                }}
                                transition={{
                                    ease: "easeInOut",
                                    duration: 1.5,
                                    repeat: Infinity,
                                }}
                            >
                                <Icon size="sm" mt="-2px"><MdOutlineArrowForward /></Icon>
                            </motion.div>
                        )}
                    </Button>
                    <IconButton aria-label="Reset form" type="reset" variant="outline" color="error"
                        borderColor="error" _hover={{ bg: 'errorSubtle' }} title="Reset Form" disabled={isSubmitting}>
                        <MdOutlineUndo />
                    </IconButton>
                </Flex>
            </Fieldset.Root>
        </form>
    );
}
