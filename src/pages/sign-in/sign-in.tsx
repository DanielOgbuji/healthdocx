import { Box, Button, Field, Fieldset, Image, Input, Link, Stack, Text } from '@chakra-ui/react';
import React from 'react'
import Logo from "@/assets/off-Jeay.svg"

interface SignInProps {
    legendText: string;
    helperText: string;
}

const SignIn: React.FC<SignInProps> = ({
    legendText,
    helperText,
}) => {

  return (
      <form className="onboarding-form">
        <Fieldset.Root size="lg" maxW="lg">
            <Stack alignItems="center">
                <Image 
                    src = {Logo}
                    mb="12px"
					width="48px"
					height="48px"
					alt="Company Logo"
					loading="lazy"
                />

                <Fieldset.Legend
                           fontWeight="bold"
                           fontSize="2xl"
                           display="flex"
                           alignItems="center"
                           gap="2"
                           aria-level={1}
                           mb="4px">
                    {legendText}
                </Fieldset.Legend>

                <Fieldset.HelperText>
                    {helperText}
                </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
                <Field.Root>
                    <Field.Label>Email Address or Administrator ID</Field.Label>
                    <Input
                        placeholder="Enter your email or Admin ID"/>
                </Field.Root>

                <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input
                         placeholder="Enter password"/>
                </Field.Root>
            </Fieldset.Content>
            
           <Box textAlign="right">
            <Link href="#" >
              <Text fontSize="14px" cursor="pointer" >Forgot password</Text> 
           </Link>
           </Box>

            <Button type="submit">Access workspace</Button>
        </Fieldset.Root>
      </form>
  )
}

export default SignIn; 
