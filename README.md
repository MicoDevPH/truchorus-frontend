# Truchorus Performance Company - Frontend

A modern React frontend built with Vite, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool with HMR
- **Tailwind CSS v4** - Utility-first CSS framework
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── style.css       # Global styles with Tailwind
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Linting

Run ESLint:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |

## Tailwind CSS v4

This project uses Tailwind CSS v4 with the Vite plugin. Configuration is done in `vite.config.ts` and `src/style.css`.

Custom theme colors are defined in `src/style.css`:

```css
@theme {
  --color-primary: #aa3bff;
  --color-primary-light: #c084fc;
  --color-primary-bg: rgba(170, 59, 255, 0.1);
  --color-primary-border: rgba(170, 59, 255, 0.5);
}
```

Use them as `bg-primary`, `text-primary-light`, etc.

## License

Private - Truchorus Performance Company