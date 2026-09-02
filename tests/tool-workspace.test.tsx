import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const generateWithAI = vi.fn();
const toastWarning = vi.fn();
const toastSuccess = vi.fn();

vi.mock("@/lib/ai.functions", () => ({
  generateWithAI: (args: unknown) => generateWithAI(args),
}));

vi.mock("sonner", () => ({
  toast: {
    warning: (...a: unknown[]) => toastWarning(...a),
    success: (...a: unknown[]) => toastSuccess(...a),
    error: vi.fn(),
  },
}));

const { ToolWorkspace } = await import("@/components/ToolWorkspace");

const SYSTEM = "You are an expert business communication assistant.";
const PROMPT = "Task: Write a work email.\nPurpose: project kickoff";

function renderWorkspace(overrides: Partial<Parameters<typeof ToolWorkspace>[0]> = {}) {
  return render(
    <ToolWorkspace
      tool="email"
      system={SYSTEM}
      buildPrompt={() => PROMPT}
      fields={{ purpose: "project kickoff", recipient: "Dana", sender: "Neo" }}
      canSubmit
      inputs={<input aria-label="Purpose" />}
      outputLabel="Generated email"
      emptyHint="Describe the purpose to get started."
      {...overrides}
    />,
  );
}

describe("ToolWorkspace", () => {
  beforeEach(() => {
    generateWithAI.mockReset();
    vi.stubGlobal(
      "navigator",
      { ...navigator, clipboard: { writeText: vi.fn() } },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the structured prompt and an empty state before generating", () => {
    renderWorkspace();
    expect(screen.getByTestId("system-prompt")).toHaveTextContent(SYSTEM);
    expect(screen.getByTestId("user-prompt")).toHaveTextContent(PROMPT);
    expect(screen.getByText("Nothing generated yet")).toBeInTheDocument();
    expect(screen.getByText("Describe the purpose to get started.")).toBeInTheDocument();
  });

  it("can hide and show the structured prompt", async () => {
    const user = userEvent.setup();
    renderWorkspace();
    await user.click(screen.getByRole("button", { name: /structured prompt/i }));
    expect(screen.queryByTestId("user-prompt")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /structured prompt/i }));
    expect(screen.getByTestId("user-prompt")).toBeInTheDocument();
  });

  it("renders AI output in an editable textarea and passes the prompt to the server fn", async () => {
    const user = userEvent.setup();
    generateWithAI.mockResolvedValue({ text: "Subject: Kickoff\n\nHi Dana," });
    renderWorkspace();

    await user.click(screen.getByRole("button", { name: /generate with ai/i }));

    const textarea = await screen.findByDisplayValue(/Subject: Kickoff/);
    expect(generateWithAI).toHaveBeenCalledWith({ data: { system: SYSTEM, prompt: PROMPT } });
    expect(toastWarning).not.toHaveBeenCalled();

    await user.clear(textarea);
    await user.type(textarea, "Edited draft");
    expect(screen.getByDisplayValue("Edited draft")).toBeInTheDocument();
  });

  it("falls back to the deterministic sample draft and warns when AI is unavailable", async () => {
    const user = userEvent.setup();
    generateWithAI.mockResolvedValue({ text: "", error: "AI service unavailable" });
    renderWorkspace();

    await user.click(screen.getByRole("button", { name: /generate with ai/i }));

    const textarea = await screen.findByDisplayValue(/Hi Dana,/);
    expect(textarea).toHaveValue(expect.stringContaining("project kickoff"));
    expect(toastWarning).toHaveBeenCalledWith(
      "Showing a sample draft",
      expect.objectContaining({ description: "AI service unavailable" }),
    );
  });

  it("copies output to the clipboard", async () => {
    const user = userEvent.setup();
    generateWithAI.mockResolvedValue({ text: "Copy me" });
    renderWorkspace();

    const copyButton = screen.getByRole("button", { name: "Copy output" });
    expect(copyButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /generate with ai/i }));
    await screen.findByDisplayValue("Copy me");
    await user.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Copy me");
    expect(toastSuccess).toHaveBeenCalledWith("Copied to clipboard");
  });

  it("regenerates output on demand", async () => {
    const user = userEvent.setup();
    generateWithAI
      .mockResolvedValueOnce({ text: "First draft" })
      .mockResolvedValueOnce({ text: "Second draft" });
    renderWorkspace();

    await user.click(screen.getByRole("button", { name: /generate with ai/i }));
    await screen.findByDisplayValue("First draft");
    await user.click(screen.getByRole("button", { name: "Regenerate output" }));

    await waitFor(() => expect(screen.getByDisplayValue("Second draft")).toBeInTheDocument());
    expect(generateWithAI).toHaveBeenCalledTimes(2);
  });

  it("blocks generation while required inputs are missing", async () => {
    const user = userEvent.setup();
    renderWorkspace({ canSubmit: false });

    const generate = screen.getByRole("button", { name: /generate with ai/i });
    expect(generate).toBeDisabled();
    await user.click(generate);
    expect(generateWithAI).not.toHaveBeenCalled();
  });
});
