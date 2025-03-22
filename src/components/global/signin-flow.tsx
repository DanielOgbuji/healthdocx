import { Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import AdminSignIn from '../../pages/admin-signin';
import EmailOtp from '../../pages/email-otp';
import ForgotPassword from '../../pages/forgot-password';
import Success from '../../pages/success';
import ResetPassword from '../../pages/reset-password';



const SignInFlow: React.FC = () => {
	const [step, setStep] =useState(1);

	const handleFormSuccess = () => { setStep((prev) => prev + 1);}

  return (
	<Stack justifyContent="center" alignItems="center" flexGrow="1">
		{step === 1 && <AdminSignIn 
		                    legendText="Welcome back!" 
					        helperText="Enter your details to access your workspace" 
					        onSuccess={handleFormSuccess}
						/>
		}

		{step === 2 && <ForgotPassword
		                     legendText="Password Recovery" 
							 helperText="Please enter your account email, and we&apos;ll send  
                                         an OTP to reset your password" 
							 onSuccess={handleFormSuccess}
						 />
		}

		{step === 3 && <EmailOtp 
		                     legendText="Password Recovery" 
							 helperText="Please enter the OTP sent to your email to reset your password" 
							 onSuccess={handleFormSuccess}
							 
						/>
		}

		{step === 4 && <ResetPassword 
		                     legendText="Reset Password" 
							 onSuccess={handleFormSuccess}
						/>
		}

		{step === 5 && <Success 
		                     legendText="Success!" 
							 helperText="You have successfully reset your password and can sign in with your new password." 
						/>
		}
	</Stack>
  )
}

export default SignInFlow
