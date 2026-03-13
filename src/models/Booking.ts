import mongoose, { Schema, Model } from "mongoose";
import { IBooking } from "@/types";

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: true, index: true },
    userAlias: { type: String, required: true },
    providerId: { type: String, required: true },
    providerSlug: { type: String, required: true },
    providerName: { type: String, required: true },
    providerPhoto: { type: String },
    providerDistrict: { type: String, required: true },
    referenceNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "completed", "cancelled"],
      default: "pending",
    },
    requestedDate: { type: String, required: true },
    requestedTime: { type: String },
    duration: { type: Number, default: 1 },
    rate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    contactDetails: {
      whatsapp: String,
      notes: String,
    },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"] },
        content: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
