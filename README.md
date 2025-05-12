# Boilerplate and Starter for React 18

🚀 Boilerplate and Starter for React with React Router, Tailwind CSS and TypeScript ⚡️ Made with developer experience first: React, TypeScript, ESLint, Prettier, Husky, Lint-Staged, Commitlint, Tailwind CSS, Multi-language (i18n), and more.

## Features

Developer experience first, extremely flexible code structure and only keep what you need:

- ⚡ **[React](https://react.dev)** - Fast by default, with config optimized for performance with React Router support
- 🔥 **[TypeScript](https://www.typescriptlang.org)** - Type checking
- 💎 **[Tailwind CSS](https://tailwindcss.com)** - A utility-first CSS framework for rapid UI development
- 🌐 **[next-intl](https://next-intl-docs.vercel.app/)** - Multi-language (i18n) with
- ⌨️ **[React Hook Form](https://react-hook-form.com/)** - Performant, flexible and extensible forms with easy-to-use validation.
- 🔴 **[Zod](https://zod.dev)** - Validation library
- 📏 **[ESLint](https://eslint.org)** - Linter (default NextJS, NextJS Core Web Vitals, Tailwind CSS and Airbnb configuration)
- 💖 **[Prettier](https://prettier.io)** - Code Formatter
- 🦊 **[Husky](https://www.npmjs.com/package/husky)** - For Git Hooks
- 🚫 **[Lint-staged](https://www.npmjs.com/package/lint-staged)** - For running linters on Git staged files
- 🚓 **[Commitlint](https://commitlint.js.org/)** - Lint git commit
- 💡 Absolute Imports using **`~`** prefix
- 🗂 VSCode configuration: **Settings** and **Extensions**

## Table of Contents

- [Boilerplate and Starter for React 18](#boilerplate-and-starter-for-react-18)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Scripts Overview](#scripts-overview)
  - [Project Structure](#project-structure)
  - [Commit Message Format](#commit-message-format)
  - [TanStack Query](#tanstack-query)
  - [Multi-language](#multi-language)
  - [State Management - Zustand](#state-management---zustand)
  - [VSCode information (optional)](#vscode-information-optional)
  - [License](#license)

## Getting Started

To get started with this boilerplate, follow these steps:

1. Install the dependencies and prepare husky:

```bash
npm run setup
```

2. Run the development server:

```bash
npm run dev
```

3. Open **[http://localhost:5173](http://localhost:5173)** with your browser to see the result.

## Scripts Overview

The following scripts are available in the **`package.json`**:

- `setup`: Install the dependencies and prepare husky
- `set-env:dev`: Setup env for development
- `set-env:stage`: Setup env for stage
- `set-env:prod`: Setup env for production
- `dev`: Starts the development server with colorized output
- `build:dev`: Setup env development and builds the app for production
- `build:stage`: Setup env stage and builds the app for production
- `build:prod`: Setup env production and builds the app for production
- `analyze`: Analyzes the bundle sizes for Client, Server and Edge environments
- `start`: Starts the production server
- `lint`: Lints the code using ESLint
- `check-types`: Automatically fixes formatting issues
- `format`: Automatically fixes linting errors and formatting issues
- `commit`: Write commit with commitlint
- `prepare`: Prepare husky
- `postbuild`: Generate sitemap

## Project Structure

```shell
.
├── .husky                          # Husky configuration
├── .vscode                         # VSCode configuration
├── public                          # Public assets folder
├── src
│   ├── components                  # React components
│   ├── constants                   # Constants folder
│   ├── hooks                       # Custom hook folder
│   ├── libs                        # 3rd party libraries configuration
│   ├── locales                     # Locales folder (i18n messages)
│   ├── modules                     # Page module folder
│   ├── pages                       # Next.js pages (Page Router)
│   ├── queries                     # Query key factory configuration
│   ├── services                    # API configuration
│   ├── stores                      # State management (Zustand)
│   ├── styles                      # Styles folder
│   ├── types                       # Type definitions
│   └── utils                       # Utilities folder
├── .eslintignore                   # Ignore eslint
├── .eslintrc.json                  # Eslint configuration
├── .prettierignore                 # Ignore prettier
├── .prettierrc                     # Prettier configuration
├── commitlint.config.ts            # Commitlint configuration
├── components.json                 # shadcn/ui configuration
├── environment.yml                 # Env configuration
├── lint-staged.config.js           # Lint staged configuration
├── next-sitemap.config.js          # next-sitemap configuration
├── next.config.mjs                 # Next.js configuration
├── package-lock.json
├── package.json
├── postcss.config.js               # PostCSS configuration
├── README.md                       # README file
├── tailwind.config.js              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## Commit Message Format

The project enforces [Conventional Commits](https://www.conventionalcommits.org/) specification. This means that all your commit messages must be formatted according to the specification. To help you write commit messages, the project uses [Commitizen](https://github.com/commitizen/cz-cli), an interactive CLI that guides you through the commit process. To use it, run the following command:

```shell
npm run commit
```

One of the benefits of using Conventional Commits is that it allows us to automatically generate a `CHANGELOG` file. It also allows us to automatically determine the next version number based on the types of commits that are included in a release.

## TanStack Query

...

## Multi-language

...

## State Management - Zustand

- Create a store

```tsx
import create, { State } from 'zustand';

type StoreState = {
  data: any[];
};

type StoreActions = {
  addData: (item: any) => void;
};

const useStore = create<State<StoreState & StoreActions>>((set) => ({
  data: [],
  addData: (item) =>
    set((state) => ({
      data: [...state.data, item]
    }))
}));

export { useStore };
```

## VSCode information (optional)

If you are VSCode users, you can have a better integration with VSCode by installing the suggested extension in `.vscode/extension.json`. The starter code comes up with Settings for a seamless integration with VSCode. The Debug configuration is also provided for frontend and backend debugging experience.

With the plugins installed on your VSCode, ESLint and Prettier can automatically fix the code and show you the errors. Same goes for testing, you can install VSCode Jest extension to automatically run your tests and it also show the code coverage in context.

## License

Copyright © 2024
