import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useAnimate } from "motion/react";
import { toaster } from "@/components/ui/toaster";
import { completeStep } from "@/features/onboarding-slice";
import { loginSuccess } from "@/features/authSlice";
import { verifyEmail as verifyUserEmail, resendVerification } from "@/api/auth";
import { type ApiError } from '@/types/api.types';
import { INITIAL_RESEND_TIMER, MAX_RESEND_ATTEMPTS, RESEND_TIMER_INCREMENT } from '@/constants/formConstants';
import { useSearchParams } from "react-router";

interface FormValues {
    pin: string[];
}

export const useEmailVerification = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [resendTimer, setResendTimer] = useState(0);
    const [resendAttempts, setResendAttempts] = useState(0);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [scope, animate] = useAnimate();
    const [isMounted, setIsMounted] = useState(false);
    
    const email = sessionStorage.getItem("onboardingEmail");

    const {
        handleSubmit,
        control,
        watch,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        defaultValues: { pin: ['', '', '', '', '', ''] }
    });

    const pin = watch('pin');

    // Handle resend timer countdown
    useEffect(() => {
        if (resendTimer <= 0) return;
        const id = setInterval(() => {
            setResendTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(id);
    }, [resendTimer]);

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
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Auto-resend if query param is set
    useEffect(() => {
        const continueStep = searchParams.get("continueStep");
        if (isMounted && continueStep === "1") {
            handleResend();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, email, isMounted]);

    const handleResend = async () => {
        if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
            setResendAttempts(0);
            setResendTimer(INITIAL_RESEND_TIMER);
        } else {
            setResendAttempts(prev => prev + 1);
            setResendTimer(INITIAL_RESEND_TIMER + resendAttempts * RESEND_TIMER_INCREMENT);
        }

        try {
            await resendVerification(email);
            console.log('Resending code...');
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

    const onSubmit = handleSubmit(async ({ pin }) => {
        setOtpError(null);
        const otp = pin.join('');
        try {
            const response = await verifyUserEmail(email, otp);
            console.log('OTP verified successfully:', response);
            toaster.create({
                duration: 3000,
                title: "Success",
                description: "Email verified successfully.",
                type: "success",
            });
            dispatch(loginSuccess(response));
            dispatch(completeStep(1));
            reset({ pin: ['', '', '', '', '', ''] });
        } catch (err) {
            console.error('Form submission failed:', err);
            const apiError = err as ApiError;
            if (apiError.response?.status === 400) {
                setOtpError("The code you entered is incorrect.");
                setError("pin", { type: "manual", message: "The code you entered is incorrect." });
            } else {
                toaster.create({
                    title: "Email Verification Failed",
                    description: apiError.response?.data?.message ?? "An error occurred during verification. Please try again.",
                    type: "error",
                    duration: 5000,
                });
            }
        }
    });

    return {
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
    };
};
