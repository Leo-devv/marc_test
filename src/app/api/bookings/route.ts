import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const userId = (session.user as Record<string, unknown>).id as string;

  // Auto-confirm pending bookings older than 12 seconds (simulates provider responding)
  const confirmThreshold = new Date(Date.now() - 12_000);
  await Booking.updateMany(
    { userId, status: "pending", createdAt: { $lt: confirmThreshold } },
    { status: "confirmed" }
  );

  const bookings = await Booking.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const body = await req.json();
  const userId = (session.user as Record<string, unknown>).id as string;
  const userAlias = ((session.user as Record<string, unknown>).alias as string) || session.user.name || "Client";

  const booking = await Booking.create({
    userId,
    userAlias,
    providerId: body.providerId,
    providerSlug: body.providerSlug,
    providerName: body.providerName,
    providerPhoto: body.providerPhoto || null,
    providerDistrict: body.providerDistrict,
    referenceNumber: body.referenceNumber,
    status: "pending",
    requestedDate: body.requestedDate,
    requestedTime: body.requestedTime || null,
    duration: body.duration || 1,
    rate: body.rate,
    totalAmount: body.totalAmount || body.rate * (body.duration || 1),
    contactDetails: body.contactDetails || {},
    messages: body.messages || [],
  });

  return NextResponse.json(booking, { status: 201 });
}
