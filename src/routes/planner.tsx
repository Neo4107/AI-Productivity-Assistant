import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace, Field } from "@/components/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn any work goal into a prioritised task breakdown with owners, effort and a suggested schedule.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Break a goal into prioritised, scheduled tasks you can edit.",
      },
    ],
  }),
  component: PlannerPage,
});

const SYSTEM =
  "You are a pragmatic project planner. You decompose goals into concrete, actionable tasks grouped by priority (P1 critical path, P2 important, P3 nice to have), each with an effort estimate. You keep plans realistic for the stated time horizon and flag dependencies.";

function PlannerPage() {
  const [goal, setGoal] = useState("");
  const [horizon, setHorizon] = useState("2 weeks");
  const [constraints, setConstraints] = useState("");
  const [team, setTeam] = useState("");

  const buildPrompt = () =>
    [
      "Task: Build a prioritised task plan.",
      `Goal: ${goal || "[goal]"}`,
      `Time horizon: ${horizon}`,
      `People available: ${team || "just me"}`,
      `Constraints: ${constraints || "none provided"}`,
      "",
      "Output format (markdown):",
      "## Plan: <goal>",
      "### P1 — Critical path (numbered tasks, each with owner + effort)",
      "### P2 — Important",
      "### P3 — Nice to have",
      "### Suggested schedule (day or week ranges)",
      "### Dependencies & risks",
    ].join("\n");

  return (
    <AppShell
      title="AI Task Planner"
      description="Describe a goal, get a prioritised breakdown you can edit."
    >
      <ToolWorkspace
        tool="planner"
        system={SYSTEM}
        buildPrompt={buildPrompt}
        fields={{ goal, horizon }}
        canSubmit={goal.trim().length > 3}
        outputLabel="Task breakdown"
        emptyHint="Describe the outcome you want and generate a plan grouped by priority."
        inputs={
          <>
            <Field label="Goal" hint="required">
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Launch the customer onboarding revamp"
                rows={3}
              />
            </Field>
            <Field label="Time horizon">
              <div className="flex flex-wrap gap-2">
                {["This week", "2 weeks", "1 month", "1 quarter"].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHorizon(h)}
                    className={
                      h === horizon
                        ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                        : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                    }
                  >
                    {h}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="People available" hint="optional">
              <Input
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Me, one designer, one engineer"
              />
            </Field>
            <Field label="Constraints" hint="optional">
              <Textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="No budget for new tools; legal review needed before launch."
                rows={3}
              />
            </Field>
          </>
        }
      />
    </AppShell>
  );
}
