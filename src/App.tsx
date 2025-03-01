import { Box } from "@chakra-ui/react";
import "./App.css";
import OnBoardingSteps from "./components/global/on-boarding-steps";
import ContactForm from "./pages/contact-form";


function App() {
	return (
		<>
			
			<OnBoardingSteps />
				
				<Box display="none"><ContactForm /></Box>

		</>
	);
}

export default App;
