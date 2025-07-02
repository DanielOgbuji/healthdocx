import { Stack, VStack, Spinner, Text } from "@chakra-ui/react";
import { lazy, Suspense } from "react";

const Outlet = lazy(() => import("react-router").then(module => ({ default: module.Outlet })));
const NavBar = lazy(() => import("@/components/navigation/NavBar"));

const LoadingFallback = () => (
    <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
        <VStack>
            <Spinner borderWidth="4px" color="primary" />
            <Text color="primary">Loading...</Text>
        </VStack>
    </Stack>
);

const WorkSpace = () => {
    return (
        <>
            <Suspense fallback={<LoadingFallback />}>
                <NavBar />
                <Outlet />
            </Suspense>
        </>
    );
}

export default WorkSpace;