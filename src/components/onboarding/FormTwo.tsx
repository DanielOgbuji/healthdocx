import React, { useEffect, useState } from "react"
import { Button, Field, Fieldset, PinInput, Flex, Box, Link, IconButton } from "@chakra-ui/react"
import { MdOutlineUndo } from "react-icons/md";
import { Controller, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useAnimate } from "motion/react";
import { toaster } from "@/components/ui/toaster";
import { completeStep } from "@/features/OnboardingSlice";
import { INITIAL_RESEND_TIMER, MAX_RESEND_ATTEMPTS, RESEND_TIMER_INCREMENT } from '@/constants/formConstants';
import { verifyEmail as verifyUserEmail, resendVerification as resendVerification } from "@/api/auth";
import { type ApiError } from '@/types/api.types';
//import { type AppDispatch } from "@/store/store";
import { loginSuccess } from "@/features/authSlice";
import { useSearchParams } from "react-router";

interface FormValues {
    pin: string[]
}

export default function FormTwo() {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [resendTimer, setResendTimer] = useState(0);
    const [resendAttempts, setResendAttempts] = useState(0);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [scope, animate] = useAnimate();
    const {
        handleSubmit,
        control,
        watch,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        defaultValues: { pin: ['', '', '', '', '', ''] }
    })

    const pin = watch('pin')

    // Handle resend timer countdown
    React.useEffect(() => {
        if (resendTimer <= 0) return
        const id = setInterval(() => {
            setResendTimer(prev => prev - 1)
        }, 1000)
        return () => clearInterval(id)
    }, [resendTimer])

    // Trigger shake animation when an error occurs
    useEffect(() => {
        if (otpError && scope.current) {
            animate(
                scope.current,
                { x: [0, -7, 7, -7, 7, 0] },
                { duration: 0.2, repeat: 2 }
            );
        }
    }, [otpError, animate, scope]);

    const email = sessionStorage.getItem("onboardingEmail");

    // Handle submit for development
    const onSubmit = handleSubmit(async ({ pin }) => {
        setOtpError(null)
        const otp = pin.join('')
        try {
            const response = await verifyUserEmail(email, otp);
            console.log('OTP verified successfully:', response)
            toaster.create({
                duration: 3000,
                title: "Success",
                description: "Email verified successfully.",
                type: "success",
            });
            console.log('OTP verified successfully:', response);
            dispatch(loginSuccess(response));
            dispatch(completeStep(1)); // Mark the second step as completed
            reset({ pin: ['', '', '', '', '', ''] }) // Reset the form to default pin
        } catch (err) {
            console.error('Form submission failed:', err);
            const apiError = err as ApiError;
            if (apiError.response?.status === 400) {
                setOtpError("The code you entered is incorrect.")
                setError("pin", { type: "manual", message: "The code you entered is incorrect." })
            }
            else {
                toaster.create({
                    title: "Email Verification Failed",
                    description: apiError.response?.data?.message ?? "An error occurred during verification. Please try again.",
                    type: "error",
                    duration: 5000,
                })
            }
        }
    })

    //Handle resend for development
    const handleResend = async () => {
        if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
            setResendAttempts(0)
            setResendTimer(INITIAL_RESEND_TIMER)
        } else {
            setResendAttempts(prev => prev + 1)
            setResendTimer(INITIAL_RESEND_TIMER + resendAttempts * RESEND_TIMER_INCREMENT)
        }
        // Place to trigger resend API
        try {
            // Call the resend verification API
            await resendVerification(email);
            console.log('Resending code...')
            toaster.create({
                duration: 3000,
                title: "Code has been resent",
                description: "Check your inbox or spam for code",
                type: "success",
            });
        } catch (err) {
            console.error('Resend verification failed:', err);
            const apiError = err as ApiError;
            toaster.create({
                duration: 5000,
                title: "Failed to resend code",
                description: apiError.response?.data?.message || "An error occurred. Please try again.",
                type: "error",
            });
        }
    }

    useEffect(() => {
        const startStep = searchParams.get("startStep");
        if (startStep === "1") {
            const resendCode = async () => {
                try {
                    // Call the resend verification API
                    await resendVerification(email);
                    console.log('Resending code...')
                    toaster.create({
                        duration: 3000,
                        title: "Code has been resent",
                        description: "Check your inbox or spam for code",
                        type: "success",
                    });
                } catch (err) {
                    console.error('Resend verification failed:', err);
                    const apiError = err as ApiError;
                    toaster.create({
                        duration: 5000,
                        title: "Failed to resend code",
                        description: apiError.response?.data?.message || "An error occurred. Please try again.",
                        type: "error",
                    });
                }
            };
            resendCode();
        }
    }, [searchParams, email]);

    return (
        <form onSubmit={onSubmit} onReset={() => reset({ pin: ['', '', '', '', '', ''] })}>
            <Fieldset.Root size="lg" width={{ base: "full", md: "lg" }} alignItems="center">
                <Fieldset.Content>
                    <Field.Root invalid={!!errors.pin} alignItems="center">
                        <Controller
                            control={control}
                            name="pin"
                            rules={{ required: "Pin is required" }}
                            render={({ field }) => (
                                <Flex ref={scope}>
                                    <PinInput.Root
                                        size="2xl"
                                        otp
                                        value={field.value}
                                        autoFocus
                                        onValueChange={e => field.onChange(e.value)}
                                    >
                                        <PinInput.HiddenInput />
                                        <PinInput.Control>
                                            {[0, 1, 2, 3, 4, 5].map(idx => (
                                                <PinInput.Input key={idx} index={idx} />
                                            ))}
                                        </PinInput.Control>
                                    </PinInput.Root>
                                </Flex>
                            )}
                        />
                        {(errors.pin?.message || otpError) && (
                            <Field.ErrorText>{errors.pin?.message || otpError}</Field.ErrorText>
                        )}
                    </Field.Root>
                </Fieldset.Content>
                <Box>
                    Didn't get a code?{' '}
                    <Link
                        href="#"
                        variant="underline"
                        onClick={e => {
                            e.preventDefault()
                            if (resendTimer <= 0) handleResend()
                        }}
                        color={resendTimer > 0 ? 'outline' : 'primary'}
                        cursor={resendTimer > 0 ? 'not-allowed' : 'pointer'}
                        focusRing="none"
                    >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Click to resend'}
                    </Link>
                </Box>
                <Flex gap="2" width={{ base: "full", md: "md" }} justifyContent="center" px="8">
                    <Button
                        type="submit"
                        flex="1"
                        fontWeight="bold"
                        _disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
                        disabled={!pin.every(Boolean) || isSubmitting}
                        loading={isSubmitting}
                        loadingText="Verifying..."
                    >
                        Continue
                    </Button>
                    <IconButton aria-label="Reset form" type="reset" variant="outline" color="error"
                        borderColor="error" _hover={{ bg: 'errorSubtle' }} title="Clear OTP" disabled={isSubmitting}>
                        <MdOutlineUndo />
                    </IconButton>
                </Flex>
            </Fieldset.Root>
        </form>
    )
}
