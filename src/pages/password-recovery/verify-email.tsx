"use client";

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Fieldset, Flex, Stack, Text } from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useDispatch } from "react-redux";
import { updateFormTwo } from "@/context/onboardingSlice";
import { toaster } from "@/components/ui/toaster";
import { useAnimate } from "motion/react";
import { AnimatePresence, motion } from "motion/react";

interface VerifyEmailProps {
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

const VerifyEmail: React.FC<VerifyEmailProps> = ({ onSuccess }) => {
	const navigate = useNavigate(); // Add this hook to navigate after form submission
	const dispatch = useDispatch();
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [timer, setTimer] = useState(0);
	const [resendTimer, setResendTimer] = useState(INITIAL_RESEND_TIMER);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isVisible, setIsVisible] = useState(true);

	// Use a ref for resend count instead of state to avoid unnecessary re-renders
	const resendCountRef = useRef<number>(0);

	// Use useAnimate hook
	const [scope, animate] = useAnimate();

	// Trigger shake animation when error occurs
	useEffect(() => {
		if (error) {
			// Animate the scoped element
			animate(
				scope.current,
				{ x: [0, -6, 6, -6, 6, 0] },
				{ duration: 0.25, repeat: 2 }
			);
		}
	}, [error, animate, scope]);

	// Reset error if any input is added
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
			setIsSubmitting(true);
			// Simulate network delay
			setTimeout(() => {
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
					setIsVisible(!isVisible);
					setTimeout(() => {
                        navigate('/password-reset');  // Use navigate instead
                    }, 500);
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
					setIsVisible(!isVisible);
					setTimeout(() => {
						navigate("/password-reset"); // Use navigate instead
					}, 500);
					onSuccess?.();
				} else {
					setError("Incorrect code. Please try again.");
					setOtp(""); // Clear input for a new try
				}
				setIsSubmitting(false); // Reset loading state
			}, 250); // Simulated network delay
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
		<form
			onSubmit={handleSubmit}
			style={{ width: "100%", height: "100%", overflow: "hidden" }}
			className="password-recovery"
		>
			<Box
				w="100%"
				h="100%"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				py={{ base: "0px", lg: "12" }}
				px="4"
				overflow="hidden"
				css={{
					"& > *": {
						shadow: "0px -42px 200px 0px var(--shadow-color)",
						shadowColor: "primary/20",
						borderRadius: "md",
					},
				}}
			>
				<AnimatePresence initial={true}>
					{isVisible ? (
						<motion.div
							initial={{ y: "100%", opacity: 0 }}
							animate={{ y: "0", opacity: 1 }}
							exit={{ opacity: 0, y: "-100%" }}
							transition={{ duration: 0.5, ease: "easeOut" }}
							style={{ overflow: "hidden" }}
							key="box"
						>
							<Fieldset.Root
								size="lg"
								w={{ base: "100%", lg: "lg" }}
								px={{ base: "4", lg: "8" }}
								pb={{ base: "4", lg: "8" }}
								pt={{ base: "4", lg: "8" }}
								borderStyle="solid"
								borderWidth="thin"
								borderColor="outline/40"
								borderRadius="md"
								bgGradient="to-t"
								gradientFrom="transparent"
								gradientTo="primary/15"
								overflow="hidden"
								backdropFilter={"blur(1.25px)"}
							>
								<Stack alignItems="flex-start" role="banner" w="100%">
									<Fieldset.Legend
										role="heading"
										fontWeight="bold"
										color="onSurface"
										fontSize="2xl"
										display="flex"
										alignItems="center"
										gap="2"
										aria-level={1}
										mb="4px"
									>
										Verify Email
									</Fieldset.Legend>
									<Fieldset.HelperText lineHeight="tall">
										Please enter the OTP sent to your email to reset your
										password.
									</Fieldset.HelperText>
								</Stack>
								<div
									ref={scope}
									style={{
										display: "flex",
									}}
								>
									<Fieldset.Content
										colorPalette="green"
										display="inline-flex"
										flexDirection="row"
										justifyContent="center"
										alignItems="center"
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
													fontSize="lg"
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
										textAlign="center"
									>
										{error}
									</Text>
								)}
								<Flex
									w="full"
									fontSize="sm"
									gap="1"
									alignItems="center"
									justifyContent="center"
								>
									<Text>Didn&apos;t get a code?</Text>
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
								</Flex>

								<Button
									type="submit"
									variant="solid"
									bgColor="primary"
									color="onPrimary"
									fontWeight="bold"
									_hover={{ bgColor: "primary/85" }}
									_disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
									focusRingColor="secondary"
									disabled={otp.length !== 4}
									aria-disabled={otp.length !== 4}
									loading={isSubmitting} // Add loading state
									loadingText="Submitting..." // Optional: Text to display while loading
									mt="6"
								>
									Submit
								</Button>
							</Fieldset.Root>
						</motion.div>
					) : null}
				</AnimatePresence>
			</Box>
		</form>
	);
};

export default VerifyEmail;
