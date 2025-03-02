import { Box } from "@chakra-ui/react";
import "./App.css";
import OnBoardingSteps from "./components/global/on-boarding-steps";
import ContactForm from "./pages/contact-form";


function App() {
	return (
		<>
			
			<Box display="none"> <OnBoardingSteps /> </Box>
				
				<ContactForm />

		</>
	);
}

export default App;
