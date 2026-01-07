import { useEffect, useState, lazy, Suspense } from "react";
import { Box, Steps, Stack, VStack, Spinner, Text, useBreakpointValue } from "@chakra-ui/react";
import { MdOutlinePersonOutline, MdOutlineMarkEmailRead, MdOutlineWorkOutline, MdOutlineTimelapse, MdOutlineVerified } from 'react-icons/md';
import { StepsList } from "@/components/onboarding/StepsList";
import { StepsContent } from "@/components/onboarding/StepsContent";
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useSearchParams } from "react-router";

const PersonalDetailsForm = lazy(() => import("@/components/onboarding/PersonalDetailsForm"));
const EmailVerificationForm = lazy(() => import("@/components/onboarding/EmailVerificationForm"));
const InstitutionDetailsForm = lazy(() => import("@/components/onboarding/InstitutionDetailsForm"));
const InstitutionVerificationParams = lazy(() => import("@/components/onboarding/InstitutionVerificationParams"));
const OnboardingSuccess = lazy(() => import("@/components/onboarding/OnboardingSuccess"));

const LoadingFallback = () => (
    <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
        <VStack>
            <Spinner size="xl" borderWidth="4px" color="primary" />
            <Text color="primary">Loading...</Text>
        </VStack>
    </Stack>
);

const OnboardingSteps = () => {
    const [step, setStep] = useState(0);
    const [searchParams] = useSearchParams();
    const invitationCode = searchParams.get("code");

    useEffect(() => {
        const continueStep = searchParams.get("continueStep");
        if (continueStep === "1") {
            setStep(1);
        }
    }, [searchParams]);
    const completedSteps = useSelector((state: RootState) => state.onboarding.completedSteps);
    const userEmail = sessionStorage.getItem("onboardingEmail");
    const stepsData = [
        {
            title: "Your details",
            description: "Provide your essential details",
            icon: MdOutlinePersonOutline,
            formComponent: <PersonalDetailsForm invitationCode={invitationCode} />,
            formLegend: "Create an account",
            formHelperText: "Fill in your details as it is in your National ID."
        },
        {
            title: "Verify your email",
            description: "Enter your verification code",
            icon: MdOutlineMarkEmailRead,
            formComponent: <EmailVerificationForm />,
            formLegend: "Verify your email",
            formHelperText: (
                <>
                    We sent a code to{" "}
                    {userEmail ? <Box as="span" fontWeight="bold" fontStyle="italic" color="primary">{userEmail}</Box> : "your email"}.
                </>
            ),
        },
        {
            title: "Your institution details",
            description: "Provide your hospital information",
            icon: MdOutlineWorkOutline,
            formComponent: <InstitutionDetailsForm />,
            formLegend: "Add institution details",
            formHelperText: "Fill in your institution details correctly."
        },
        {
            title: "Institution verification",
            description: "Wait for a quick verification",
            icon: MdOutlineTimelapse,
            formComponent: <InstitutionVerificationParams />,
            formLegend: "",
            formHelperText: "",
        },
        {
            title: "Welcome to Healthdocx!",
            description: "Your account is up and running",
            icon: MdOutlineVerified,
            formComponent: <OnboardingSuccess />,
            formLegend: "Create an account",
            formHelperText: "Fill in your details as it is in your National ID."
        }
    ];
    // Only load the current step
    const steps = stepsData.map((stepData, idx) => ({
        ...stepData,
        formComponent: idx === step ? stepData.formComponent : <></>
    }));

    // Warn user about unsaved data on reload for FormOne and FormThree
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "Your information will not be saved. Are you sure you want to leave?";
        };

        if (step === 0 || step === 2) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        } else {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }

        // Cleanup
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [step]);

    useEffect(() => {
        if (completedSteps[step]) {
            setStep((prev) => prev + 1);
        }
    }, [completedSteps, step]);

    return (
        <Steps.Root
            step={step}
            onStepChange={(e) => setStep(e.step)}
            display="flex"
            orientation={useBreakpointValue({ base: "horizontal", md: "vertical" })}
            width="100%"
            defaultStep={0}
            count={steps.length}
        >
            <StepsList steps={steps} currentStep={step} />
            <Suspense fallback={<LoadingFallback />}>
                <StepsContent steps={steps} />
            </Suspense>
        </Steps.Root>
    );
};

export default OnboardingSteps;
