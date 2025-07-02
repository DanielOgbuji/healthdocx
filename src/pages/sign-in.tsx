import { Stack, VStack, Spinner, Text } from "@chakra-ui/react";
import { lazy, Suspense } from "react";

const SignIn = lazy(() => import("@/components/auth/SignIn"));

const LoadingFallback = () => (
    <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
        <VStack>
            <Spinner borderWidth="4px" color="primary" />
            <Text color="primary">Loading...</Text>
        </VStack>
    </Stack>
);

const SignInPage = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <SignIn />
        </Suspense>
    );
}

export default SignInPage;