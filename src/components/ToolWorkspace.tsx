import { useState, type ReactNode } from "react";
import { Sparkles, Loader2, Copy, RotateCcw, Check, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateWithAI } from "@/lib/ai.functions";
import { mockOutput, type ToolId } from "@/lib/mock-output";
import { toast } from "sonner";

export function ToolWorkspace({
  tool,
  system,
  buildPrompt,
  fields,
  canSubmit,
  inputs,
  outputLabel,
  emptyHint,
}: {
  tool: ToolId;
  system: string;
  buildPrompt: () => string;
  fields: Record<string, string>;
  canSubmit: boolean;
  inputs: ReactNode;
  outputLabel: string;
  emptyHint: string;
}) {
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const prompt = buildPrompt();

  async function run() {
    if (!canSubmit || busy) return;
    setBusy(true);
    const res = await generateWithAI({ data: { system, prompt } });
    if (res.text) {
      setOutput(res.text);
    } else {
      setOutput(mockOutput(tool, fields));
      toast.warning("Showing a sample draft", {
        description: res.error ?? "The AI service was unavailable.",
      });
    }
    setBusy(false);
  }

  function copy() {
    navigator.clipboard?.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Inputs</h2>
          <div className="mt-4 space-y-4">{inputs}</div>
          <Button className="mt-5 w-full" onClick={run} disabled={!canSubmit || busy}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate with AI
              </>
            )}
          </Button>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm">
          <button
            onClick={() => setShowPrompt((s) => !s)}
            className="flex w-full items-center gap-2 px-5 py-4 text-sm font-semibold"
          >
            <Code2 className="size-4 text-primary" />
            Structured prompt
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {showPrompt ? "Hide" : "Show"}
            </span>
          </button>
          {showPrompt && (
            <div className="space-y-3 border-t border-border p-5 pt-4">
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">System role</p>
                <pre data-testid="system-prompt" className="whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">
                  {system}
                </pre>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">User prompt</p>
                <pre data-testid="user-prompt" className="whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">
                  {prompt}
                </pre>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="flex min-h-[420px] flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{outputLabel}</h2>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            Editable
          </span>
          <div className="ml-auto flex gap-1">
            <Button variant="ghost" size="sm" onClick={copy} disabled={!output} aria-label="Copy output">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={run}
              disabled={!canSubmit || busy}
              aria-label="Regenerate output"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>

        {output ? (
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="mt-4 min-h-[380px] flex-1 resize-none rounded-lg border border-input bg-background p-4 font-mono text-sm leading-relaxed outline-none focus:border-primary"
          />
        ) : (
          <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
            <Sparkles className="size-6 text-primary" />
            <p className="mt-3 text-sm font-medium">Nothing generated yet</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">{emptyHint}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {hint && <span className="ml-1 text-xs text-muted-foreground">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
