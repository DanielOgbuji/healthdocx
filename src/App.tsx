import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import store from "./context/store/store";
import "./App.css";
import { Suspense, lazy } from "react";
import { Spinner, Stack, Text, VStack } from "@chakra-ui/react";

const OnBoardingSteps = lazy(() => import("@/containers/on-boarding-steps"));
const ForgotPassword = lazy(
	() => import("@/pages/password-recovery/forgot-password")
);
const ContactPage = lazy(() => import("./pages/onboarding/contact-page"));
const VerifyEmail = lazy(
	() => import("@/pages/password-recovery/verify-email")
);
const PasswordResetForm = lazy(
	() => import("@/pages/password-recovery/password-reset")
);
const ResetSuccessful = lazy(
	() => import("@/pages/password-recovery/reset-successful")
);
const SignIn = lazy(() => import("@/pages/sign-in/sign-in"));

function App() {
	return (
		<>
			<Provider store={store}>
				<Toaster />
				<Router>
					<Suspense
						fallback={
							<Stack
								flexGrow="1"
								height="100%"
								alignItems="center"
								justifyContent="center"
							>
								<VStack>
									<Spinner borderWidth="4px" color="primary" />
									<Text color="primary">Loading...</Text>
								</VStack>
							</Stack>
						}
					>
						<Routes>
							<Route path="/forgot-password" element={<ForgotPassword />} />
							<Route path="/password-reset" element={<PasswordResetForm />} />
							<Route path="/reset-successful" element={<ResetSuccessful />} />
							<Route path="/home" element={<OnBoardingSteps />} />
							<Route path="/contact-form" element={<ContactPage />} />
							<Route path="/verify-email" element={<VerifyEmail />} />
							<Route
								path="/"
								element={
									<SignIn
										legendText="Welcome back"
										helperText="Enter your details to access your workspace"
									/>
								}
							/>
						</Routes>
					</Suspense>
				</Router>
			</Provider>
		</>
	);
}

export default App;
