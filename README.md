# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Ads Setup

This project includes an AdSense-ready ad slot component. To enable real ads, add these environment variables before building or deploying:

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_HOME=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_HOME_SIDEBAR=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_POPUP=1234567890
NEXT_PUBLIC_ADSENSE_POPUP_DELAY_MS=2500
NEXT_PUBLIC_ADSENSE_POPUP_COOLDOWN_MS=900000
```

The layout loads the AdSense script only when `NEXT_PUBLIC_ADSENSE_CLIENT` is set, and the ad slots render a local placeholder when the values are missing.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# React.js Skills & Standards for AI Coding Agents

## Project Goal
Build scalable, production-ready, maintainable React.js applications using modern best practices, clean architecture, reusable components, and high-quality code standards.

The AI agent should always prioritize:
- Clean code
- Reusability
- Performance
- Scalability
- Developer experience
- Accessibility
- Responsive UI
- Maintainability

---

# Core Stack

## Frontend
- React.js (Latest Stable)
- Vite
- TypeScript (Preferred)
- React Router DOM
- Axios
- React Hook Form
- Zod
- Zustand OR Redux Toolkit
- Tailwind CSS
- Shadcn/UI
- Framer Motion

---

# Coding Rules

## General Rules
- Always use functional components
- Use hooks instead of class components
- Prefer TypeScript over JavaScript
- Avoid inline styles
- Use absolute imports
- Avoid prop drilling
- Keep components small and reusable
- Follow DRY principles
- Never duplicate logic
- Write readable code
- Use meaningful variable names
- Remove unused imports
- Avoid console.logs in production
- Avoid any type unless absolutely necessary

---

# Folder Structure

```txt
src/
│
├── api/
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   └── ui/
│
├── config/
├── constants/
├── contexts/
├── features/
│   └── auth/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── store/
│       ├── types/
│       └── utils/
│
├── hooks/
├── layouts/
├── lib/
├── pages/
├── routes/
├── services/
├── store/
├── styles/
├── types/
├── utils/
└── main.tsx