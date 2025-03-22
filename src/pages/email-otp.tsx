"use client";

import React, { useEffect, useState } from "react";
import {
	Fieldset,
	Stack,
	Text,
	Link,
	Button,
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { toaster } from './../components/ui/toaster';


interface EmailOtpProps {
	legendText: string;
	helperText: string;
	onSuccess?: () => void;
}

const CORRECT_OTP = "1234";

const EmailOtp: React.FC<EmailOtpProps> = ({
	legendText,
	helperText,
	onSuccess,
}) => {
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");

	// Reset error if any input is added
	useEffect(() => {
		if (otp.length > 0 && error) {
			setError("");
		}
	}, [otp, error]);

	const handleChange = (value: string) => {
		setOtp(value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (otp.length === 4) {
			if (otp === CORRECT_OTP) {
				onSuccess?.();
			} else {
				setError("Incorrect code. Please try again.");
				setOtp(""); // Clear all inputs, letting PinInput handle focus reset
			}
		}
	};

	return (
		<form className="onboarding-form" onSubmit={handleSubmit}>
			<Fieldset.Root size="lg" maxW="lg" alignItems="center">
				<Stack alignItems="center" role="banner">
					<Fieldset.Legend
						role="heading"
						fontWeight="bold"
						fontSize="2xl"
						aria-level={1}
						mb="4px"
						color="onBackground"
					>
						{legendText}
					</Fieldset.Legend>
					<Fieldset.HelperText textAlign="center">
						{helperText}{" "}
					</Fieldset.HelperText>
				</Stack>
				<Fieldset.Content
					colorPalette="green"
					alignItems="center"
					display="inline-flex"
					flexDirection="row"
					justifyContent="center"
					gap="2"
				>
					<PinInput value={otp} onChange={handleChange} autoFocus>
						{Array.from({ length: 4 }).map((_, index) => (
							<PinInputField
								key={index}
								width="4rem"
								height="4rem"
								textAlign="center"
								borderWidth="1px"
								borderColor={error ? "#f87171" : "inherit"}
								borderRadius="4px"
								bgColor="transparent"
								fontSize="large"
							/>
						))}
					</PinInput>
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
							colorPalette="green"
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
					variant="surface"
					disabled={otp.length !== 4}
					aria-disabled={otp.length !== 4}
					width={{ base: "100%", lg: "75%" }}
					fontWeight="bold"
				>
					Submit
				</Button>
			</Fieldset.Root>
		</form>
	);
};

export default EmailOtp;
