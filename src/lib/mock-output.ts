export type ToolId = "email" | "notes" | "planner" | "research";

/**
 * Deterministic local generator used when the AI service is unavailable, so
 * every interaction in the app can still be demonstrated end to end.
 */
export function mockOutput(tool: ToolId, fields: Record<string, string>): string {
  switch (tool) {
    case "email": {
      const purpose = fields["purpose"] || "our upcoming project milestone";
      const tone = (fields["tone"] || "professional").toLowerCase();
      const recipient = fields["recipient"] || "there";
      return [
        `Subject: ${titleCase(purpose)}`,
        "",
        `Hi ${recipient},`,
        "",
        `I hope you're doing well. I'm reaching out regarding ${purpose}.`,
        "",
        tone === "friendly"
          ? "I'd love to hear your thoughts whenever you get a spare moment — no rush at all."
          : tone === "persuasive"
            ? "Moving on this now would let us capture the momentum we've built and avoid a costly delay later."
            : "Below is a short summary of where things stand, along with the decision I'd like to confirm with you.",
        "",
        "• Current status: on track, with two open items awaiting your input.",
        "• What I need: a confirmation (or edits) by end of week.",
        "• Next step: I'll circulate the final version once approved.",
        "",
        "Thanks in advance for taking a look — happy to jump on a quick call if that's easier.",
        "",
        "Best regards,",
        fields["sender"] || "Your name",
      ].join("\n");
    }
    case "notes": {
      const notes = (fields["notes"] || "").trim();
      const lines = notes
        .split(/\n|\.\s/)
        .map((l) => l.trim())
        .filter((l) => l.length > 12)
        .slice(0, 5);
      return [
        "## Summary",
        lines.length
          ? lines.map((l) => `- ${capitalize(l.replace(/[.;]$/, ""))}`).join("\n")
          : "- The team reviewed progress, agreed on priorities and confirmed next steps.",
        "",
        "## Decisions",
        "- Scope for this cycle stays unchanged.",
        "- Weekly check-in moves to Thursday.",
        "",
        "## Action Items",
        "- [ ] Owner: Product — circulate the revised timeline (due: Friday)",
        "- [ ] Owner: Engineering — confirm technical feasibility of the open item (due: Wednesday)",
        "- [ ] Owner: Meeting host — share these notes with stakeholders (due: today)",
        "",
        "## Risks / Follow-ups",
        "- One dependency is still unowned and should be assigned before the next session.",
      ].join("\n");
    }
    case "planner": {
      const goal = fields["goal"] || "Ship the new feature";
      const horizon = fields["horizon"] || "2 weeks";
      return [
        `## Plan: ${titleCase(goal)}`,
        `Horizon: ${horizon}`,
        "",
        "### P1 — Critical path",
        "1. Define the success metric and write it down in one sentence.",
        "2. Break the goal into the three smallest shippable outcomes.",
        "3. Identify the single biggest blocker and schedule time for it first.",
        "",
        "### P2 — Important",
        "4. Line up the people whose input you need and book them early.",
        "5. Draft the first version quickly; optimise only after review.",
        "",
        "### P3 — Nice to have",
        "6. Document the process so the next iteration is faster.",
        "",
        "### Suggested schedule",
        "- Days 1–2: scoping and metric definition",
        "- Days 3–7: build the core outcome",
        "- Days 8–10: review, refine, hand off",
      ].join("\n");
    }
    case "research": {
      const q = fields["question"] || "the topic";
      return [
        `## Research brief: ${capitalize(q)}`,
        "",
        "### Key findings",
        "1. The topic is mature enough that established practices exist, but adoption varies widely by team size.",
        "2. Most reported gains come from process changes rather than tooling alone.",
        "3. Measurable results usually appear within one to two quarters.",
        "",
        "### Considerations",
        "- Cost and change-management effort are the most common blockers.",
        "- Data quality determines the ceiling of any automation.",
        "",
        "### Recommended next steps",
        "- Run a small, time-boxed pilot with one team.",
        "- Define two success metrics before starting.",
        "- Review results and decide to scale or stop.",
        "",
        "_Note: generated overview — verify facts and figures against primary sources._",
      ].join("\n");
    }
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function titleCase(s: string) {
  return s
    .split(" ")
    .map((w) => (w.length > 3 ? capitalize(w) : w))
    .join(" ");
}
