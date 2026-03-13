import { openai, MODEL } from "@/lib/openai";
import { INTENT_PARSE_PROMPT } from "./prompts";
import { ParsedIntent } from "@/types";

export async function parseIntent(
  userMessage: string,
  existingIntent: ParsedIntent = {}
): Promise<ParsedIntent> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: INTENT_PARSE_PROMPT },
      {
        role: "user",
        content: `Current filters: ${JSON.stringify(existingIntent)}\n\nNew user message: "${userMessage}"\n\nReturn updated JSON filters (merge new info with existing, remove fields if the user explicitly says to remove them):`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return existingIntent;

  try {
    const parsed = JSON.parse(content) as ParsedIntent;
    return { ...existingIntent, ...parsed };
  } catch {
    return existingIntent;
  }
}
