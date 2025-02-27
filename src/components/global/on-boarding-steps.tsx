import React from "react";
import { Button, Group, Stack, Text, Link } from "@chakra-ui/react";
import Layout from "./layout";
import OnBoardingFormOne from "../../pages/form-one";
import OnBoardingFormTwo from "../../pages/form-two";
import OnBoardingFormThree from "../../pages/form-three";
import VerificationPending from "@/pages/verification-pending";
import Welcome from "../../pages/welcome";
import {
	StepsCompletedContent,
	StepsContent,
	StepsItem,
	StepsList,
	StepsNextTrigger,
	StepsPrevTrigger,
	StepsRoot,
} from "@/components/ui/steps";

const OnBoardingSteps = () => {
	const nextButtonRef = React.useRef<HTMLButtonElement>(null);

	const handleFormSuccess = () => {
		// Trigger a click event on the Next button if available
		if (nextButtonRef.current) {
			nextButtonRef.current.click();
		}
	};
	return (
		<StepsRoot
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
					Already have an account?
					<Link href="#" ml="1">
						Log in
					</Link>
				</Text>
			</Layout>

			<Stack justifyContent="center" alignItems="center" flexGrow="1">
				<StepsContent index={0} width={{ base: "75%", lg: "50%" }}>
					<OnBoardingFormOne
						legendText="Create an account"
						helperText="Fill in your details as it is in your National ID."
						onSuccess={handleFormSuccess} // Pass the callback here
					/>
				</StepsContent>
				<StepsContent index={1} width={{ base: "75%", lg: "50%" }}>
					<OnBoardingFormTwo
						legendText="Verify your email"
						helperText="We sent a code to amarachipeace@email.com"
						onSuccess={handleFormSuccess} // Pass the callback here
					/>
				</StepsContent>
				<StepsContent index={2} width={{ base: "75%", lg: "50%" }}>
					<OnBoardingFormThree
						legendText="Setup institution details"
						helperText="Fill in your institution details correctly."
						onSuccess={handleFormSuccess} // Pass the callback here
					/>
				</StepsContent>
				<StepsContent index={3}>
					<VerificationPending
					legendText="Your institution is under review" />
				</StepsContent>
				<StepsCompletedContent width={{ base: "75%", lg: "50%" }}>
					<Welcome
						legendText="Welcome to Healthdocx!"
						helperText="Great news! Your institution has been successfully verified. 
						 You're now ready to streamline your medical record management with secure, digital solutions."
					/>
				</StepsCompletedContent>

				<Group>
					<StepsPrevTrigger asChild>
						<Button variant="outline" size="sm">
							Prev
						</Button>
					</StepsPrevTrigger>
					<StepsNextTrigger asChild>
						<Button variant="outline" size="sm" ref={nextButtonRef}>
							Next
						</Button>
					</StepsNextTrigger>
				</Group>
			</Stack>
		</StepsRoot>
	);
};

//Remove the display="none" property to hide the next and previous button
export default OnBoardingSteps;
