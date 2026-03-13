import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const userId = (session.user as Record<string, unknown>).id as string;
  const { status } = await req.json();

  if (!["cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
  }

  const booking = await Booking.findOneAndUpdate(
    { _id: params.id, userId },
    { status },
    { new: true }
  ).lean();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(booking);
}
