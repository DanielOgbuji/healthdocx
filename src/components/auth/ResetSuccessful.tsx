import { useColorMode } from "@/components/ui/color-mode";
import { Button, Container, Image, Stack, Text, Link } from "@chakra-ui/react";
import handshake from "@/assets/images/successful-light.svg";
import handshakeDark from "@/assets/images/successful-dark.svg";

export default function ResetSuccessful() {
	const { colorMode } = useColorMode(); // Get current color mode
	return (
		<Container
			width={{ base: "100%", lg: "100%" }}
			height="100%"
			textAlign="center"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<Image
				src={colorMode === "dark" ? handshakeDark : handshake}
				alt="Welcome image"
				mb="30px"
				width={{ base: "3xs", lg: "2xs" }}
				maxWidth={{ base: "xs", lg: "sm" }}
				objectFit="cover"
				loading="lazy"
			/>

			<Stack gap="4" width={{ base: "xs", lg: "md" }}>
				<Text
					fontWeight="bold"
					fontStyle="italic"
					fontSize="3xl"
					flex="1"
					lineHeight="shorter"
					color="onSurface"
				>
					Success!
				</Text>

				<Text>
					You have successfully reset your password and can sign in with your
					new password.
				</Text>
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
				_disabled={{ bgColor: "onSurface/12", color: "onSurface/38" }}
				focusRingColor="secondary"
			>
				<Link href="/" textDecoration="none" _hover={{ color: "onPrimary" }}>
					Proceed to Sign In
				</Link>
			</Button>
		</Container>
	);
};
