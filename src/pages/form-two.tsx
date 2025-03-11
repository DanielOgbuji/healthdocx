"use client";

import React, { useEffect, useState } from "react";
import {
	Fieldset,
	Stack,
	Image,
	Text,
	Link,
	Button,
	usePinInput,
	PinInput,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { updateFormTwo } from "@/store/onboardingSlice";
import { toaster } from "@/components/ui/toaster";
import Logo from "@/assets/Off-Jeay.svg";

interface OnBoardingFormTwoProps {
	legendText: string;
	helperText: string;
	userEmail: string;
	onSuccess?: () => void;
}

const CORRECT_OTP = "1234";

const OnBoardingFormTwo: React.FC<OnBoardingFormTwoProps> = ({
	legendText,
	helperText,
	userEmail,
	onSuccess,
}) => {
	const dispatch = useDispatch();
	const store = usePinInput();
	const [error, setError] = useState("");

	const pin = store.value.join("");

	useEffect(() => {
		if (pin.length > 0 && error) {
			setError("");
		}
	}, [pin, error]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (pin.length === 4) {
			if (pin === CORRECT_OTP) {
				console.log("Correct OTP entered.");
				dispatch(updateFormTwo({ otp: pin }));
				onSuccess?.();
			} else {
				setError("Incorrect code. Please try again.");
				store.setValue(Array(4).fill(""));
			}
		}
	};

	return (
		<form className="onboarding-form" onSubmit={handleSubmit}>
			<Fieldset.Root size="lg" maxW="lg" alignItems="center">
				<Stack alignItems="center" role="banner">
					<Image
						src={Logo}
						mb="12px"
						width="48px"
						height="48px"
						alt="Company Logo"
						loading="lazy"
					/>
					<Fieldset.Legend
						role="heading"
						fontWeight="bold"
						fontSize="2xl"
						aria-level={1}
						mb="4px"
					>
						{legendText}
					</Fieldset.Legend>
					<Fieldset.HelperText textAlign="center">
						{helperText} <b>{userEmail}</b>
					</Fieldset.HelperText>
				</Stack>
				<Fieldset.Content alignItems="center">
					<PinInput.RootProvider value={store} size="2xl">
						<PinInput.Control display="flex" gap="2">
							{Array.from({ length: 4 }).map((_, index) => (
								<PinInput.Input
									key={index}
									index={index}
									borderColor={error ? "fg.error" : "inherit"}
								/>
							))}
						</PinInput.Control>
					</PinInput.RootProvider>
				</Fieldset.Content>
				{error && (
					<Text
						color="fg.error"
						fontSize="sm"
						fontWeight="medium"
						mt="0.375rem"
						textAlign="center"
					>
						{error}
					</Text>
				)}
				<Text textStyle="sm" textAlign="center">
					Didn&apos;t get a code?{" "}
					<Link variant="underline" href="#" ml="1">
						<Button
							type="button"
							variant="plain"
							height="fit-content"
							p="0"
							onClick={() =>
								toaster.create({
									duration: 3000,
									title: "Code has been resent",
									description: "Check your inbox or spam for code",
									type: "success",
								})
							}
						>
							Click to resend
						</Button>
					</Link>
				</Text>
				<Button
					type="submit"
					variant="solid"
					disabled={pin.length !== 4}
					aria-disabled={pin.length !== 4}
					width={{ base: "100%", lg: "75%" }}
				>
					Continue
				</Button>
			</Fieldset.Root>
		</form>
	);
};

export default OnBoardingFormTwo;
