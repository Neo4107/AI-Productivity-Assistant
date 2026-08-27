import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace, Field } from "@/components/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional work emails from a purpose and tone, then edit the draft before sending.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn a purpose and tone into a polished, editable work email.",
      },
    ],
  }),
  component: EmailPage,
});

const SYSTEM =
  "You are an expert business communication assistant. You write clear, concise, well-structured work emails. Always return a subject line, greeting, body and sign-off. Never invent facts the user has not provided; use [brackets] for unknown details.";

const TONES = ["Professional", "Friendly", "Persuasive", "Formal", "Apologetic", "Concise"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [length, setLength] = useState("Medium");
  const [context, setContext] = useState("");

  const buildPrompt = () =>
    [
      "Task: Write a work email.",
      `Purpose: ${purpose || "[purpose]"}`,
      `Recipient: ${recipient || "[recipient]"}`,
      `Sender: ${sender || "[sender name]"}`,
      `Tone: ${tone}`,
      `Length: ${length}`,
      `Additional context: ${context || "none provided"}`,
      "",
      "Output format:",
      "Subject: <subject line>",
      "<greeting>",
      "<body: 1-3 short paragraphs, bullets when listing items>",
      "<clear call to action>",
      "<sign-off with sender name>",
    ].join("\n");

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the purpose, pick a tone, get a send-ready draft."
    >
      <ToolWorkspace
        tool="email"
        system={SYSTEM}
        buildPrompt={buildPrompt}
        fields={{ purpose, tone, recipient, sender }}
        canSubmit={purpose.trim().length > 3}
        outputLabel="Email draft"
        emptyHint="Add the purpose of your email and generate a draft you can edit line by line."
        inputs={
          <>
            <Field label="Purpose" hint="required">
              <Textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Ask the client to approve the revised project timeline"
                rows={3}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Recipient">
                <Input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Sarah, Head of Ops"
                />
              </Field>
              <Field label="Your name">
                <Input
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Neo"
                />
              </Field>
            </div>
            <Field label="Tone">
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={
                      t === tone
                        ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                        : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Length">
              <div className="flex flex-wrap gap-2">
                {LENGTHS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLength(l)}
                    className={
                      l === length
                        ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                        : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                    }
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Extra context" hint="optional">
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Timeline slipped by one week due to a vendor delay. New launch date: 14 October."
                rows={3}
              />
            </Field>
          </>
        }
      />
    </AppShell>
  );
}
