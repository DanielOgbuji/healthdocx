import { Button, ButtonGroup, Image, Text, Stack, Steps, Link, Flex } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import Logo from "@/assets/images/logo.svg";
import LogoDark from "@/assets/images/logo-dark.svg";
import type { IconType } from "react-icons";
import { InfoTip } from "@/components/ui/privacy-tip";
import type { ReactElement, ReactNode } from "react";

interface Step {
    title: string;
    description: string;
    icon: IconType;
    formComponent: ReactElement;
    formLegend: string;
    formHelperText: string | ReactNode;
}

interface StepsContentProps {
    steps: Step[];
}

export const StepsContent = ({ steps }: StepsContentProps) => {
    const { colorMode } = useColorMode();
    return (
        <Stack justifyContent="center" alignItems="center" flexGrow="1">
            {steps.map((step, index) => (
                <Steps.Content key={index} index={index} colorPalette="brand" py="16">
                    {[0, 1, 2].includes(index) && (
                        <Stack alignItems="center" mb="6" gap="0">
                            <Image
                                src={colorMode === "dark" ? LogoDark : Logo}
                                mb="4"
                                width="48px"
                                height="48px"
                                alt="Company Logo"
                                loading="lazy"
                            />
                            <Flex alignItems="center" gap="2" mb="1">
                                <Text color="onSurface" fontSize="3xl" fontWeight="bold">{step.formLegend}</Text>
                                <InfoTip
                                    content={
                                        <>
                                            We will never share your information.{" "}
                                            <Link href="#" variant="underline" color="fg.info" target="_blank">
                                                Our Privacy Policy
                                            </Link>
                                        </>
                                    }
                                />
                            </Flex>
                            <Text color="outline" textAlign="center" width="90%">{step.formHelperText}</Text>
                        </Stack>
                    )}
                    {step.formComponent}
                </Steps.Content>
            ))}
            <Steps.CompletedContent>All steps are complete!</Steps.CompletedContent>

            <ButtonGroup size="sm" variant="outline" display="none">
                <Steps.PrevTrigger asChild>
                    <Button>Prev</Button>
                </Steps.PrevTrigger>
                <Steps.NextTrigger asChild>
                    <Button>Next</Button>
                </Steps.NextTrigger>
            </ButtonGroup>
        </Stack>
    );
};