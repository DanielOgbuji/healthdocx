import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import OnBoardingSteps from "./components/global/on-boarding-steps";
import ContactForm from "./pages/contact-form";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<OnBoardingSteps />} />
					<Route path="/contact-form" element={<ContactForm />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
