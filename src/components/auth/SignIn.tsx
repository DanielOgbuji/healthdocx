import {
    Box,
    Button,
    Field,
    Fieldset,
    Flex,
    Image,
    Input,
    InputGroup,
    Link,
    Stack,
    Text,
    Icon
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Logo from "@/assets/images/Off-Jeay.svg";
import LogoDark from "@/assets/images/Off-Jeay-Dark.svg";
import { useColorMode } from "@/components/ui/color-mode";
import * as motion from "motion/react-client";
import { MdOutlineArrowForward, MdOutlinePersonOutline, MdOutlinePassword } from "react-icons/md";
import { toaster } from "@/components/ui/toaster";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/store/store";
import { type ApiError } from '@/types/api.types';
import { login as login } from "@/api/auth";
import { loginSuccess } from "@/features/authSlice";

interface SignInValues {
    email: string;
    password: string;
}

export default function SignIn() {
    const dispatch = useDispatch<AppDispatch>();
    const { colorMode } = useColorMode();
    const navigate = useNavigate();

    const { register, handleSubmit, formState, reset } = useForm<SignInValues>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const { errors, isValid, isSubmitting } = formState;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const email = data.email;
            const password = data.password;
            const response = await login(email, password);
            console.log("Form submitted successfully:", response);
            dispatch(loginSuccess(response));
            toaster.create({
                title: "Login successful",
                type: "success",
                duration: 3000,
            });
            navigate("/home");
        } catch (err) {
            console.error('Form submission failed:', err);
            const apiError = err as ApiError;
            toaster.create({
                title: "Sign In Failed",
                description: apiError.response?.data?.error ?? "An error occurred while signing you in. Please try again.",
                type: "error",
                duration: 5000,
            })
        } finally {
            reset()
        }
    });

    return (
        <Flex width="full" height="full" justifyContent="center" alignItems="center" className="auth-layout">
            <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <Image
                    src={colorMode === "dark" ? LogoDark : Logo}
                    mb="8"
                    mx="auto"
                    width="48px"
                    height="48px"
                    alt="Company Logo"
                    loading="lazy"
                />
                <Fieldset.Root
                    size="lg"
                    w={{ base: "90%", md: "md", lg: "lg" }}
                    px={{ base: "4", lg: "8" }}
                    pt={{ base: "6", lg: "8" }}
                    pb={{ base: "4", lg: "8" }}
                    borderStyle="solid"
                    borderWidth="thin"
                    borderColor="outline/40"
                    borderRadius="md"
                    bgGradient="to-t"
                    gradientFrom="transparent"
                    gradientTo="primary/15"
                    overflow="hidden"
                    backdropFilter={"blur(1.25px)"}
                    shadow="0px -42px 200px 0px var(--shadow-color)"
                    shadowColor="primary/20"
                    colorPalette="brand">
                    <Stack alignItems="center">
                        <Fieldset.Legend
                            fontWeight="bold"
                            fontSize="3xl"
                            display="flex"
                            alignItems="center"
                            gap="2"
                            aria-level={1}
                            mb="2"
                        >
                            Welcome back
                        </Fieldset.Legend>
                        <Fieldset.HelperText color="outline" fontSize="md" textAlign="center">Enter your details to access your workspace.</Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                        <Field.Root invalid={!!errors.email} required>
                            <Field.Label>Email Address or Administrator ID</Field.Label>
                            <InputGroup
                                startElement={<Icon size="md" color="outline"><MdOutlinePersonOutline /></Icon>}>
                                <Input
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                    autoFocus
                                    placeholder="Enter your email or Admin ID"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                            </InputGroup>
                            <Field.ErrorText id="email-error">
                                {errors.email?.message}
                            </Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.password} required>
                            <Field.Label>Password</Field.Label>
                            <InputGroup
                                startElement={<Icon size="md" color="outline"><MdOutlinePassword /></Icon>}>
                                <Input
                                    type="password"
                                    aria-describedby={errors.password ? "password-error" : undefined}
                                    placeholder="Enter password"
                                    {...register("password", {
                                        required: "Password is required"
                                    })}
                                />
                            </InputGroup>
                            <Field.ErrorText id="password-error">
                                {errors.password?.message}
                            </Field.ErrorText>
                        </Field.Root>
                    </Fieldset.Content>

                    <Box textAlign="right">
                        <Link href="/forgot-password" variant="underline">
                            <Text fontSize="14px" cursor="pointer">
                                Forgot password
                            </Text>
                        </Link>
                    </Box>

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
                        loading={isSubmitting}
                        loadingText="Signing in"
                    >
                        Access Workspace
                        {!isSubmitting && isValid && (
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
                                    duration: 1,
                                    repeat: Infinity,
                                }}
                            >
                                <Icon size="sm" mt="-2px"><MdOutlineArrowForward /></Icon>
                            </motion.div>
                        )}
                    </Button>
                </Fieldset.Root>
            </form>
        </Flex>
    );
}
