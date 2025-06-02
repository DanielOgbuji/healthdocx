import { Flex, Icon, Steps, StepsStatus } from "@chakra-ui/react";
import { MdOutlineCheck, MdOutlineCircle } from 'react-icons/md';
import StepsLayout from "@/components/StepsLayout.tsx";
import type { IconType } from "react-icons";

interface Step {
    title: string;
    description: string;
    icon: IconType;
}

interface StepsListProps {
    steps: Step[];
    currentStep?: number;
}

export const StepsList = ({ steps, currentStep = 0 }: StepsListProps) => {
    return (
        <StepsLayout steps={steps} currentStep={currentStep}>
            <Steps.List padding="12" height="lg" colorPalette="brand">
                {steps.map((step, index) => {
                    const CurrentStepIcon = step.icon;
                    return (
                        <Steps.Item key={index} index={index} title={step.title} gap="4">
                            <Steps.Indicator borderWidth="thin" _incomplete={{ borderColor: 'secondaryContainer' }}>
                                <StepsStatus
                                    complete={<Icon size="md" animation="ping" animationIterationCount="1"
                                        animationDuration="slow"><MdOutlineCheck /></Icon>}
                                    incomplete={<Icon size="lg" color="primary" animation="ping"
                                        animationIterationCount="1"
                                        animationDuration="slow"><MdOutlineCircle /></Icon>}
                                    current={<Icon size="lg"><CurrentStepIcon /></Icon>}
                                />
                            </Steps.Indicator>
                            <Flex direction="column">
                                <Steps.Title
                                    fontWeight="medium"
                                    color="outline" // Default color
                                    css={{
                                        '[aria-current="step"] &': {
                                            fontWeight: 'bold',
                                            color: 'primary',
                                        },
                                    }}
                                >
                                    {step.title}
                                </Steps.Title>
                                <Steps.Description
                                    fontWeight="light"
                                    fontSize="xs"
                                    color="outlineVariant"
                                    css={{
                                        '[aria-current="step"] &': {
                                            color: 'onSurface',
                                        },
                                    }}
                                >
                                    {step.description}
                                </Steps.Description>
                            </Flex>
                            <Steps.Separator width="1px" bg="transparent" _current={{ bg: 'secondaryContainer' }}
                                _complete={{ bg: 'primary' }} />
                        </Steps.Item>
                    );
                })}
            </Steps.List>
        </StepsLayout>
    );
};