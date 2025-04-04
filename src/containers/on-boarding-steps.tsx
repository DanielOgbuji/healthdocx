import { useState, Suspense, lazy, useEffect, useCallback } from "react";
import { Text, Link, Stack, Spinner, VStack } from "@chakra-ui/react";
import Layout from "../components/global/layout";
import {
	StepsCompletedContent,
	StepsContent,
	StepsItem,
	StepsList,
	StepsRoot,
} from "@/components/ui/steps";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store/store";

const lazySteps: { [key: number]: ReturnType<typeof lazy> } = {
	0: lazy(() => import("@/pages/onboarding/form-one")),
	1: lazy(() => import("@/pages/onboarding/form-two")),
	2: lazy(() => import("@/pages/onboarding/form-three")),
	3: lazy(() => import("@/pages/onboarding/verification-pending")),
	4: lazy(() => import("@/pages/onboarding/welcome")),
};

const OnBoardingSteps = () => {
	const [step, setStep] = useState(0);
	const formOneData = useSelector(
		(state: RootState) => state.onboarding.formOne
	);
	const email = formOneData?.email || "your email";

	const handleBeforeUnload = useCallback(
		(e: BeforeUnloadEvent) => {
			if (step < 3) {
				e.preventDefault();
				e.returnValue = ""; // Some older browsers still expect this
			}
		},
		[step]
	);

	useEffect(() => {
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [handleBeforeUnload]);

	const handleFormSuccess = () => {
		setStep((prev) => prev + 1);
	};

	const StepComponent = lazySteps[step] || null;
	if (!StepComponent) return null;

	return (
		<StepsRoot
			step={step}
			onStepChange={(e) => setStep(e.step)}
			orientation="vertical"
			height="100%"
			width="100%"
			count={4}
			gap="12px"
			p="12px"
		>
			<Layout>
				<StepsList minHeight="400px" pointerEvents="none" inert>
					<StepsItem
						index={0}
						icon={<span className="material-symbols-outlined">person</span>}
						title="Your details"
						description="Provide your essential details"
					/>
					<StepsItem
						index={1}
						icon={
							<span className="material-symbols-outlined">mark_email_read</span>
						}
						title="Verify your email"
						description="Enter your verification code"
					/>
					<StepsItem
						index={2}
						icon={<span className="material-symbols-outlined">work</span>}
						title="Your institution details"
						description="Provide your hospital information"
					/>
					<StepsItem
						index={3}
						icon={
							<span className="material-symbols-outlined">
								approval_delegation
							</span>
						}
						title="Institution verification"
						description="Wait for a quick verification"
					/>
					<StepsItem
						index={4}
						icon={<span className="material-symbols-outlined">verified</span>}
						className="finished"
						title="Welcome to Healthdocx!"
						description="Your account is up and running"
					/>
				</StepsList>
				<Text textStyle="sm" textAlign="center">
					Already have an account?{" "}
					<Link href="#" ml="1" color="onSurface">
						Log in
					</Link>
				</Text>
			</Layout>

			<Suspense
				fallback={
					<Stack
						flexGrow="1"
						height="100%"
						alignItems="center"
						justifyContent="center"
					>
						<VStack>
							<Spinner borderWidth="4px" color="primary" />
							<Text color="primary">Loading...</Text>
						</VStack>
					</Stack>
				}
			>
				<Stack
					justifyContent="center"
					alignItems="center"
					flexGrow="1"
					py={{ base: "12", lg: "0" }}
				>
					{step === 0 && (
						<StepsContent index={0} width={{ base: "80%", lg: "50%" }}>
							<StepComponent
								legendText="Create an account"
								helperText="Fill in any required details as they appears on your National ID."
								onSuccess={handleFormSuccess}
							/>
						</StepsContent>
					)}

					{step === 1 && (
						<StepsContent index={1} width={{ base: "80%", lg: "50%" }}>
							<StepComponent
								legendText="Verify your email"
								helperText="We sent a code to"
								userEmail={email}
								onSuccess={handleFormSuccess}
							/>
						</StepsContent>
					)}

					{step === 2 && (
						<StepsContent index={2} width={{ base: "80%", lg: "50%" }}>
							<StepComponent
								legendText="Setup institution details"
								helperText="Fill in your institution details correctly."
								onSuccess={handleFormSuccess}
							/>
						</StepsContent>
					)}

					{step === 3 && (
						<StepsContent index={3}>
							<Stack>
								<StepComponent legendText="Your institution is under review." />
							</Stack>
						</StepsContent>
					)}

					{step === 4 && (
						<StepsCompletedContent width={{ base: "80%", lg: "50%" }}>
							<StepComponent
								legendText="Welcome to Healthdocx!"
								helperText={`Great news! Your institution has been successfully verified.
You're now ready to streamline your medical record management with secure, digital solutions.`}
							/>
						</StepsCompletedContent>
					)}
				</Stack>
			</Suspense>
		</StepsRoot>
	);
};

export default OnBoardingSteps;
