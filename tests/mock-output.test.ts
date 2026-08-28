import { describe, expect, it } from "vitest";
import { mockOutput, type ToolId } from "@/lib/mock-output";

describe("mockOutput", () => {
  const tools: ToolId[] = ["email", "notes", "planner", "research"];

  it("returns non-empty content for every tool, even with no input", () => {
    for (const tool of tools) {
      const out = mockOutput(tool, {});
      expect(out, tool).toBeTruthy();
      expect(out.length, tool).toBeGreaterThan(50);
    }
  });

  it("is deterministic for identical input", () => {
    const fields = { purpose: "quarterly budget review", tone: "Friendly" };
    expect(mockOutput("email", fields)).toBe(mockOutput("email", fields));
  });

  describe("email", () => {
    it("includes a subject, recipient and sender", () => {
      const out = mockOutput("email", {
        purpose: "project kickoff",
        recipient: "Dana",
        sender: "Neo",
      });
      expect(out).toMatch(/^Subject: /);
      expect(out).toContain("Hi Dana,");
      expect(out).toContain("Neo");
      expect(out).toContain("project kickoff");
    });

    it("falls back to placeholders when recipient and sender are missing", () => {
      const out = mockOutput("email", { purpose: "status update" });
      expect(out).toContain("Hi there,");
      expect(out).toContain("Your name");
    });

    it("varies the body by tone", () => {
      const fields = { purpose: "budget approval" };
      const friendly = mockOutput("email", { ...fields, tone: "Friendly" });
      const persuasive = mockOutput("email", { ...fields, tone: "Persuasive" });
      const professional = mockOutput("email", { ...fields, tone: "Professional" });

      expect(friendly).not.toBe(persuasive);
      expect(friendly).not.toBe(professional);
      expect(friendly).toContain("spare moment");
      expect(persuasive).toContain("momentum");
    });

    it("is case-insensitive about tone", () => {
      const a = mockOutput("email", { purpose: "x", tone: "FRIENDLY" });
      const b = mockOutput("email", { purpose: "x", tone: "friendly" });
      expect(a).toBe(b);
    });
  });

  describe("notes", () => {
    it("always produces summary, decisions and action-item sections", () => {
      const out = mockOutput("notes", { notes: "" });
      expect(out).toContain("## Summary");
      expect(out).toContain("## Decisions");
      expect(out).toContain("## Action Items");
      expect(out).toMatch(/- \[ \] Owner:/);
    });

    it("summarises meaningful lines from the pasted notes", () => {
      const out = mockOutput("notes", {
        notes: [
          "short",
          "We agreed to postpone the migration until the audit is complete.",
          "Marketing will prepare the launch assets by next Tuesday.",
        ].join("\n"),
      });
      expect(out).toContain("We agreed to postpone the migration");
      expect(out).toContain("Marketing will prepare the launch assets");
      expect(out).not.toContain("- Short");
    });

    it("caps the summary at five bullets", () => {
      const notes = Array.from(
        { length: 12 },
        (_, i) => `Discussion point number ${i} covered in detail today.`,
      ).join("\n");
      const summary = mockOutput("notes", { notes }).split("## Decisions")[0];
      const bullets = summary.split("\n").filter((l) => l.startsWith("- "));
      expect(bullets).toHaveLength(5);
    });
  });

  describe("planner", () => {
    it("includes prioritised sections and the requested horizon", () => {
      const out = mockOutput("planner", { goal: "launch the beta", horizon: "6 weeks" });
      expect(out).toContain("Horizon: 6 weeks");
      expect(out).toContain("### P1 — Critical path");
      expect(out).toContain("### P2 — Important");
      expect(out).toContain("### P3 — Nice to have");
      expect(out.toLowerCase()).toContain("launch the beta");
    });
  });

  describe("research", () => {
    it("returns a structured brief with a verification disclaimer", () => {
      const out = mockOutput("research", { question: "does AI improve support response times" });
      expect(out).toContain("### Key findings");
      expect(out).toContain("### Considerations");
      expect(out).toContain("### Recommended next steps");
      expect(out).toContain("verify facts");
      expect(out).toContain("Does AI improve support response times");
    });
  });
});
