import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import store from "./store/store";
import "./App.css";
import OnBoardingSteps from "@/components/global/on-boarding-steps";
import ContactPage from "./pages/contact-page";

function App() {
	return (
		<>
			<Provider store={store}>
				<Toaster />
				<Router>
					<Routes>
						<Route path="/" element={<OnBoardingSteps />} />
						<Route path="/contact-form" element={<ContactPage />} />
					</Routes>
				</Router>
			</Provider>
		</>
	);
}

export default App;
