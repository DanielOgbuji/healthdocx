# HealthDocx Frontend

HealthDocx is a modern web application designed to streamline and enhance document management in the healthcare industry. This repository contains the frontend codebase, built with React, TypeScript, and Vite for a fast and efficient development experience.

## Features

- **React + TypeScript**: Strongly typed components for better maintainability.
- **Vite**: Lightning-fast development server with Hot Module Replacement (HMR).
- **SASS Support**: Write styles with SASS for better modularity and maintainability.
- **Routing**: Built-in routing with `react-router-dom`.
- **Form Validation**: Integrated with `yup` for schema-based form validation.

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
    animate-dark.svg
    animate.svg
    instagram.svg
    jeay-backdrop-dark.svg
    jeay-backdrop.svg
    linkedin.svg
    oc-puzzle.svg
    Off-Jeay-Dark.svg
    Off-Jeay.svg
    successful-dark.svg
    successful-light.svg
  index.css
  main.tsx
  vite-env.d.ts
  components/
    global/
    ui/
  pages/
  store/
  theme/
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

To get started with the project, follow these steps:

```sh
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build the project for production
pnpm build

# Preview the production build
pnpm preview
```

## Expanding the ESLint Configuration

For production applications, we recommend enabling type-aware lint rules:

1. Configure the top-level `parserOptions` property:

    ```js
    export default tseslint.config({
      languageOptions: {
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
      settings: { react: { version: '18.3' } },
      plugins: { react },
      rules: {
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
      },
    })
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to the project by submitting issues or pull requests. For any questions, contact the maintainers.
