"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Fieldset, Flex, Stack, Text } from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useDispatch } from "react-redux";
import { updateFormTwo } from "@/store/onboardingSlice";
import { toaster } from "@/components/ui/toaster";
import { useAnimate } from "motion/react";
import { AnimatePresence, motion } from "motion/react";

interface VerifyEmailProps {
	onSuccess?: () => void;
}

const CORRECT_OTP = "1234";
const RESEND_TIMER_INCREMENT = 15; // Increment time in seconds
const INITIAL_RESEND_TIMER = 30; // Initial timer in seconds

const VerifyEmail: React.FC<VerifyEmailProps> = ({ onSuccess }) => {
	const dispatch = useDispatch();
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [timer, setTimer] = useState(0);
	const [resendTimer, setResendTimer] = useState(INITIAL_RESEND_TIMER);

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
		let interval: NodeJS.Timeout | null = null;
		if (timer > 0) {
			interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
		} else if (interval) {
			clearInterval(interval);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [timer]);

	const handleChange = (value: string) => {
		setOtp(value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (otp.length === 4) {
			if (otp === CORRECT_OTP) {
				dispatch(updateFormTwo({ otp }));
				console.log("Correct OTP submitted");
				onSuccess?.();
			} else {
				setError("Incorrect code. Please try again.");
				setOtp(""); // Clear all inputs, letting PinInput handle focus reset
			}
		}
	};

	const handleResendCode = () => {
		toaster.create({
			duration: 3000,
			title: "Code has been resent",
			description: "Check your inbox or spam for code",
			type: "success",
		});
		setTimer(resendTimer); // Reset the timer
		setResendTimer((prev) => prev + RESEND_TIMER_INCREMENT); // Increment the resend timer
	};

	const [isVisible, setIsVisible] = useState(true);

	return (
		<form
			onSubmit={handleSubmit}
			style={{ width: "100%", height: "100%", overflow: "hidden" }}
		>
			<Box
				w="100%"
				h="100%"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				py={{ base: "12", lg: "0" }}
				overflow="hidden"
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
								borderColor="outline-variant"
								borderRadius="md"
								overflow="hidden"
							>
								<Stack alignItems="flex-start" role="banner" w="100%">
									<Fieldset.Legend
										role="heading"
										fontWeight="bold"
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
									mt="6"
									onClick={() => {
										if (otp === CORRECT_OTP) {
											setIsVisible(!isVisible);
											setTimeout(() => {
												window.location.href = "/password-reset";
											}, 500);
										}
									}}
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
