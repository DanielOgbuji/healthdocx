import React from "react"
import { useNavigate } from "react-router"
import { Box, Button, Fieldset, Flex, Stack, Field, PinInput, Link } from "@chakra-ui/react"
import { Controller, useForm } from "react-hook-form"
import { useAnimate } from "motion/react"
import { AnimatePresence, motion } from "motion/react"
import { toaster } from "@/components/ui/toaster"
import { INITIAL_RESEND_TIMER, MAX_RESEND_ATTEMPTS, RESEND_TIMER_INCREMENT, STORAGE_KEYS } from '@/constants/formConstants';
import { forgotPassword } from "@/api/auth";
import { getErrorMessage } from "@/utils/apiUtils";

interface FormValues {
    pin: string[]
}

interface VerifyEmailProps {
    onSuccess?: () => void
}

export default function VerifyEmail({ onSuccess }: VerifyEmailProps) {
    const navigate = useNavigate()
    const [scope, animate] = useAnimate()
    const [otpError, setOtpError] = React.useState<string | null>(null)
    const [isVisible, setIsVisible] = React.useState(true)
    const [resendTimer, setResendTimer] = React.useState(0)
    const resendAttemptsRef = React.useRef(0)

    // Get email from sessionStorage (set by ForgotPassword component)
    const email = sessionStorage.getItem(STORAGE_KEYS.RESET_PWD_EMAIL)

    const defaultPin = ['', '', '', '']

    const {
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        defaultValues: { pin: defaultPin }
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
    React.useEffect(() => {
        if (otpError && scope.current) {
            animate(
                scope.current,
                { x: [0, -7, 7, -7, 7, 0] },
                { duration: 0.2, repeat: 2 }
            )
        }
    }, [otpError, animate, scope])

    const onSubmit = handleSubmit(({ pin }) => {
        const otp = pin.join('')

        if (!email) {
            setOtpError("Email not found. Please try the forgot password process again.")
            return
        }

        // Store OTP in sessionStorage for use in PasswordReset component
        sessionStorage.setItem(STORAGE_KEYS.RESET_PWD_OTP, otp)

        setIsVisible(false)
        setTimeout(() => {
            navigate("/password-reset")
            onSuccess?.()
        }, 500)

        reset({ pin: defaultPin })
    })

    const handleResend = async () => {
        if (!email) {
            toaster.create({
                duration: 3000,
                title: "Error",
                description: "Email not found. Please try the forgot password process again.",
                type: "error",
            })
            return
        }

        try {
            await forgotPassword(email)

            if (resendAttemptsRef.current >= MAX_RESEND_ATTEMPTS) {
                resendAttemptsRef.current = 0
                setResendTimer(INITIAL_RESEND_TIMER)
            } else {
                resendAttemptsRef.current++
                setResendTimer(INITIAL_RESEND_TIMER + resendAttemptsRef.current * RESEND_TIMER_INCREMENT)
            }

            toaster.create({
                duration: 3000,
                title: "Code has been resent",
                description: "Check your inbox or spam for code",
                type: "success",
            })
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error)

            toaster.create({
                duration: 3000,
                title: "Error",
                description: errorMessage,
                type: "error",
            })
        }
    }

    return (
        <form
            onSubmit={onSubmit}
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
                }}>
                <AnimatePresence initial={true}>
                    {isVisible && (
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: "0", opacity: 1 }}
                            exit={{ opacity: 0, y: "-100%" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <Fieldset.Root
                                size="lg"
                                w={{ base: "100%", lg: "lg" }}
                                px={{ base: "4", lg: "8" }}
                                pb={{ base: "4", lg: "6" }}
                                pt={{ base: "4", lg: "8" }}
                                borderStyle="solid"
                                alignItems="center"
                                borderWidth="thin"
                                borderColor="outline/40"
                                borderRadius="md"
                                bgGradient="to-t"
                                gradientFrom="transparent"
                                gradientTo="primary/15"
                                overflow="hidden"
                                backdropFilter={"blur(1.25px)"}
                                colorPalette="brand">
                                <Stack alignItems="flex-start" role="banner" w="100%">
                                    <Fieldset.Legend fontSize="2xl" fontWeight="bold">
                                        Verify Email
                                    </Fieldset.Legend>
                                    <Fieldset.HelperText>
                                        Please enter the OTP sent to your email to reset your password.
                                    </Fieldset.HelperText>
                                </Stack>

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
                                                        alignContent="center"
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

                                <Box mt="6">
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

                                <Button
                                    type="submit"
                                    width="full"
                                    mt="6"
                                    _hover={{ bgColor: "primary/85" }}
                                    _disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
                                    disabled={!pin.every(Boolean) || isSubmitting}
                                    loading={isSubmitting}
                                    loadingText="Verifying..."
                                >
                                    Submit
                                </Button>
                            </Fieldset.Root>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </form>
    )
}
