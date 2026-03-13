export interface ProviderPhoto {
  url: string;
  isBlurred: boolean;
  order: number;
}

export interface ScheduleSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ProviderAvailability {
  isAvailableNow: boolean;
  schedule: ScheduleSlot[];
}

export interface ProviderAppearance {
  hair: string;
  bodyType: string;
  height: number;
  ethnicity: string;
}

export interface ProviderVerification {
  idVerified: boolean;
  phoneVerified: boolean;
  photosVerified: boolean;
}

export interface ProviderStats {
  responseRate: number;
  avgResponseMin: number;
  reliabilityScore: number;
}

export interface IProvider {
  _id?: string;
  slug: string;
  displayName: string;
  age: number;
  bio: string;
  city: string;
  district: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  appearance: ProviderAppearance;
  languages: string[];
  services: string[];
  pricing: {
    hourly: number;
    currency: string;
  };
  photos: ProviderPhoto[];
  availability: ProviderAvailability;
  verification: ProviderVerification;
  stats: ProviderStats;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  email: string;
  alias: string;
  preferences: Record<string, unknown>;
  savedProviders: string[];
  createdAt?: Date;
  lastActiveAt?: Date;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface IConversation {
  _id?: string;
  userId: string | null;
  sessionId: string;
  messages: ChatMessage[];
  parsedIntent: ParsedIntent;
  matchedProviders: string[];
  createdAt?: Date;
  expiresAt?: Date;
}

export interface ParsedIntent {
  hair?: string;
  bodyType?: string;
  ethnicity?: string;
  minAge?: number;
  maxAge?: number;
  district?: string;
  availability?: "now" | "tonight" | "this_week" | string;
  languages?: string[];
  services?: string[];
  maxPrice?: number;
  minHeight?: number;
  maxHeight?: number;
}

export interface SearchResult {
  providers: IProvider[];
  availableNow: IProvider[];
  availableTonight: IProvider[];
  allMatches: IProvider[];
}

export interface IBooking {
  _id?: string;
  userId: string;
  userAlias: string;
  providerId: string;
  providerSlug: string;
  providerName: string;
  providerPhoto?: string;
  providerDistrict: string;
  referenceNumber: string;
  status: "pending" | "confirmed" | "declined" | "completed" | "cancelled";
  requestedDate: string;
  requestedTime?: string;
  duration: number;
  rate: number;
  totalAmount: number;
  contactDetails?: {
    whatsapp?: string;
    notes?: string;
  };
  messages: { role: "user" | "assistant"; content: string; timestamp: Date }[];
  createdAt?: Date;
  updatedAt?: Date;
}
