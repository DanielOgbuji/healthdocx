"use client"

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

interface OnBoardingFormTwoProps {
	legendText: string;
	helperText: string;
	onSuccess?: () => void;
}

// Simulated correct OTP value.
const CORRECT_OTP = "1234";

const OnBoardingFormTwo: React.FC<OnBoardingFormTwoProps> = ({
	legendText,
	helperText,
	onSuccess,
}) => {
	const store = usePinInput();
	const [error, setError] = useState("");

	// Join the array into a string for easier processing.
	const pin = store.value.join("");

	// Clear error only when the user starts typing (i.e. pin length > 0)
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
				onSuccess?.();
			} else {
				setError("Incorrect code. Please try again.");
				// Clear the input so the user can try again.
				store.setValue(Array(4).fill(""));
			}
		}
	};

	return (
		<form className="onboarding-form" onSubmit={handleSubmit}>
			<Fieldset.Root size="lg" maxW="lg" alignItems="center">
				<Stack alignItems="center" role="banner">
					<Image
						src="src/assets/Off-Jeay.svg"
						mb="12px"
						width="48px"
						height="48px"
						alt="Company Logo"
						loading="lazy"
					/>
					<Fieldset.Legend role="heading" fontWeight="bold" fontSize="2xl" aria-level={1} mb="4px">
						{legendText}
					</Fieldset.Legend>
					<Fieldset.HelperText textAlign="center">
						{helperText}
					</Fieldset.HelperText>
				</Stack>
				<Fieldset.Content alignItems="center">
					<PinInput.RootProvider value={store} size="2xl">
						<PinInput.Control display="flex" gap="2">
							{Array.from({ length: 4 }).map((_, index) => (
								<PinInput.Input key={index} index={index} />
							))}
						</PinInput.Control>
					</PinInput.RootProvider>
				</Fieldset.Content>
				{error && (
					<Text color="fg.error" fontSize="sm" fontWeight="medium" mt="0.375rem" textAlign="center">
						{error}
					</Text>
				)}
				<Text textStyle="sm" textAlign="center">
					Didn&apos;t get a code?
					<Link variant="underline" href="#" ml="1">
						Click to resend
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
