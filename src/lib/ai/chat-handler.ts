import { openai, MODEL } from "@/lib/openai";
import { SYSTEM_PROMPT, AVAILABILITY_PROMPT } from "./prompts";
import { IProvider } from "@/types";

export async function streamChatResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  matchedProviders: IProvider[] = [],
  isAvailabilityCheck = false,
  targetProvider?: IProvider,
  bookingDetails?: { referenceNumber: string; whatsapp: string }
) {
  const systemMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: isAvailabilityCheck ? AVAILABILITY_PROMPT : SYSTEM_PROMPT },
  ];

  if (!isAvailabilityCheck) {
    if (matchedProviders.length > 0) {
      const names = matchedProviders.slice(0, 5).map((p) => p.displayName).join(", ");
      systemMessages.push({
        role: "system",
        content: `DATABASE RESULTS: ${matchedProviders.length} matching providers found. Names include: ${names}${matchedProviders.length > 5 ? ` and ${matchedProviders.length - 5} more` : ""}. The user can see full profile cards in the UI — just briefly acknowledge the results. Do NOT describe each provider in detail.`,
      });
    } else {
      systemMessages.push({
        role: "system",
        content: `DATABASE RESULTS: 0 providers matched this search. Tell the user no exact matches were found and suggest they broaden their criteria (e.g., try different hair color, remove filters, etc). Do NOT make up any names.`,
      });
    }
  }

  if (isAvailabilityCheck && targetProvider) {
    let content = `Provider details for availability check:\nName: ${targetProvider.displayName}\nDistrict: ${targetProvider.district}\nRate: €${targetProvider.pricing.hourly}/hr\nCurrently available: ${targetProvider.availability.isAvailableNow}\nSchedule: ${JSON.stringify(targetProvider.availability.schedule)}\nResponse rate: ${Math.round(targetProvider.stats.responseRate * 100)}%\nAvg response: ${targetProvider.stats.avgResponseMin} min`;
    if (bookingDetails) {
      content += `\n\nIMPORTANT - Use these EXACT details in your response:\nBooking Reference: ${bookingDetails.referenceNumber}\nWhatsApp: ${bookingDetails.whatsapp}`;
    }
    systemMessages.push({ role: "system", content });
  }

  const stream = await openai.chat.completions.create({
    model: MODEL,
    messages: [...systemMessages, ...messages],
    stream: true,
    temperature: 0.7,
    max_tokens: 200,
  });

  return stream;
}

export function formatProviderForChat(provider: IProvider): string {
  return `${provider.displayName} — ${provider.appearance.hair} hair, ${provider.appearance.bodyType}, age ${provider.age}, based in ${provider.district}. €${provider.pricing.hourly}/hr. ${provider.availability.isAvailableNow ? "✓ Available now" : "By appointment"}.`;
}
