import { Flex, Link, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import Backdrop from "@/assets/images/jeay-backdrop-dotted.svg";
import BackdropDark from "@/assets/images/jeay-backdrop-dotted-dark.svg";
import { StepsProgress } from "@/components/onboarding/StepsProgress";

interface Step {
    title: string;
    description: string;
    icon: IconType;
}

interface StepsLayoutProps {
    children: ReactNode;
    steps: Step[];
    currentStep: number;
}

const StepsLayout = ({ children, steps, currentStep }: StepsLayoutProps) => {
    return (
        <>
            <Flex
                position="fixed"
                display={{ base: "none", lg: "flex" }}
                height="calc(100vh - 2rem)"
                margin="4" mr="0"
                bgImage={{
                    base: `url("${Backdrop}")`,
                    _dark: `url("${BackdropDark}")`,
                }}
                bgRepeat="no-repeat"
                bgAttachment="fixed"
                bgPos="0% 124%"
                bgSize="360px"
            >
                <Flex bgGradient="to-b" gradientFrom="surface" gradientTo="transparent" borderWidth="thin"
                    borderRightRadius="lg" direction="column"
                    justifyContent="space-between" boxSizing="border-box">
                    {children}
                    <Text textStyle="sm" textAlign="center" pb="8">
                        Already have an account?{" "}
                        <Link href="/sign-in" ml="1" color="primary" fontStyle="italic">
                            Sign in
                        </Link>
                    </Text>
                </Flex>
            </Flex>
            <Flex width="calc(337.562px + 1rem)" display={{ base: "none", lg: "flex" }} />
            <StepsProgress
                currentStep={currentStep}
                totalSteps={steps.length}
                currentIcon={steps[currentStep]?.icon}
            />
        </>
    );
};

export default StepsLayout;