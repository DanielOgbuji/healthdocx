import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toaster } from "@/components/ui/toaster";
import { completeStep } from '@/features/onboarding-slice';
import { register as registerUser } from "@/api/auth";
import { type ApiError } from '@/types/api.types';

export interface SignupFormValues {
    fullName: "";
    email: "";
    role: "";
    phoneNumber: "";
    password: "";
    invitationCode: "";
}

export const useSignupLogic = (invitationCode?: string | null) => {
    const dispatch = useDispatch();
    
    const formMethods = useForm({
        mode: 'onBlur',
        defaultValues: {
            fullName: "",
            email: "",
            role: "",
            phoneNumber: "",
            password: "",
            invitationCode: invitationCode || "",
        }
    });

    const onSubmit = formMethods.handleSubmit(async (data) => {
        try {
            const response = await registerUser(data);
            console.log('Form submitted successfully:', response);
            
            // Side effects
            sessionStorage.setItem("onboardingEmail", data.email);
            sessionStorage.setItem("userID", response.userId);
            
            toaster.create({
                duration: 3000,
                title: "Success",
                description: "Account created successfully.",
                type: "success",
            });
            
            // Mark the first step as completed
            dispatch(completeStep(0));
            formMethods.reset();
        } catch (err) {
            console.error('Form submission failed:', err);
            const apiError = err as ApiError;
            toaster.create({
                title: "Registration Failed",
                description: apiError.response?.data?.error ?? "An error occurred during registration. Please try again.",
                type: "error",
                duration: 5000,
            });
        }
    });

    return {
        formMethods,
        onSubmit,
        isSubmitting: formMethods.formState.isSubmitting,
        isValid: formMethods.formState.isValid,
        errors: formMethods.formState.errors,
    };
};
