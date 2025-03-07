import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import OnBoardingSteps from "./components/global/on-boarding-steps";
import ContactPage from "./pages/contact-page";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<OnBoardingSteps />} />
					<Route path="/contact-form" element={<ContactPage />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
