import {
    Image,
    Blockquote,
    Text,
    Stack,
    List,
    Link,
    Box,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import pendingImage from "@/assets/images/animate.svg";
import pendingImageDark from "@/assets/images/animate-dark.svg";

const InstitutionVerificationParams = () => {
    const { colorMode } = useColorMode();
    return (
        <Stack gap="6" alignItems="center">
            <Stack gap="10" textAlign="center" alignItems="center">
                <Image src={colorMode === "dark" ? pendingImageDark : pendingImage} maxW={{ base: "2xs", md: "sm", lg: "sm" }} alt="" />
                <Text maxW={{ base: "90%", md: "lg", lg: "lg" }} fontSize="3xl" fontWeight="medium" lineHeight="shorter" color="onBackground" fontStyle="italic">
                    Your institution is <Box as="span" color="primary" textDecoration="underline" textDecorationColor="primary" textDecorationStyle="dashed" textDecorationThickness="1px" textUnderlineOffset="4px">under review</Box>
                </Text>
            </Stack>
            <Stack
                maxW={{ base: "90%", md: "lg", lg: "lg" }}
                bgColor="bg.subtle"
                padding="4"
                paddingTop="3"
                borderRadius="2xl"
            >
                <Text fontSize="md" fontWeight="bold">
                    Heads up:
                </Text>
                <Text fontSize="sm">
                    We've received your registration and are currently verifying your
                    details. This process ensures compliance and security for all users.
                </Text>
                <List.Root ps="7" py="2" fontSize="sm">
                    <List.Item>
                        Verification typically takes{" "}
                        <Box as="span" fontWeight="bold" color="primary">
                            24-48 hours.
                        </Box>
                    </List.Item>
                    <List.Item>
                        You'll receive an email once your account is approved.
                    </List.Item>
                    <List.Item>
                        After approval, you can log into your workspace.
                    </List.Item>
                </List.Root>
                <Blockquote.Root borderColor="primary" borderLeftWidth="2px" bgColor="primary/5" p="2" pl="3" variant="solid" borderRightRadius="lg">
                    <Blockquote.Content>
                        <Text fontSize="sm">
                            <Box as="span" fontStyle="italic">
                                Need assistance?
                            </Box>{" "}
                            <Link variant="underline" href="/contact-form">Contact Support</Link> -{" "}
                            <Box as="span" fontStyle="italic">
                                we're here to help!
                            </Box>
                        </Text>
                    </Blockquote.Content>
                </Blockquote.Root>
            </Stack>
        </Stack>
    );
}
export default InstitutionVerificationParams;
