import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import store from "./store/store";
import "./App.css";
import OnBoardingSteps from "@/components/global/on-boarding-steps";
import ForgotPassword from "@/pages/password-recovery/forgot-password";
import ContactPage from "./pages/onboarding/contact-page";
import VerifyEmail from "./pages/password-recovery/verify-email";
import PasswordResetForm from "./pages/password-recovery/password-reset";
import ResetSuccessful from "./pages/password-recovery/reset-successful";

function App() {
	return (
		<>
			<Provider store={store}>
				<Toaster />
				<Router>
					<Routes>
						<Route path="/forgot-password" element={<ForgotPassword />} />
						<Route path="/password-reset" element={<PasswordResetForm />} />
						<Route path="/reset-successful" element={<ResetSuccessful />} />
						<Route path="/" element={<OnBoardingSteps />} />
						<Route path="/contact-form" element={<ContactPage />} />
						<Route path="/verify-email" element={<VerifyEmail />} />
					</Routes>
				</Router>
			</Provider>
		</>
	);
}

export default App;
