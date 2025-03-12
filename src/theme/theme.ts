import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
	theme: {
		tokens: {
			colors: {
				white: { value: "#FFFFFF" },
        black: { value: "#000000" },
				primary: {
					10: { value: "#00210B" },
					20: { value: "#003918" },
					30: { value: "#005225" },
					40: { value: "#006D34" },
					50: { value: "#008943" },
					60: { value: "#25A557" },
					70: { value: "#48C16F" },
					80: { value: "#66DE88" },
					90: { value: "#ADF3B9" },
					95: { value: "#C4FFCC" },
					99: { value: "#F5FFF2" },
				},
			},
			fonts: {
				body: { value: "Inter, system-ui, sans-serif" },
			},
		},
    semanticTokens: {
      colors: {
        primary: {
          value: { base: "{colors.primary.40}", _dark: "{colors.primary.80}" },
        },
        onPrimary: {
          value: { base: "{colors.white}", _dark: "{colors.primary.20}" }
        },
        primaryContainer: {
          value: { base: "{colors.primary.90}", _dark: "{colors.primary.30}" }
        },
        onPrimaryContainer: {
          value: { base: "{colors.primary.10}", _dark: "{colors.primary.90}" }
        }
      }
    },
	},
});

export const system = createSystem(defaultConfig, config);
