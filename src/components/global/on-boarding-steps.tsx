import { Button, Group, Stack, Text, Link } from "@chakra-ui/react";
import Layout from "./layout";
import OnBoardingForm from "../../pages/form-one";
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
	return (
		<StepsRoot
			orientation="vertical"
			height="100%"
			width="100%"
			defaultValue={1}
			count={4}
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
					<Link href="#" color="gray.500" ml="1">
						Log in
					</Link>
				</Text>
			</Layout>

			<Stack justifyContent="center" alignItems="center" flexGrow="1">
				<StepsContent index={0} width={{ base: "75%", lg: "50%" }}>
					<OnBoardingForm
						legendText="Create an account"
						helperText="Fill in your details as it is in your National ID."
					/>
				</StepsContent>
				<StepsContent index={1}>Second Step</StepsContent>
				<StepsContent index={2}>Third Step</StepsContent>
				<StepsContent index={3}>Fourth Step</StepsContent>
				<StepsCompletedContent>
					You have completed all steps!
				</StepsCompletedContent>

				<Group>
					<StepsPrevTrigger asChild>
						<Button variant="outline" size="sm">
							Prev
						</Button>
					</StepsPrevTrigger>
					<StepsNextTrigger asChild>
						<Button variant="outline" size="sm">
							Next
						</Button>
					</StepsNextTrigger>
				</Group>
			</Stack>
		</StepsRoot>
	);
};

export default OnBoardingSteps;
