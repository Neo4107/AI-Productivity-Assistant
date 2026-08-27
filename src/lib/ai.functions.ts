import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

export const generateWithAI = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { text: "", error: "AI is not configured on this workspace." };

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
        },
        body: JSON.stringify({
          model: "google/gemini-3.7-flash",
          messages: [
            { role: "system", content: data.system },
            { role: "user", content: data.prompt },
          ],
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        let message = body;
        try {
          message = JSON.parse(body)?.error?.message ?? body;
        } catch {
          /* keep raw body */
        }
        if (res.status === 429) message = "Rate limited — please try again in a moment.";
        if (res.status === 402)
          message = "AI credits are exhausted. Add credits in Lovable to continue.";
        return { text: "", error: message?.slice(0, 300) || `Request failed (${res.status})` };
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      return { text: json.choices?.[0]?.message?.content ?? "", error: null as string | null };
    } catch (e) {
      return { text: "", error: e instanceof Error ? e.message : "Unexpected AI error" };
    }
  });
