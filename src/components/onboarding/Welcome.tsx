import { useColorMode } from "@/components/ui/color-mode";
import { Button, Container, Box, Image, Stack, Text, Link } from "@chakra-ui/react";
import handshake from "@/assets/images/welcome-light.svg";
import handshakeDark from "@/assets/images/welcome-dark.svg";

const Welcome = () => {
    const { colorMode } = useColorMode(); // Get current color mode
    return (
        <Container
            className="onboarding-form"
            maxW={{ base: "100%", lg: "100%" }}
            textAlign="center"
            centerContent
        >
            <Image
                src={colorMode === "dark" ? handshakeDark : handshake}
                alt="Welcome image"
                mb="30px"
                maxWidth={{ base: "xs", lg: "sm" }}
                objectFit="cover"
                loading="lazy"
            />
            <Stack gap="4" maxW={{ base: "90%", md: "lg", lg: "lg" }}  alignItems="center">
                <Text
                    fontWeight="bold"
                    maxW={{ base: "90%", md: "lg", lg: "lg" }}
                    textAlign="center"
                    fontSize="3xl"
                    flex="1"
                    lineHeight="shorter"
                    color="onSurface"
                >
                    Welcome to <Box as="span" fontStyle="italic" color="primary">Healthdocx!</Box>
                </Text>
                <Box>
                    <Box as="span" fontStyle="italic">Great news!</Box> Your institution has been successfully verified.
                    You're now ready to streamline your medical record management with secure, digital solutions.
                </Box>
            </Stack>
            <Button
                asChild
                variant="solid"
                w={{ base: "xs", lg: "sm" }}
                mt="7"
                bgColor="primary"
                color="onPrimary"
                fontWeight="bold"
                _hover={{ bgColor: "primary/85" }}
                focusRingColor="secondary"
            >
                <Link textDecoration="none" href="#" target="_blank">
                    Go to Workspace
                </Link>
            </Button>
        </Container>
    );
};

export default Welcome;
