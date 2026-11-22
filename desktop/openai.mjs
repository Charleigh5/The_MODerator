import {
  buildResponsesPayload,
  consumeResponseEvent,
  normalizeModels,
} from "./lib/siwc-core.mjs";
import { openAiFetch } from "./auth.mjs";

const RESOURCE = "https://api.openai.com/v1";

export async function listModels() {
  const res = await openAiFetch(`${RESOURCE}/models`);
  const text = await res.text();
  if (!res.ok) throw new Error(`Model catalog failed (${res.status}): ${text.slice(0, 300)}`);
  return normalizeModels(JSON.parse(text));
}

export async function runResponse(event, request) {
  const payload = buildResponsesPayload(request);
  const res = await openAiFetch(`${RESOURCE}/responses`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Model request failed (${res.status}): ${text.slice(0, 500)}`);
  }
  if (!res.body) throw new Error("Model response stream missing");
  const decoder = new TextDecoder();
  let buffer = "";
  let acc = { text: "", completed: false, error: null };
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        continue;
      }
      const before = acc.text;
      acc = consumeResponseEvent(acc, parsed);
      if (acc.text.length > before.length && event?.sender && !event.sender.isDestroyed()) {
        event.sender.send("moderator:ai-delta", {
          requestId: request.requestId,
          delta: acc.text.slice(before.length),
        });
      }
      if (acc.error) throw new Error(acc.error);
    }
  }
  if (!acc.completed && !acc.text) throw new Error("Model stream completed without text");
  return {
    requestId: request.requestId,
    text: acc.text,
    model: request.model,
    completed: acc.completed,
  };
}
