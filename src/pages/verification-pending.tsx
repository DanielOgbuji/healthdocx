import {
	Image,
	Blockquote,
	Text,
	Stack,
	List,
	Link,
	Box,
} from "@chakra-ui/react";
import React from "react";
import pendingImage from "@/assets/oc-time-flies.svg";

interface VerificationPendingProps {
	legendText: string;
}

const VerificationPending: React.FC<VerificationPendingProps> = ({
	legendText,
}) => {
	return (
		<Stack gap="6" alignItems="center">
			<Stack gap="10" textAlign="center" alignItems="center">
				<Image src={pendingImage} maxW={{ base: "xs", lg: "sm" }} />
				<Text fontSize={{ base: "2xl", lg: "3xl" }} fontWeight="medium" lineHeight="shorter">
					{legendText}
				</Text>
			</Stack>
			<Stack
				maxW={{ base: "95%", lg: "md" }}
				bgColor="bg.subtle"
				padding="4"
				paddingTop="3"
				borderRadius="2xl"
			>
				<Text fontSize="medium" fontWeight="bold">
					Heads up:
				</Text>
				<Text fontSize="15px">
					We&apos;ve recieved your registration and are currently verifying your
					details. This process ensures compliance and security for all users.
				</Text>
				<List.Root ps="7" fontSize="15px">
					<List.Item>
						Verification typically takes{" "}
						<Box as="span" fontWeight="bold">
							24-48 hours.
						</Box>
					</List.Item>
					<List.Item>
						You&apos;ll receive an email once your account is approved.
					</List.Item>
					<List.Item>
						After approval, you can log into your workspace.
					</List.Item>
				</List.Root>
				<Blockquote.Root bg="bg.muted" p="2" pl="3">
					<Blockquote.Content>
						<Text fontSize="sm">
							<Box as="span" fontStyle="italic">
								Need assistance?
							</Box>{" "}
							<Link variant="underline">Contact Support</Link> -{" "}
							<Box as="span" fontStyle="italic">
								we&apos;re here to help!
							</Box>
						</Text>
					</Blockquote.Content>
				</Blockquote.Root>
			</Stack>
		</Stack>
	);
};

export default VerificationPending;
