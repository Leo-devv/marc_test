import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Provider from "@/models/Provider";
import { seedProviders } from "@/seed/providers";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const slug = req.nextUrl.searchParams.get("slug");
    if (slug) {
      const provider = await Provider.findOne({ slug, isActive: true }).lean();
      if (!provider) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(provider);
    }

    const providers = await Provider.find({ isActive: true })
      .sort({ "stats.reliabilityScore": -1 })
      .lean();
    return NextResponse.json(providers);
  } catch (error) {
    console.error("Provider fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}

// POST to seed database
export async function POST() {
  try {
    await connectDB();

    // Clear existing and reseed
    await Provider.deleteMany({});
    await Provider.insertMany(seedProviders);

    const count = await Provider.countDocuments();
    return NextResponse.json({ message: `Seeded ${count} providers successfully` });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed providers" }, { status: 500 });
  }
}
