import { Stack, VStack, Spinner, Text, Flex } from "@chakra-ui/react";
import { lazy, Suspense } from "react";

const Outlet = lazy(() => import("react-router").then(module => ({ default: module.Outlet })));
const NavBar = lazy(() => import("@/components/navigation/NavBar"));

const LoadingFallback = () => (
    <Stack flexGrow="1" height="100%" alignItems="center" justifyContent="center">
        <VStack>
            <Spinner size="xl" borderWidth="4px" color="primary" />
            <Text color="primary">Loading...</Text>
        </VStack>
    </Stack>
);

const WorkSpace = () => {
    return (
        <>
            <Suspense fallback={<LoadingFallback />}>
                <Flex bgColor="backface" color="onBackground">
                    <NavBar />
                    <Outlet />
                </Flex>
            </Suspense>
        </>
    );
}

export default WorkSpace;