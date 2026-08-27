import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace, Field } from "@/components/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Ask a work question and get a structured research brief with findings, trade-offs and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured research briefs for work questions, editable before you share them.",
      },
    ],
  }),
  component: ResearchPage,
});

const SYSTEM =
  "You are a rigorous research analyst for business professionals. You produce structured briefs: key findings, evidence-based considerations, trade-offs and recommended next steps. You state uncertainty explicitly and never fabricate statistics, citations or sources.";

function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [audience, setAudience] = useState("Leadership team");
  const [depth, setDepth] = useState("Standard");
  const [scope, setScope] = useState("");

  const buildPrompt = () =>
    [
      "Task: Produce a structured research brief.",
      `Question: ${question || "[question]"}`,
      `Audience: ${audience}`,
      `Depth: ${depth}`,
      `Scope / constraints: ${scope || "none provided"}`,
      "",
      "Output format (markdown):",
      "## Research brief: <question>",
      "### Key findings (numbered, one sentence each)",
      "### Considerations & trade-offs",
      "### What we don't know (explicit gaps)",
      "### Recommended next steps",
      "Do not invent sources or figures. Flag anything that must be verified.",
    ].join("\n");

  return (
    <AppShell
      title="AI Research Assistant"
      description="Ask a question, get a structured brief with findings and next steps."
    >
      <ToolWorkspace
        tool="research"
        system={SYSTEM}
        buildPrompt={buildPrompt}
        fields={{ question }}
        canSubmit={question.trim().length > 5}
        outputLabel="Research brief"
        emptyHint="Ask a specific work question to generate a brief you can refine and share."
        inputs={
          <>
            <Field label="Question" hint="required">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="How do mid-sized teams usually roll out AI writing tools without hurting quality?"
                rows={3}
              />
            </Field>
            <Field label="Audience">
              <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
            </Field>
            <Field label="Depth">
              <div className="flex flex-wrap gap-2">
                {["Quick take", "Standard", "Deep dive"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDepth(d)}
                    className={
                      d === depth
                        ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                        : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Scope / constraints" hint="optional">
              <Textarea
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Focus on B2B SaaS companies in the last two years."
                rows={3}
              />
            </Field>
          </>
        }
      />
    </AppShell>
  );
}
