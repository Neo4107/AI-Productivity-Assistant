import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace, Field } from "@/components/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste long meeting notes and get a clean summary, decisions and owned action items you can edit.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into a summary with action items and owners.",
      },
    ],
  }),
  component: NotesPage,
});

const SYSTEM =
  "You are a meticulous meeting analyst. You condense raw notes into a summary, explicit decisions, and action items with owners and due dates. Only use information present in the notes; mark unknown owners as [unassigned].";

const SAMPLE = `Standup 09:15. Ops flagged that the vendor integration slipped again - API sandbox is still returning 500s. Priya says engineering can work around it with a stub for now but we need a decision by Wednesday. Marketing asked whether launch comms should be paused; agreed to hold the newsletter until timeline is confirmed. Finance raised that the extra vendor support hours push us 8% over budget for the quarter. Action: Priya to test the stub, Tom to email the vendor escalation contact, Lerato to redo the launch timeline and share with stakeholders. Next check-in moved to Thursday 14:00 because of the client workshop.`;

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [meeting, setMeeting] = useState("");
  const [focus, setFocus] = useState("Balanced");

  const buildPrompt = () =>
    [
      "Task: Summarize the meeting notes below.",
      `Meeting: ${meeting || "[untitled meeting]"}`,
      `Emphasis: ${focus}`,
      "",
      "Output format (markdown):",
      "## Summary — 3-5 bullets",
      "## Decisions — explicit decisions only",
      "## Action Items — '- [ ] Owner: <name> — <task> (due: <date or TBD>)'",
      "## Risks / Follow-ups",
      "",
      "Raw notes:",
      '"""',
      notes || "[paste notes]",
      '"""',
    ].join("\n");

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Paste raw notes, get a summary plus owned action items."
    >
      <ToolWorkspace
        tool="notes"
        system={SYSTEM}
        buildPrompt={buildPrompt}
        fields={{ notes, meeting }}
        canSubmit={notes.trim().length > 30}
        outputLabel="Summary & action items"
        emptyHint="Paste at least a short paragraph of notes, then generate a structured summary."
        inputs={
          <>
            <Field label="Meeting name" hint="optional">
              <Input
                value={meeting}
                onChange={(e) => setMeeting(e.target.value)}
                placeholder="Weekly launch standup"
              />
            </Field>
            <Field label="Raw notes" hint="required">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your notes or transcript here…"
                rows={12}
              />
            </Field>
            <button
              type="button"
              onClick={() => {
                setNotes(SAMPLE);
                setMeeting("Weekly launch standup");
              }}
              className="text-xs font-medium text-primary hover:underline"
            >
              Load sample notes
            </button>
            <Field label="Emphasis">
              <div className="flex flex-wrap gap-2">
                {["Balanced", "Action items", "Decisions", "Risks"].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFocus(f)}
                    className={
                      f === focus
                        ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                        : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Field>
          </>
        }
      />
    </AppShell>
  );
}
