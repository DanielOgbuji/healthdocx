# React + TypeScript + Vite Template

This template sets up a minimal React application using Vite with TypeScript support, Hot Module Replacement (HMR), and ESLint configuration.

## Available Plugins

Two official plugins are available for Fast Refresh:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) (uses [Babel](https://babeljs.io/))
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) (uses [SWC](https://swc.rs/))

## Expanding the ESLint Configuration

For production applications, we recommend enabling type-aware lint rules:

1. Configure the top-level `parserOptions` property:

    ```js
    export default tseslint.config({
      languageOptions: {
        // other options...
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    })
    ```

2. Replace `tseslint.configs.recommended` with `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`.
3. Optionally add `...tseslint.configs.stylisticTypeChecked`.
4. Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

    ```js
    // eslint.config.js
    import react from 'eslint-plugin-react'

    export default tseslint.config({
      // Set the react version
      settings: { react: { version: '18.3' } },
      plugins: {
        // Add the react plugin
        react,
      },
      rules: {
        // other rules...
        // Enable its recommended rules
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
      },
    })
    ```

## Project Structure

```
.gitignore
.hintrc
eslint.config.js
index.html
package.json
pnpm-lock.yaml
public/
  vite.svg
README.md
src/
  App.css
  App.tsx
  assets/
    react.svg
  index.css
  main.tsx
  vite-env.d.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

## Dependencies

### Main Dependencies

- `react`: ^19.0.0
- `react-dom`: ^19.0.0
- `react-router-dom`: ^7.1.5
- `sass`: ^1.85.0
- `yup`: ^1.6.1

### Dev Dependencies

- `@eslint/js`: ^9.20.0
- `@types/react`: ^19.0.8
- `@types/react-dom`: ^19.0.3
- `@types/react-router-dom`: ^5.3.3
- `@vitejs/plugin-react`: ^4.3.4
- `eslint`: ^9.20.1
- `eslint-config-prettier`: ^10.0.1
- `eslint-plugin-prettier`: ^5.2.3
- `eslint-plugin-react`: ^7.37.4
- `eslint-plugin-react-hooks`: ^5.1.0
- `eslint-plugin-react-refresh`: ^0.4.18
- `globals`: ^15.15.0
- `prettier`: ^3.5.1
- `typescript`: ~5.7.2
- `typescript-eslint`: ^8.24.1
- `vite`: ^6.1.0
- `vite-tsconfig-paths`: ^5.1.4

## Running the Project

To run the project, use the following commands:

```sh
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build the project
pnpm build

# Preview the production build
pnpm preview
```
