import { Stack, VStack, Spinner, Text } from "@chakra-ui/react";
import { lazy, Suspense } from "react";

const OnboardingSteps = lazy(() => import("@/containers/OnboardingSteps"))

const LoadingFallback = () => (
    <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
        <VStack>
            <Spinner borderWidth="4px" color="primary" />
            <Text color="primary">Loading...</Text>
        </VStack>
    </Stack>
);

const SignUp = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <OnboardingSteps />
        </Suspense>
    );
}

export default SignUp;