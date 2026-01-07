import { Button, Field, Fieldset, PinInput, Flex, Box, Link, IconButton } from "@chakra-ui/react";
import { MdOutlineUndo } from "react-icons/md";
import { Controller } from "react-hook-form";
import { useEmailVerification } from "@/hooks/onboarding/useEmailVerification";

export default function EmailVerificationForm() {
    const {
        scope,
        control,
        pin,
        otpError,
        errors,
        isSubmitting,
        resendTimer,
        handleResend,
        onSubmit,
        reset
    } = useEmailVerification();

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
                            e.preventDefault();
                            if (resendTimer <= 0) handleResend();
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
    );
}
