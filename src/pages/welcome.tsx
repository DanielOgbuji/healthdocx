import { Button, Container, Image, Stack, Text, Link } from "@chakra-ui/react";
import React from "react";

interface WelcomeProps {
	legendText: string;
	helperText: string;
}

const Welcome: React.FC<WelcomeProps> = ({ legendText, helperText }) => {
	return (
		<Container
			className="onboarding-form"
			maxW={{ base: "100%", lg: "100%" }}
			textAlign="center"
			centerContent
		>
			<Image
				src="src/assets/oc-handshake.svg"
				alt="Welcome image"
				mb="30px"
				maxWidth={{ base:"xs", lg:"sm" }}
				objectFit="cover"
				loading="lazy"
			/>

			<Stack gap="4" width={{ base:"xs", lg:"md" }}>
				<Text fontWeight="bold" fontSize={{ base:"2xl", lg:"3xl" }} flex="1" lineHeight="shorter">
					{legendText}
				</Text>

				<Text>{helperText}</Text>
			</Stack>
			<Button asChild variant="solid" w={{ base:"xs", lg:"sm" }} mt="6" borderRadius="lg">
				<Link textDecoration="none" color="bg.emphasized">Go to workspace</Link>
			</Button>
		</Container>
	);
}

export default Welcome;
