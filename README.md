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

## Getting Started

1. Install dependencies:
   ```sh
   bun install
   # or: npm install
   ```

2. Start the development server:
   ```sh
   bun run dev
   # or: npm run dev
   ```

3. Open `http://localhost:8080` in your browser.

## Available Scripts

| Script | Description |
| --- | --- |
| `bun run dev` | Start the local dev server |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Preview the production build |
| `bun run lint` | Run ESLint |
| `bun run format` | Format files with Prettier |

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
