import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<ChakraProvider value={defaultSystem}>
		<ThemeProvider attribute="class" disableTransitionOnChange>
			<StrictMode>
				<App />
			</StrictMode>
		</ThemeProvider>
	</ChakraProvider>
);
