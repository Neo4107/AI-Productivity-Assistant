import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Chatbot } from "@/components/Chatbot";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Search },
] as const;

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-card transition-transform lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center gap-2 border-b border-border px-5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">AI Workplace</p>
              <p className="text-xs text-muted-foreground">Productivity Assistant</p>
            </div>
            <button
              className="ml-auto lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="m-3 rounded-xl bg-primary/5 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Human in the loop</p>
            <p className="mt-1">
              Every output is editable. Review before sending or sharing anything externally.
            </p>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex min-h-screen w-full flex-col lg:pl-72">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6">
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold">{title}</h1>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                {description}
              </p>
            </div>
            <span className="ml-auto hidden items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:flex">
              <Sparkles className="size-3.5" /> AI ready
            </span>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>

          <footer className="border-t border-border bg-card px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-2 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Responsible AI disclaimer</p>
              <p>
                This assistant uses generative AI. Output may be inaccurate, incomplete or biased
                and should always be reviewed by a human before it is sent, published or used for a
                decision. Do not enter confidential personal data, credentials or regulated
                information. You remain accountable for the content you send. AI drafts are
                suggestions, not professional, legal or financial advice.
              </p>
              <p>© {new Date().getFullYear()} AI Workplace Productivity Assistant</p>
            </div>
          </footer>
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
