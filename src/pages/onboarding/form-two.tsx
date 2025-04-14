"use client";

import React, { useEffect, useState, useRef } from "react";
import { Fieldset, Stack, Image, Text, Button, Box } from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useDispatch } from "react-redux";
import { updateFormTwo } from "@/context/onboardingSlice";
import { toaster } from "@/components/ui/toaster";
import Logo from "@/assets/images/Off-Jeay.svg";
import LogoDark from "@/assets/images/Off-Jeay-Dark.svg";
import { useAnimate } from "motion/react";
import { useColorMode } from "@/components/ui/color-mode";
import {
	INITIAL_RESEND_TIMER,
	CORRECT_OTP,
	MAX_RESEND_ATTEMPTS,
	RESEND_TIMER_INCREMENT,
} from "@/pages/onboarding/formConstants";
//import axios from "axios";

interface OnBoardingFormTwoProps {
	legendText: string;
	helperText: string;
	userEmail: string;
	onSuccess?: () => void;
}

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
	const [loading, setLoading] = useState(false);

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

		// Validate OTP length
		if (otp.length === 4) {
			setLoading(true);
			setError(""); // Clear previous errors

			// -------------------------------
			// Simulated Server-Side Validation
			// Uncomment and modify this section when integrating with the backend:
			/*
			try {
				const response = await axios.post('/api/validate-otp', {
					otp,
					email: userEmail,
				});

				if (response.status === 200 && response.data.valid) {
					dispatch(updateFormTwo({ otp }));
					onSuccess?.();
					toaster.create({
						duration: 3000,
						title: "Success",
						description: "Your account has been verified successfully.",
						type: "success",
					});
				} else {
					setError(response.data.message || "Incorrect code. Please try again.");
					setOtp("");
				}
			} catch (error: any) {
				setError(error.response?.data?.message || "Server error. Please try again later.");
				console.error("Submission error:", error);
				const errorMessage = "An error occurred verifying the code. Please try again later.";
				toaster.create({
					duration: 3000,
					title: "Error",
					description: errorMessage,
					type: "error",
				});
			} finally {
				setLoading(false);
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
			setLoading(false);
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
					disabled={otp.length !== 4 || loading}
					aria-disabled={otp.length !== 4 || loading}
					width={{ base: "100%", lg: "75%" }}
					color="onPrimary"
					fontWeight="bold"
					bgColor="primary"
					_hover={{ bgColor: "primary/85" }}
					_disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
					focusRingColor="secondary"
				>
					{loading ? "Verifying..." : "Continue"}
				</Button>
			</Fieldset.Root>
		</form>
	);
};

export default OnBoardingFormTwo;
