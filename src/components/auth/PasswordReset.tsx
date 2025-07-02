import React from "react";
import { useNavigate } from "react-router";
import { Button, Box, Field, Fieldset, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
    PasswordInput,
    PasswordStrengthMeter,
} from "@/components/ui/password-input";
import * as motion from "motion/react-client";
import { toaster } from "@/components/ui/toaster";
import { PASSWORD_MIN_LENGTH, calculatePasswordStrength, validatePassword } from "@/utils/passwordUtils";

interface FormValues {
    password: string;
    confirmPassword: string;
}

const PasswordResetForm = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, isSubmitting }
    } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    });

    const password = watch("password", "");

    const onSubmit = async (data: FormValues) => {
        try {
            // API call would go here
            console.log("Password reset successfully:", data);

            setTimeout(() => {
                navigate("/reset-successful");
                toaster.create({
                    duration: 3000,
                    title: "Success",
                    description: "Your password has been successfully reset",
                    type: "success",
                });
            }, 500);
        } catch (error) {
            console.error("Error during password reset:", error);
            toaster.create({
                duration: 3000,
                title: "Error",
                description: "An error occurred while resetting your password",
                type: "error",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", height: "100%", overflow: "hidden" }} className="auth-layout">
            <Box
                w="100%"
                h="100%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
            >
                <motion.div
                    initial={{ y: "50%", opacity: 0 }}
                    animate={{ y: "0", opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                        overflow: "hidden",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Fieldset.Root
                        size="lg"
                        w={{ base: "100%", lg: "lg" }}
                        px={{ base: "4", lg: "8" }}
                        pb={{ base: "4", lg: "8" }}
                        pt={{ base: "4", lg: "8" }}
                        borderStyle="solid"
                        borderWidth="thin"
                        borderColor="outline/40"
                        borderRadius="md"
                        bgGradient="to-t"
                        gradientFrom="transparent"
                        gradientTo="primary/15"
                        overflow="hidden"
                        backdropFilter="blur(1.25px)"
                        shadow="0px -42px 200px 0px var(--shadow-color)"
                        shadowColor="primary/20"
                        mx="4"
                        colorPalette="brand"
                    >
                        <Stack alignItems="flex-start" role="banner" w="100%">
                            <Fieldset.Legend
                                role="heading"
                                fontWeight="bold"
                                fontSize="2xl"
                                display="flex"
                                alignItems="center"
                                gap="2"
                                aria-level={1}
                                mb="4px"
                                color="onSurface"
                            >
                                Reset Password
                            </Fieldset.Legend>
                            <Fieldset.HelperText lineHeight="tall">
                                Enter your new password
                            </Fieldset.HelperText>
                        </Stack>

                        <Fieldset.Content>
                            <Field.Root invalid={!!errors.password} required>
                                <Field.Label htmlFor="password">
                                    Password<Field.RequiredIndicator />
                                </Field.Label>
                                <Stack width="100%">
                                    <PasswordInput
                                        id="password"
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="Create a password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: PASSWORD_MIN_LENGTH,
                                                message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
                                            },
                                            validate: validatePassword
                                        })}
                                    />
                                    <Field.ErrorText id="password-error">
                                        {errors.password?.message}
                                    </Field.ErrorText>
                                    {password && (
                                        <PasswordStrengthMeter
                                            value={calculatePasswordStrength(password)}
                                            aria-label="Password Strength"
                                        />
                                    )}
                                </Stack>
                            </Field.Root>

                            <Field.Root invalid={!!errors.confirmPassword} required>
                                <Field.Label htmlFor="confirmPassword">
                                    Confirm Password<Field.RequiredIndicator />
                                </Field.Label>
                                <PasswordInput
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: value =>
                                            value === password || "Passwords must match"
                                    })}
                                />
                                <Field.ErrorText id="confirmPassword-error">
                                    {errors.confirmPassword?.message}
                                </Field.ErrorText>
                            </Field.Root>
                        </Fieldset.Content>

                        <Button
                            type="submit"
                            variant="solid"
                            bgColor="primary"
                            color="onPrimary"
                            mt={{ base: "4", lg: "8" }}
                            fontWeight="bold"
                            _hover={{ bgColor: "primary/85" }}
                            _disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
                            focusRingColor="secondary"
                            disabled={!isValid || isSubmitting}
                            loading={isSubmitting}
                            loadingText="Submitting..."
                        >
                            Reset
                        </Button>
                    </Fieldset.Root>
                </motion.div>
            </Box>
        </form>
    );
};

export default React.memo(PasswordResetForm);