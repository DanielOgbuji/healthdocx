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

enum OnboardingStep {
  FormOne,
  FormTwo,
  FormThree,
  VerificationPending,
  Welcome,
}

const lazySteps: { [key in OnboardingStep]: ReturnType<typeof lazy> } = {
  [OnboardingStep.FormOne]: lazy(() => import("@/pages/onboarding/form-one")),
  [OnboardingStep.FormTwo]: lazy(() => import("@/pages/onboarding/form-two")),
  [OnboardingStep.FormThree]: lazy(() => import("@/pages/onboarding/form-three")),
  [OnboardingStep.VerificationPending]: lazy(() => import("@/pages/onboarding/verification-pending")),
  [OnboardingStep.Welcome]: lazy(() => import("@/pages/onboarding/welcome")),
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
				const message = "Leaving this page will interrupt your onboarding process. Are you sure you want to leave?";
				e.preventDefault();
				e.returnValue = message;
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

	const StepComponent = lazySteps[step as unknown as OnboardingStep] || null;
	if (!StepComponent) return null;

	return (
		<StepsRoot
			step={step}
			onStepChange={(e) => setStep(e.step)}
			orientation="vertical"
			height="100%"
			width="100%"
			count={Object.keys(lazySteps).length}
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
					<Link href="/" ml="1" color="onSurface">
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
					{
						new Map([
							[
								0,
								(
									<StepsContent key={0} index={0} width={{ base: "80%", lg: "50%" }}>
										<StepComponent
											legendText="Create an account"
											helperText="Fill in any required details as they appears on your National ID."
											onSuccess={handleFormSuccess}
										/>
									</StepsContent>
								),
							],
							[
								1,
								(
									<StepsContent key={1} index={1} width={{ base: "80%", lg: "50%" }}>
										<StepComponent
											legendText="Verify your email"
											helperText="We sent a code to"
											userEmail={email}
											onSuccess={handleFormSuccess}
										/>
									</StepsContent>
								),
							],
							[
								2,
								(
									<StepsContent key={2} index={2} width={{ base: "80%", lg: "50%" }}>
										<StepComponent
											legendText="Setup institution details"
											helperText="Fill in your institution details correctly."
											onSuccess={handleFormSuccess}
										/>
									</StepsContent>
								),
							],
							[
								3,
								(
									<StepsContent key={3} index={3}>
										<Stack>
											<StepComponent legendText="Your institution is under review." />
										</Stack>
									</StepsContent>
								),
							],
							[
								4,
								(
									<StepsCompletedContent key={4} width={{ base: "80%", lg: "50%" }}>
										<StepComponent
											legendText="Welcome to Healthdocx!"
											helperText={`Great news! Your institution has been successfully verified.
You're now ready to streamline your medical record management with secure, digital solutions.`}
										/>
									</StepsCompletedContent>
								),
							],
						]).get(step)
					}
				</Stack>
			</Suspense>
		</StepsRoot>
	);
};

export default OnBoardingSteps;
