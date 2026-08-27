import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, Search, Sparkles, ArrowRight, Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Your AI work dashboard: jump into email drafting, meeting summaries, task planning and research briefs, with every prompt visible and every output editable.",
      },
      { property: "og:title", content: "Dashboard — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One dashboard to draft emails, summarize meetings, plan tasks and research questions with AI.",
      },
      { property: "og:url", content: "https://workgenie-ai.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://workgenie-ai.lovable.app/" }],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a purpose and tone into a send-ready draft, editable line by line.",
    tag: "Saves ~12 min per email",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Paste raw notes and get a summary, decisions and owned action items.",
    tag: "Saves ~20 min per meeting",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    body: "Break a goal into a prioritised plan with effort, schedule and risks.",
    tag: "P1 / P2 / P3 breakdown",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Ask a work question and get a structured brief with next steps.",
    tag: "Findings + gaps + actions",
  },
] as const;

const stats = [
  { label: "Workflows available", value: "4" },
  { label: "Outputs are editable", value: "100%" },
  { label: "Prompts shown", value: "Always" },
  { label: "Setup required", value: "None" },
];

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace for everyday professional tasks."
    >
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" /> AI-powered workspace
          </span>
          <p className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Automate the writing, planning and summarizing parts of your job
          </p>
          <p className="mt-3 max-w-2xl text-sm/6 opacity-90">
            Four focused assistants that draft, condense, plan and research — with the exact
            structured prompt shown every time, so you always know what the AI was asked.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-background/90"
            >
              Draft an email <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/notes"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
            >
              Summarize notes
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-sm font-semibold">Workflows</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {tools.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className="group rounded-xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <t.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{t.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.body}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                  <Clock className="size-3.5" /> {t.tag}
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold">How it works</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              ["1. Describe the task", "Fill in a few short fields — purpose, tone, goal or notes."],
              ["2. See the prompt", "The structured prompt sent to the AI is always displayed."],
              ["3. Edit and use", "Every result is an editable draft you review before using."],
            ].map(([h, b]) => (
              <li key={h} className="rounded-lg bg-muted/60 p-4">
                <p className="text-sm font-medium">{h}</p>
                <p className="mt-1 text-xs text-muted-foreground">{b}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </AppShell>
  );
}
