import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Provider from "@/models/Provider";
import { ParsedIntent } from "@/types";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { intent } = (await req.json()) as { intent: ParsedIntent };

    // Build MongoDB query from parsed intent
    const query: Record<string, unknown> = { isActive: true, city: "Barcelona" };

    if (intent.hair) {
      const h = intent.hair.toLowerCase();
      const hairSynonyms: Record<string, string[]> = {
        brunette: ["brunette", "brown"],
        brown: ["brunette", "brown"],
      };
      const terms = hairSynonyms[h] || [h];
      query["appearance.hair"] = { $in: terms.map((t) => new RegExp(t, "i")) };
    }
    if (intent.bodyType) {
      query["appearance.bodyType"] = { $regex: new RegExp(intent.bodyType, "i") };
    }
    if (intent.ethnicity) {
      query["appearance.ethnicity"] = { $regex: new RegExp(intent.ethnicity, "i") };
    }
    if (intent.district) {
      query.district = { $regex: new RegExp(intent.district, "i") };
    }
    if (intent.minAge || intent.maxAge) {
      query.age = {};
      if (intent.minAge) (query.age as Record<string, number>).$gte = intent.minAge;
      if (intent.maxAge) (query.age as Record<string, number>).$lte = intent.maxAge;
    }
    if (intent.maxPrice) {
      query["pricing.hourly"] = { $lte: intent.maxPrice };
    }
    if (intent.languages && intent.languages.length > 0) {
      query.languages = { $in: intent.languages };
    }
    if (intent.services && intent.services.length > 0) {
      query.services = { $in: intent.services };
    }
    if (intent.minHeight || intent.maxHeight) {
      query["appearance.height"] = {};
      if (intent.minHeight) (query["appearance.height"] as Record<string, number>).$gte = intent.minHeight;
      if (intent.maxHeight) (query["appearance.height"] as Record<string, number>).$lte = intent.maxHeight;
    }

    const allMatches = await Provider.find(query).sort({ "stats.reliabilityScore": -1 }).limit(50).lean();

    const availableNow = allMatches.filter((p) => p.availability.isAvailableNow);

    // Simulate "tonight" availability based on schedule
    const today = new Date().getDay();
    const availableTonight = allMatches.filter((p) => {
      if (p.availability.isAvailableNow) return true;
      return p.availability.schedule.some((s) => s.dayOfWeek === today);
    });

    return NextResponse.json({
      providers: allMatches,
      availableNow,
      availableTonight,
      allMatches,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
