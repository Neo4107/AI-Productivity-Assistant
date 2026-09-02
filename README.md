# AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate everyday work with AI. It combines a clean dashboard with four dedicated AI tools and a floating assistant chatbot, all built with a professional blue-and-white design system.

## Features

- **Smart Email Generator** — Enter the purpose, tone, recipient, and desired length, then generate an editable, ready-to-send email. The full structured prompt used by the AI is shown for transparency.
- **Meeting Notes Summarizer** — Paste long meeting notes or transcripts and get a concise summary plus action items. The output is fully editable and the prompt is visible.
- **AI Task Planner** — Provide a goal, time horizon, team context, and constraints to receive a prioritized task breakdown that you can edit before sharing.
- **AI Research Assistant** — Ask a research question, define the audience, depth, and scope, and receive a structured summary with sources and takeaways.
- **Floating AI Chatbot** — A persistent AI assistant available on every screen for quick questions, follow-ups, and suggestions.
- **Responsible AI Disclaimer** — Prominently displayed in the footer to remind users to review AI-generated output before sending, publishing, or acting on it.

## Tech Stack

- **Framework:** TanStack Start (React 19 full-stack framework)
- **Build Tool:** Vite 7
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with custom theme tokens
- **UI Components:** shadcn/ui primitives
- **AI:** Lovable AI Gateway (`google/gemini-3.7-flash`) with deterministic fallback/mock output for offline demos

## Local Setup & Run

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended) **or** [Bun](https://bun.sh/) 1.0+
- A package manager: `npm` (comes with Node), `bun`, or `pnpm`

> This project was initialized with **Bun**, so all examples below use `bun`. Replace with `npm run` if you prefer npm.

### 1. Clone the repository

```sh
git clone <your-github-repo-url>
cd <your-project-folder>
```

### 2. Install dependencies

```sh
bun install
# or: npm install
```

### 3. (Optional) Configure the AI gateway

Live AI generation is powered by the Lovable AI Gateway. To use live generation instead of the built-in mock responses, set your Lovable API key in a `.env` file at the project root:

```sh
LOVABLE_API_KEY=your_lovable_api_key_here
```

If the key is missing or the service is unavailable, the app automatically falls back to deterministic sample output so every tool remains demonstrable.

### 4. Start the development server

```sh
bun run dev
# or: npm run dev
```

The dev server will start on `http://localhost:8080`. Open that URL in your browser to use the app.

### 5. Verify everything is working

- The dashboard should load at `http://localhost:8080/`.
- Click any tool in the sidebar (e.g., **Smart Email Generator**) to open it.
- Fill in the inputs and click **Generate** — you should see editable output within a few seconds.
- Try the floating chatbot in the bottom-right corner.

## Production Build & Start

To create an optimized production build and run it locally:

### 1. Build for production

```sh
bun run build
# or: npm run build
```

This compiles the app into a production-ready bundle. The output is written to the `dist/` directory.

### 2. Start the production build

After building, start the production server with:

```sh
bun run preview
# or: npm run preview
```

The preview server will serve the production build, typically on `http://localhost:8080` (or the next available port). Open that URL to verify the app behaves as expected in production mode.

### 3. Verify the production build

- Open the preview URL in your browser.
- Confirm the dashboard and each tool load correctly.
- Generate output from a tool to ensure the AI gateway or fallback mock responses still work.

> **Tip:** For a development-mode build (faster, less optimized), use `bun run build:dev` instead of `bun run build`.

## Available Scripts

The following scripts are defined in `package.json`. They work with any npm-compatible package manager — replace `bun run` with `npm run` or `yarn` as needed.

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `bun run dev` | Start the local development server with hot reload (serves on `http://localhost:8080`). |
| `build` | `bun run build` | Build the app for production. |
| `build:dev` | `bun run build:dev` | Build the app in development mode. |
| `preview` | `bun run preview` | Preview the production build locally after running `build`. |
| `lint` | `bun run lint` | Run ESLint across the project to check for code issues. |
| `format` | `bun run format` | Format all project files with Prettier. |
| `test` | `bun run test` | Run the full Vitest suite once (used in CI). |
| `test:watch` | `bun run test:watch` | Run Vitest in watch mode during development. |
| `test:coverage` | `bun run test:coverage` | Run the Vitest suite with coverage reporting. |

## Project Structure

```
src/
  components/          # Shared UI: AppShell, Chatbot, ToolWorkspace
  lib/                 # AI server function, mock output, utilities
  routes/              # TanStack Start file routes
    index.tsx          # Dashboard
    email.tsx          # Smart Email Generator
    notes.tsx          # Meeting Notes Summarizer
    planner.tsx        # AI Task Planner
    research.tsx       # AI Research Assistant
    __root.tsx         # Root layout
  styles.css           # Tailwind v4 theme tokens
```

## AI Behavior

The app calls the Lovable AI Gateway from a server function (`src/lib/ai.functions.ts`). If the AI service is unavailable or unconfigured, each tool falls back to a deterministic sample response generated in `src/lib/mock-output.ts`, so the interface is always demonstrable.

## Customization

- Theme colors are defined in `src/styles.css` using Tailwind v4 `@theme` tokens. The primary brand color is `#2563EB`.
- The font is Inter, loaded via Google Fonts in `src/routes/__root.tsx`.
- Each tool’s system prompt and input fields can be customized in the corresponding route file.

## Responsible AI

This assistant uses generative AI. Output may be inaccurate, incomplete, or biased and should always be reviewed by a human before it is sent, published, or used for a decision. Do not enter confidential personal data, credentials, or regulated information. You remain accountable for the content you send. AI drafts are suggestions, not professional, legal, or financial advice.

## License

This project is built with Lovable and is intended for the project owner’s use.
