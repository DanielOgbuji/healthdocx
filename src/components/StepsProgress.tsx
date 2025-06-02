import { useEffect, useState } from "react";
import { ProgressCircle, AbsoluteCenter, Icon } from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface StepsProgressProps {
    currentStep: number;
    totalSteps: number;
    currentIcon: IconType;
}

export const StepsProgress = ({ currentStep, totalSteps, currentIcon: CurrentIcon }: StepsProgressProps) => {
    const [show, setShow] = useState(true);
    const progress = ((currentStep + 1) / totalSteps) * 100;

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY === 0);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <ProgressCircle.Root
            value={progress}
            display={show ? { base: "flex", lg: "none" } : "none"}
            height="48px"
            size="lg"
            bg={{ base: "white", _dark: "black" }}
            colorPalette='brand'
            position="fixed"
            top="1rem"
            left="1rem"
            zIndex="banner"
        >
            <ProgressCircle.Circle css={{ "--thickness": "2px" }}>
                <ProgressCircle.Track />
                <ProgressCircle.Range />
            </ProgressCircle.Circle>
            <AbsoluteCenter>
                <Icon size="lg" color="primary">
                    {CurrentIcon && <CurrentIcon />}
                </Icon>
            </AbsoluteCenter>
        </ProgressCircle.Root>
    );
};