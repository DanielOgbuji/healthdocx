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
import { MdOutlineUndo, MdOutlinePersonOutline, MdOutlineAlternateEmail, MdOutlinePassword, MdOutlineArrowForward } from "react-icons/md";
import Flag from "@/assets/images/ng.png";
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { useDispatch, useSelector } from "react-redux";
import { toaster } from "@/components/ui/toaster";
import * as motion from "motion/react-client";
import type { RootState } from "@/store/store";
import { submitForm, setSubmitting, initialState, type FormOneData, ROLE_OPTIONS } from "@/features/forms/FormOneSlice";
import { completeStep } from "@/features/OnboardingSlice";
import { PASSWORD_MIN_LENGTH, calculatePasswordStrength, validatePassword } from "@/utils/password-utils";
//import axios from 'axios';

export default function FormOne() {
    const dispatch = useDispatch();
    const { isSubmitting } = useSelector((state: RootState) => state.formOne);
    const { register, handleSubmit, formState, watch, reset } = useForm<FormOneData>({
        mode: 'onChange',
        defaultValues: initialState
    });
    const { errors } = formState;
    const registerWithMask = useHookFormMask(register);
    const password = watch("password", "");
    // Handle form submission in development
    const onSubmit = handleSubmit((data) => {
        dispatch(setSubmitting(true));
        setTimeout(() => {
            try {
                dispatch(submitForm(data));
                console.log('Form submitted successfully:', data);
                toaster.create({
                    duration: 3000,
                    title: "Success",
                    description: "Account created successfully.",
                    type: "success",
                });
                dispatch(completeStep(0)); // Mark the first step as completed
                reset(initialState);
            } catch (error) {
                dispatch(setSubmitting(false));
                console.error('Form submission failed:', error);
            }
        }, 500);
    });
    /* Handle submission in production
    const onSubmit = handleSubmit(async (data) => {
    dispatch(setSubmitting(true));
    try {
        const response = await axios.post('/api/register', data);

        if (response.status === 201) {
            console.log('Form submitted successfully:', response.data);
            toaster.create({
                duration: 3000,
                title: "Success",
                description: "Account created successfully.",
                type: "success",
            });
            dispatch(completeStep(0)); // Mark the first step as completed
            reset(initialState);
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                console.error('Invalid input');
                toaster.create({
                    duration: 3000,
                    title: "Error",
                    description: "Invalid input.",
                    type: "error",
                });
            } else if (error.response.status === 409) {
                console.error('User already exists');
                toaster.create({
                    duration: 3000,
                    title: "Error",
                    description: "User already exists.",
                    type: "error",
                });
            }
        } else {
            console.error('Form submission failed:', error);
            toaster.create({
                duration: 3000,
                title: "Error",
                description: "Form submission failed.",
                type: "error",
            });
        }
    } finally {
        dispatch(setSubmitting(false));
    }
});
     */

    return (
        <form onSubmit={onSubmit} onReset={() => reset(initialState)} noValidate aria-label="User registration form">
            <Fieldset.Root size="lg" width={{ base: "full", md: "lg", lg: "lg" }}>
                <Fieldset.Content>
                    <Field.Root invalid={!!errors.name} required>
                        <Field.Label>Name<Field.RequiredIndicator /></Field.Label>
                        <InputGroup
                            startElement={<Icon size="md" color="outline"><MdOutlinePersonOutline /></Icon>}>
                            <Input
                                autoFocus
                                autoCorrect="off"
                                aria-describedby={errors.name ? "name-error" : undefined}
                                id="name"
                                type="text"
                                placeholder="Enter as it appears on official documents"
                                {...register("name", {
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
                        <Field.ErrorText id="name-error">{errors.name?.message?.toString()}</Field.ErrorText>
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

                    <Field.Root invalid={!!errors.phone} required>
                        <Field.Label>Phone Number<Field.RequiredIndicator /></Field.Label>
                        <InputGroup
                            startElement={<Image src={Flag} />}>
                            <Input
                                aria-describedby={errors.phone ? "phone-error" : undefined}
                                id="phone"
                                type="tel"
                                placeholder="+234 123 456 7890"
                                {...registerWithMask(
                                    "phone",
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
                        <Field.ErrorText id="phone-error">{errors.phone?.message?.toString()}</Field.ErrorText>
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
                        loadingText="Submitting"
                        disabled={!formState.isValid || isSubmitting}
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
                        borderColor="error" _hover={{ bg: 'errorSubtle' }} title="Reset Form">
                        <MdOutlineUndo />
                    </IconButton>
                </Flex>
            </Fieldset.Root>
        </form>
    );
}