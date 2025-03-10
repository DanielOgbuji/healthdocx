import { useState } from "react";
import { Text, Link, Stack, Spinner, VStack } from "@chakra-ui/react";
import Layout from "./layout";
import {
	StepsCompletedContent,
	StepsContent,
	StepsItem,
	StepsList,
	StepsRoot,
} from "@/components/ui/steps";
import { getOnboardingData } from "@/context/localStorageHelper";
import { Suspense, lazy } from "react";

// Lazy load components using React.lazy
const OnBoardingFormOne = lazy(() => import("../../pages/form-one"));
const OnBoardingFormTwo = lazy(() => import("../../pages/form-two"));
const OnBoardingFormThree = lazy(() => import("../../pages/form-three"));
const VerificationPending = lazy(() => import("@/pages/verification-pending"));
const VerificationError = lazy(() => import("@/pages/verification-error"));
const Welcome = lazy(() => import("../../pages/welcome"));

const OnBoardingSteps = () => {
	const [step, setStep] = useState(0);

	// Retrieve data from Form One; adjust key as needed
	const formOneData = getOnboardingData("formOne");
	const email = formOneData?.email || "your email";

	const handleFormSuccess = () => {
		setStep((prev) => prev + 1);
	};

	return (
		<StepsRoot
			step={step}
			onStepChange={(e) => setStep(e.step)}
			orientation="vertical"
			height="100%"
			width="100%"
			count={4}
			gap="12px"
		>
			<Layout>
				<StepsList minHeight="440px" pointerEvents="none">
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
					<Link href="#" ml="1">
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
						<VStack colorPalette="teal">
							<Spinner color="colorPalette.600" borderWidth="4px" />
							<Text color="colorPalette.600">Loading...</Text>
						</VStack>
					</Stack>
				}
			>
				<Stack justifyContent="center" alignItems="center" flexGrow="1">
					{step === 0 && (
						<StepsContent index={0} width={{ base: "75%", lg: "50%" }}>
							<OnBoardingFormOne
								legendText="Create an account"
								helperText="Fill in your details as it is in your National ID."
								onSuccess={handleFormSuccess}
							/>
						</StepsContent>
					)}

					{step === 1 && (
						<StepsContent index={1} width={{ base: "75%", lg: "50%" }}>
							<OnBoardingFormTwo
								legendText="Verify your email"
								helperText="We sent a code to"
								userEmail={`${email}`}
								onSuccess={handleFormSuccess}
							/>
						</StepsContent>
					)}

					{step === 2 && (
						<StepsContent index={2} width={{ base: "75%", lg: "50%" }}>
							<OnBoardingFormThree
								legendText="Setup institution details"
								helperText="Fill in your institution details correctly."
								onSuccess={handleFormSuccess}
							/>
						</StepsContent>
					)}

					{step === 3 && (
						<StepsContent index={3}>
							<Stack>
								<VerificationPending legendText="Your institution is under review." />
							</Stack>
							<Stack display="none">
								<VerificationError legendText="Review Unsuccessful - Action needed" />
							</Stack>
						</StepsContent>
					)}

					{step === 4 && (
						<StepsCompletedContent width={{ base: "75%", lg: "50%" }}>
							<Welcome
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
