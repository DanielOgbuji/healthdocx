import {
	Image,
	Blockquote,
	Button,
	Text,
	Stack,
	List,
	Link,
	Box,
} from "@chakra-ui/react";
import React from "react";
import errorImage from "@/assets/images/oc-puzzle.svg";

interface VerificationErrorProps {
	legendText: string;
}

const VerificationError: React.FC<VerificationErrorProps> = ({
	legendText,
}) => {
	return (
		<Stack gap="6" alignItems="center">
			<Stack gap="10" textAlign="center" alignItems="center">
				<Image src={errorImage} maxW={{ base: "xs", lg: "sm" }} alt="" />
				<Text
					fontSize={{ base: "3xl", lg: "3xl" }}
					fontWeight="medium"
					lineHeight="shorter"
					color="onBackground"
				>
					{legendText}
				</Text>
			</Stack>
			<Stack
				maxW={{ base: "95%", lg: "lg" }}
				bgColor="bg.subtle"
				padding="4"
				paddingTop="3"
				borderRadius="2xl"
			>
				<Text fontSize="medium" fontWeight="bold">
					We&apos;re Sorry:
				</Text>
				<Text fontSize="15px">
					But your institution&apos;s verification was not approved at this
					time. This could be due to missing information, incorrect details, or
					document validation issues.
				</Text>
				<List.Root ps="7" fontSize="15px">
					<List.Item>
						Check for{" "}
						<Box as="span" fontWeight="bold" color="fg.error">
							missing details
						</Box>{" "}
						in your application.
					</List.Item>
					<List.Item>
						Correct any issues and provide the necessary documents.
					</List.Item>
					<List.Item>We will review again to validate registration.</List.Item>
				</List.Root>
				<Blockquote.Root bg="bg.muted" p="2" pl="3">
					<Blockquote.Content>
						<Text fontSize="sm">
							<Box as="span" fontStyle="italic">
								Need assistance?
							</Box>{" "}
							<Link variant="underline" href="/contact-form">
								Contact Support
							</Link>{" "}
							-{" "}
							<Box as="span" fontStyle="italic">
								we&apos;re here to help!
							</Box>
						</Text>
					</Blockquote.Content>
				</Blockquote.Root>
			</Stack>
			<Link href="/" textDecoration="none" width={{ base: "95%", lg: "100%" }}>
				<Button type="submit"
					variant="solid"
					//width={{ base: "100%", lg: "75%" }}
					color="onPrimary"
					fontWeight="bold"
					bgColor="primary"
					_hover={{ bgColor: "primary/85" }}
					_disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
					focusRingColor="secondary" width="100%">
					Update and resubmit
				</Button>
			</Link>
		</Stack>
	);
};

export default VerificationError;
