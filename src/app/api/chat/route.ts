import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Provider from "@/models/Provider";
import { parseIntent } from "@/lib/ai/intent-parser";
import { streamChatResponse } from "@/lib/ai/chat-handler";
import { ParsedIntent, IProvider } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      messages,
      parsedIntent: existingIntent = {},
      availabilityCheck,
      providerSlug,
    } = await req.json();

    const lastUserMessage = messages.filter((m: { role: string }) => m.role === "user").pop();
    if (!lastUserMessage) {
      return new Response("No user message found", { status: 400 });
    }

    // Handle availability check for a specific provider
    if (availabilityCheck && providerSlug) {
      const provider = await Provider.findOne({ slug: providerSlug }).lean() as IProvider | null;
      if (!provider) {
        return new Response("Provider not found", { status: 404 });
      }

      // Generate booking details server-side
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let refCode = "";
      for (let i = 0; i < 4; i++) refCode += chars[Math.floor(Math.random() * chars.length)];
      const referenceNumber = `BK-${refCode}`;
      const whatsapp = `+34 6${Math.floor(10 + Math.random() * 90)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;

      const bookingMeta = {
        referenceNumber,
        whatsapp,
        providerId: provider._id?.toString() || "",
        providerSlug: provider.slug,
        providerName: provider.displayName,
        providerPhoto: provider.photos[0]?.url || "",
        providerDistrict: provider.district,
        rate: provider.pricing.hourly,
      };

      const stream = await streamChatResponse(messages, [], true, provider, { referenceNumber, whatsapp });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            // Send booking metadata first
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ bookingMeta })}\n\n`)
            );

            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content;
              if (text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                );
              }
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Parse intent from user message
    const updatedIntent: ParsedIntent = await parseIntent(
      lastUserMessage.content,
      existingIntent
    );

    // Build query and find providers
    const query: Record<string, unknown> = { isActive: true, city: "Barcelona" };
    if (updatedIntent.hair) {
      const h = updatedIntent.hair.toLowerCase();
      const hairSynonyms: Record<string, string[]> = { brunette: ["brunette", "brown"], brown: ["brunette", "brown"] };
      const terms = hairSynonyms[h] || [h];
      query["appearance.hair"] = { $in: terms.map((t) => new RegExp(t, "i")) };
    }
    if (updatedIntent.bodyType) query["appearance.bodyType"] = { $regex: new RegExp(updatedIntent.bodyType, "i") };
    if (updatedIntent.ethnicity) query["appearance.ethnicity"] = { $regex: new RegExp(updatedIntent.ethnicity, "i") };
    if (updatedIntent.district) query.district = { $regex: new RegExp(updatedIntent.district, "i") };
    if (updatedIntent.minAge || updatedIntent.maxAge) {
      query.age = {};
      if (updatedIntent.minAge) (query.age as Record<string, number>).$gte = updatedIntent.minAge;
      if (updatedIntent.maxAge) (query.age as Record<string, number>).$lte = updatedIntent.maxAge;
    }
    if (updatedIntent.maxPrice) query["pricing.hourly"] = { $lte: updatedIntent.maxPrice };
    if (updatedIntent.languages?.length) query.languages = { $in: updatedIntent.languages };
    if (updatedIntent.services?.length) query.services = { $in: updatedIntent.services };
    if (updatedIntent.minHeight || updatedIntent.maxHeight) {
      query["appearance.height"] = {};
      if (updatedIntent.minHeight) (query["appearance.height"] as Record<string, number>).$gte = updatedIntent.minHeight;
      if (updatedIntent.maxHeight) (query["appearance.height"] as Record<string, number>).$lte = updatedIntent.maxHeight;
    }

    const matchedProviders = await Provider.find(query)
      .sort({ "stats.reliabilityScore": -1 })
      .limit(20)
      .lean() as IProvider[];

    // Stream AI response
    const stream = await streamChatResponse(messages, matchedProviders);

    const today = new Date().getDay();
    const availableNow = matchedProviders.filter((p) => p.availability.isAvailableNow);
    const availableTonight = matchedProviders.filter(
      (p) =>
        p.availability.isAvailableNow ||
        p.availability.schedule.some((s) => s.dayOfWeek === today)
    );

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                meta: true,
                parsedIntent: updatedIntent,
                providerCount: matchedProviders.length,
                availableNowCount: availableNow.length,
                availableTonightCount: availableTonight.length,
              })}\n\n`
            )
          );

          // Send provider data
          const providerData = {
            allMatches: matchedProviders.map(sanitizeProvider),
            availableNow: availableNow.map(sanitizeProvider),
            availableTonight: availableTonight.map(sanitizeProvider),
          };
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ providers: providerData })}\n\n`
            )
          );

          // Stream AI text
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Chat failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function sanitizeProvider(p: IProvider) {
  return {
    _id: p._id,
    slug: p.slug,
    displayName: p.displayName,
    age: p.age,
    bio: p.bio,
    district: p.district,
    appearance: p.appearance,
    languages: p.languages,
    services: p.services,
    pricing: p.pricing,
    photos: p.photos,
    availability: p.availability,
    verification: p.verification,
    stats: p.stats,
  };
}
