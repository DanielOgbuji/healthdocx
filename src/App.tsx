import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import "./App.css";
import OnBoardingSteps from "@/components/global/on-boarding-steps";
import ContactPage from "./pages/contact-page";

function App() {
	return (
		<>
			<Provider store={store}>
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
