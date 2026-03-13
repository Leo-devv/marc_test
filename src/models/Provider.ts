import mongoose, { Schema, Model } from "mongoose";
import { IProvider } from "@/types";

const ProviderSchema = new Schema<IProvider>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    age: { type: Number, required: true },
    bio: { type: String, required: true },
    city: { type: String, required: true, default: "Barcelona", index: true },
    district: { type: String, required: true, index: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    appearance: {
      hair: { type: String, required: true, index: true },
      bodyType: { type: String, required: true, index: true },
      height: { type: Number, required: true },
      ethnicity: { type: String, required: true },
    },
    languages: [{ type: String }],
    services: [{ type: String }],
    pricing: {
      hourly: { type: Number, required: true },
      currency: { type: String, default: "EUR" },
    },
    photos: [
      {
        url: { type: String, required: true },
        isBlurred: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
    availability: {
      isAvailableNow: { type: Boolean, default: false },
      schedule: [
        {
          dayOfWeek: Number,
          startTime: String,
          endTime: String,
        },
      ],
    },
    verification: {
      idVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false },
      photosVerified: { type: Boolean, default: false },
    },
    stats: {
      responseRate: { type: Number, default: 0.9 },
      avgResponseMin: { type: Number, default: 15 },
      reliabilityScore: { type: Number, default: 0.85 },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProviderSchema.index({ location: "2dsphere" });
ProviderSchema.index({ "appearance.hair": 1, "appearance.bodyType": 1, district: 1 });

const Provider: Model<IProvider> =
  mongoose.models.Provider || mongoose.model<IProvider>("Provider", ProviderSchema);

export default Provider;
