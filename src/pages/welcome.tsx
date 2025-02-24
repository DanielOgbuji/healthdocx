import { Button, Container, Image, Stack, Text } from '@chakra-ui/react'
import React from 'react'

interface WelcomeProps{
    legendText: string;
    helperText: string;
}

const Welcome: React.FC<WelcomeProps> = ({
    legendText,
    helperText
}) => {
  return (
        <Container 
              className='onboarding-form' 
              maxW={{ base: "90%", sm: "380px" }}  
              textAlign="center" 
              centerContent
              >
            
            <Image
               src = "src/assets/oc-handshake.png"
               alt ="Welcome image"
               mb= "30px"
               maxWidth = "380px"
               objectFit="cover"
               loading ="lazy"
            />
            
           <Stack gap={4} width="100%">
             <Text fontWeight="extrabold" fontSize="2xl" width="100%" flex = "1">
                {legendText}
             </Text>

             <Text>
                {helperText}
             </Text>
            </Stack>
      <Button
          asChild
          variant="solid"
          width ="100%"
          mt = "4"
        >
        <a href='./workspace'>Go to workspace</a>
      </Button>       
    </Container>
  )
}

export default Welcome
