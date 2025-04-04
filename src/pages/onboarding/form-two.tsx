"use client";

import React, { useEffect, useState, useRef } from "react";
import { Fieldset, Stack, Image, Text, Button, Box } from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useDispatch } from "react-redux";
import { updateFormTwo } from "@/store/onboardingSlice";
import { toaster } from "@/components/ui/toaster";
import Logo from "@/assets/Off-Jeay.svg";
import LogoDark from "@/assets/Off-Jeay-Dark.svg";
import { useAnimate } from "motion/react";
import { useColorMode } from "@/components/ui/color-mode";

interface OnBoardingFormTwoProps {
	legendText: string;
	helperText: string;
	userEmail: string;
	onSuccess?: () => void;
}

// Environment variables and constants
// NOTE to self: Client-side OTP validation is insecure.
const CORRECT_OTP = import.meta.env.VITE_CORRECT_OTP; // Default for testing - remove in production
const RESEND_TIMER_INCREMENT = parseInt(
	import.meta.env.VITE_RESEND_TIMER_INCREMENT,
	10
);
const INITIAL_RESEND_TIMER = parseInt(
	import.meta.env.VITE_INITIAL_RESEND_TIMER,
	10
);

// Number of resend attempts allowed before resetting the timer
const MAX_RESEND_ATTEMPTS = 3;

const OnBoardingFormTwo: React.FC<OnBoardingFormTwoProps> = ({
	legendText,
	helperText,
	userEmail,
	onSuccess,
}) => {
	const { colorMode } = useColorMode();
	const dispatch = useDispatch();
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [timer, setTimer] = useState(0);
	const [resendTimer, setResendTimer] = useState(INITIAL_RESEND_TIMER);

	// Use a ref for resend count instead of state to avoid unnecessary re-renders
	const resendCountRef = useRef<number>(0);

	// Use the useAnimate hook for the shake animation on error
	const [scope, animate] = useAnimate();

	// Trigger shake animation when an error occurs
	useEffect(() => {
		if (error && scope.current) {
			animate(
				scope.current,
				{ x: [0, -6, 6, -6, 6, 0] },
				{ duration: 0.25, repeat: 2 }
			);
		}
	}, [error, animate, scope]);

	// Reset error when input is provided
	useEffect(() => {
		if (otp.length > 0 && error) {
			setError("");
		}
	}, [otp, error]);

	// Timer countdown logic
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (timer > 0) {
			interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [timer]);

	const handleChange = (value: string) => {
		setOtp(value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (otp.length === 4) {
			// -------------------------------
			// Simulated Server-Side Validation
			// Will uncomment and modify this section when integrating with our backend:
			/*
			try {
				const response = await fetch('/api/validate-otp', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ otp, email: userEmail })
				});
				const data = await response.json();
				if (response.ok && data.valid) {
					dispatch(updateFormTwo({ otp }));
					onSuccess?.();
				} else {
					setError("Incorrect code. Please try again.");
					setOtp("");
				}
			} catch (err) {
				setError("Server error. Please try again later.");
			}
			*/
			// -------------------------------
			// Client-Side Validation (Remove for Production)
			if (otp === CORRECT_OTP) {
				dispatch(updateFormTwo({ otp }));
				onSuccess?.();
			} else {
				setError("Incorrect code. Please try again.");
				setOtp(""); // Clear input for a new try
			}
		}
	};

	// Resend code logic with timer and resend count management
	const handleResendCode = () => {
		toaster.create({
			duration: 3000,
			title: "Code has been resent",
			description: "Check your inbox or spam for code",
			type: "success",
		});

		// Start the timer
		setTimer(resendTimer);

		// Increment the resend count using the ref
		resendCountRef.current += 1;

		// If maximum resend attempts reached, reset timer and count; otherwise, increment the timer
		if (resendCountRef.current >= MAX_RESEND_ATTEMPTS) {
			setResendTimer(INITIAL_RESEND_TIMER);
			resendCountRef.current = 0;
		} else {
			setResendTimer((prev) => prev + RESEND_TIMER_INCREMENT);
		}
	};

	return (
		<form className="onboarding-form" onSubmit={handleSubmit}>
			<Fieldset.Root size="lg" maxW="lg" alignItems="center">
				<Stack alignItems="center" role="banner">
					<Image
						src={colorMode === "dark" ? LogoDark : Logo}
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
						color="onBackground"
					>
						{legendText}
					</Fieldset.Legend>
					<Fieldset.HelperText textAlign="center">
						{helperText}{" "}
						<Box as="span" color="primary" fontWeight="bold">
							{userEmail}
						</Box>
					</Fieldset.HelperText>
				</Stack>
				<div
					ref={scope}
					style={{
						width: "fit-content",
						height: "fit-content",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: "10px",
					}}
				>
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
									borderColor={error ? "#f87171" : "outline-variant"}
									borderRadius="4px"
									bgColor="transparent"
									fontSize="large"
								/>
							))}
						</PinInput>
					</Fieldset.Content>
				</div>
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
				<Text
					textStyle="sm"
					textAlign="center"
					display="flex"
					alignItems="center"
					gap="1"
				>
					Didn&apos;t get a code?{" "}
					<Button
						type="button"
						variant="plain"
						height="fit-content"
						colorPalette="green"
						p="0"
						onClick={handleResendCode}
						disabled={timer > 0}
						aria-disabled={timer > 0}
						textDecoration="underline"
					>
						{timer > 0 ? `Resend in ${timer}s` : "Click to resend"}
					</Button>
				</Text>
				<Button
					type="submit"
					variant="solid"
					disabled={otp.length !== 4}
					aria-disabled={otp.length !== 4}
					width={{ base: "100%", lg: "75%" }}
					color="onPrimary"
					fontWeight="bold"
					bgColor="primary"
					_hover={{ bgColor: "primary/85" }}
					_disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
					focusRingColor="secondary"
				>
					Continue
				</Button>
			</Fieldset.Root>
		</form>
	);
};

export default OnBoardingFormTwo;
