"use client"

import React, { useEffect } from "react"
import { Button, Field, Fieldset, PinInput, Flex, Box, Link, IconButton } from "@chakra-ui/react"
import { MdOutlineUndo } from "react-icons/md";
import { Controller, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useAnimate } from "motion/react";
import { toaster } from "@/components/ui/toaster";
import { setOtp, setResendTimer, incrementResendAttempts, resetResendAttempts, setIsSubmitting } from "@/features/forms/FormTwoSlice"
import { completeStep } from "@/features/OnboardingSlice";
import type { RootState } from "@/store/store"
import { INITIAL_RESEND_TIMER, MAX_RESEND_ATTEMPTS, RESEND_TIMER_INCREMENT } from '@/constants/formConstants';

interface FormValues {
    pin: string[]
}

export default function FormTwo() {
    const dispatch = useDispatch();
    const { resendTimer, resendAttempts, defaultPin, isSubmitting } = useSelector((state: RootState) => state.formTwo);
    const [otpError, setOtpError] = React.useState<string | null>(null)
    const [scope, animate] = useAnimate();
    const {
        handleSubmit,
        control,
        watch,
        setError,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: { pin: defaultPin }
    })

    const pin = watch('pin')
    // Handle resend timer countdown
    React.useEffect(() => {
        if (resendTimer <= 0) return
        const id = setInterval(() => {
            dispatch(setResendTimer(resendTimer - 1))
        }, 1000)
        return () => clearInterval(id)
    }, [resendTimer, dispatch])

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

    const onSubmit = handleSubmit(async ({ pin }) => {
        dispatch(setIsSubmitting(true))
        setOtpError(null)
        const otp = pin.join('')
        try {
            await new Promise((resolve, reject) =>
                setTimeout(() => otp === '1234' ? resolve(true) : reject(new Error()), 500)
            )
            dispatch(setOtp(otp))
            console.log('OTP verified successfully')
            toaster.create({
                duration: 3000,
                title: "Success",
                description: "Email verified successfully.",
                type: "success",
            });
            dispatch(completeStep(1)); // Mark the second step as completed
            reset({ pin: defaultPin }) // Reset the form to default pin
        } catch {
            setOtpError("The code you entered is incorrect.")
            setError("pin", { type: "manual", message: "The code you entered is incorrect." })
        } finally {
            dispatch(setIsSubmitting(false))
        }
    })

    const handleResend = () => {
        if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
            dispatch(resetResendAttempts())
            dispatch(setResendTimer(INITIAL_RESEND_TIMER))
        } else {
            dispatch(incrementResendAttempts())
            dispatch(setResendTimer(INITIAL_RESEND_TIMER + resendAttempts * RESEND_TIMER_INCREMENT))
        }
        // Place to trigger resend API
        console.log('Resending code...')
        toaster.create({
            duration: 3000,
            title: "Code has been resent",
            description: "Check your inbox or spam for code",
            type: "success",
        });
    }

    return (
        <form onSubmit={onSubmit} onReset={() => reset({ pin: defaultPin })}>
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
                                            {[0, 1, 2, 3].map(idx => (
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
                        borderColor="error" _hover={{ bg: 'errorSubtle' }} title="Clear OTP">
                        <MdOutlineUndo />
                    </IconButton>
                </Flex>
            </Fieldset.Root>
        </form>
    )
}

