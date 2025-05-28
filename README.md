# 🛍️ Second-hand Store – React (TypeScript) Migration

🚀 Migration for a second-hand e-commerce platform. Transitioned from a full JavaScript stack (ReactJS + Node.js + MongoDB) to a robust React (TypeScript) + Spring Boot + PostgreSQL architecture for better type-safety, performance, and scalability.

## Frontend Stack

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

## Key features

- 🎨 Modern Frontend Stack: Built with React (TypeScript), Shadcn UI, Tailwind CSS, SCSS, and Framer Motion for a responsive, clean and animated UI.

- 🧑‍💼 Role-Based UI & SEO Support: Supports multiple roles: user, seller, and admin. Routing is structured and dynamic. SEO-friendly pages using Helmet.

- 🔐 Typed API Integration: Well-defined API contracts via TypeScript, with a custom Axios instance that handles refresh tokens and auto-retry for better authentication flow.

- 🛒 Product Variants System: Designed a flexible and extensible product schema to support multiple product attributes and variants, allowing sellers to customize their listings in detail.

- ✅ Form Handling & Validation: Utilizes React Hook Form + Zod for type-safe validation and enhanced UX with realtime error handling.

- 🛡️ Frontend Security Practices: Followed defensive UI design: disabled fields, controlled inputs, no client-side trust, secure localStorage handling.

- 🚀 Performance Optimization: Employed memoization strategies with React.memo, useMemo, useCallback to prevent unnecessary renders and improve speed.

- 🧰 Developer Experience: Setup includes ESLint, Prettier, Husky, Lint-Staged, and Commitlint to maintain consistent and clean codebase.

- 🧪 Custom Hooks & State Management: Extracted reusable hooks and used Zustand for scalable state management.

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
