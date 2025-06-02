# HDX Frontend

A modern healthcare document management system frontend built with React, TypeScript, and Vite. Features a comprehensive onboarding flow, authentication system, and institutional verification process.

## Key Features

- 🏥 **Healthcare Institution Management** - Complete institution record keeping and data extraction
- 🔐 **Secure Authentication** - Multi-step signup, email verification, and password management
- 🎨 **Modern UI/UX** - Built with Chakra UI and Material Design principles
- 🌓 **Dark/Light Modes** - Full theme support with consistent design language
- 📱 **Responsive Design** - Optimized for desktop
- 🔄 **State Management** - Centralized Redux store with slice architecture
- ✨ **Animations** - Smooth transitions and micro-interactions using Motion


## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Geoapify API key for location services

### Environment Setup
Create a `.env.local` file in the root directory:

```env
VITE_GEOAPIFY_API_KEY=your_api_key_here
```

### Installation

```bash
git clone https://github.com/your-username/hdx_frontend.git
cd hdx_frontend
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Previewing the Production Build

```bash
npm run preview
# or
yarn preview
```

## ESLint Configuration

This project uses ESLint with recommended and type-aware rules for TypeScript and React. For production-grade applications, consider expanding the configuration as follows:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // Or stricter:
    // ...tseslint.configs.strictTypeChecked,
    // Optionally, for stylistic rules:
    // ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also add [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Dependencies

### Core Dependencies
```json
{
  "@chakra-ui/react": "^3.17.0",    // UI component library
  "@emotion/react": "^11.14.0",     // CSS-in-JS library
  "@reduxjs/toolkit": "^2.8.2",     // State management
  "axios": "^1.9.0",                // HTTP client
  "motion": "^12.15.0",             // Animation library
  "next-themes": "^0.4.6",          // Theme management
  "react": "^19.1.0",               // Core React library
  "react-dom": "^19.1.0",           // React DOM bindings
  "react-hook-form": "^7.56.3",     // Form handling
  "react-icons": "^5.5.0",          // Icon library
  "react-redux": "^9.2.0",          // Redux React bindings
  "react-router": "^7.6.1",         // Routing
  "use-mask-input": "^3.4.2"        // Input masking
}
```

### Development Dependencies
```json
{
  "@eslint/js": "^9.25.0",              // ESLint core
  "@types/react": "^19.1.2",            // React type definitions
  "@types/react-dom": "^19.1.2",        // React DOM type definitions
  "@vitejs/plugin-react": "^4.4.1",     // Vite React plugin
  "eslint": "^9.25.0",                  // Linting tool
  "typescript": "~5.8.3",               // TypeScript compiler
  "vite": "^6.3.5",                     // Build tool
  "vite-tsconfig-paths": "^5.1.4"       // Path alias support
}
```

## Project Structure

```
hdx_frontend/
├── .env.local                  # Environment variables
├── .gitignore                  # Git ignore rules
├── .hintrc                     # Hint configuration
├── eslint.config.js           # ESLint configuration
├── index.html                 # Entry HTML file
├── package.json               # Project manifest
├── README.md                  # Project documentation
├── tsconfig.app.json         # TypeScript config for app
├── tsconfig.json             # Base TypeScript config
├── tsconfig.node.json        # TypeScript config for Node
├── vite.config.ts            # Vite configuration
│
├── public/                   # Static assets
│   └── vite.svg             # Vite logo
│
└── src/                      # Source code
    ├── App.css              # Root styles
    ├── App.tsx              # Root component
    ├── index.css            # Global styles
    ├── main.tsx             # Entry point
    ├── vite-env.d.ts        # Vite type declarations
    │
    ├── assets/              # Media assets
    │   └── images/          # Image files
    │
    ├── components/          # Reusable components
    │   ├── forms/          # Form components
    │   │   ├── SignIn.tsx
    │   │   ├── VerifyEmail.tsx
    │   │   └── ...
    │   └── ui/             # UI components
    │       ├── provider.tsx
    │       ├── toaster.tsx
    │       └── ...
    │
    ├── constants/           # Constants and enums
    │   └── formConstants.ts
    │
    ├── containers/          # Container components
    │   └── OnboardingSteps.tsx
    │
    ├── features/           # Feature modules
    │   ├── OnboardingSlice.ts
    │   └── forms/         # Form-related features
    │       ├── FormOneSlice.ts
    │       └── ...
    │
    ├── pages/             # Page components
    │   ├── sign-in.tsx
    │   ├── sign-up.tsx
    │   └── ...
    │
    ├── store/            # Redux store
    │   └── store.ts
    │
    ├── theme/            # Theme configuration
    │   └── theme.ts
    │
    └── utils/            # Utility functions
        └── password-utils.ts
```

## Useful Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [ESLint Documentation](https://eslint.org/)

## License

This project is licensed under the MIT License.
