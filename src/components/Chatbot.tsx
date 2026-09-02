import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateWithAI } from "@/lib/ai.functions";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM =
  "You are the AI Workplace Productivity Assistant, an in-app helper. Help professionals with emails, meeting notes, planning and research. Be concise (under 120 words unless asked), practical and friendly. Use short markdown-ish bullets when helpful.";

const SUGGESTIONS = [
  "Draft a polite follow-up email",
  "Summarize my meeting notes",
  "Plan my week around one goal",
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi! I'm your workplace assistant. Ask me anything, or pick a starting point below.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history = [...messages, { role: "user" as const, content }];
    setMessages(history);
    setInput("");
    setBusy(true);

    const transcript = history
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const res = await generateWithAI({ data: { system: SYSTEM, prompt: transcript } });
    setMessages([
      ...history,
      {
        role: "assistant",
        content:
          res.text ||
          "I couldn't reach the AI service just now. In the meantime: break the task into three steps, decide the single next action, and use one of the tools in the sidebar to draft it.",
      },
    ]);
    setBusy(false);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110"
        >
          <MessageSquare className="size-4.5" />
          Ask AI
        </button>
      )}

      {open && (
        <div className="fixed inset-x-3 bottom-3 z-50 flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-96">
          <div className="flex items-center gap-2 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <Sparkles className="size-4" />
            <p className="text-sm font-semibold">AI Assistant</p>
            <button onClick={() => setOpen(false)} className="ml-auto" aria-label="Close chat">
              <X className="size-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                    : "mr-auto max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm text-foreground"
                }
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="mr-auto flex items-center gap-2 rounded-2xl bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Thinking…
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your work…"
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
          <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
            AI can make mistakes. Review important output.
          </p>
        </div>
      )}
    </>
  );
}
