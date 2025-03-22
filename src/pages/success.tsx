import { 
        Box, 
        Button, 
        Image, 
        Link, 
        Stack, 
        Text 
      } from '@chakra-ui/react';
import React from 'react'

interface SuccessProps{
    legendText : string;
    helperText : string;
}

const Success: React.FC<SuccessProps> = ({
    legendText,
    helperText
}) => {
  return (
    <Box>
      <Stack width="360px">
        <Image 
            src="./src/assets/oc-handing-key.svg"
            mb="24px"
            width="300px"
            alt="oc-handshaking image"
            loading="lazy"/>
        <Text
            fontWeight="bold"
            fontSize={{ base: "2xl", lg: "3xl" }}
            flex="1"
            lineHeight="shorter"
        >
            {legendText}
        </Text>
        <Text>{helperText}</Text>
      </Stack>

      <Button
				asChild
				variant="solid"
				w={{ base: "xs", lg: "sm" }}
				mt="7"
				fontWeight="bold"
			>
				<Link href="./admin-signin" textDecoration="none">
					Proceed to log in
				</Link>
			</Button>

    </Box>
  )
}

export default Success;
