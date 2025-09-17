// models/TravelRequirement.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITravelRequirement extends Document {
  to: { code: string; name?: string };          // destination ISO-3166 alpha-2/alpha-3
  from?: { code: string; name?: string };       // departure
  citizenship: string;                          // passport country
  residence?: string;                           // optional
  transit?: string[];                           // airport/country codes for connections

  passport: {
    minValidityMonths?: number;                 // e.g., 6
    blankPages?: number;                        // e.g., 2
    machineReadable?: boolean;
    biometric?: boolean;
  };

  visa: {
    required: boolean;
    type?: 'none' | 'visa_free' | 'evisa' | 'voa' | 'sticker';
    maxStayDays?: number;
    url?: string;                               // eVisa/apply link
    notes?: string;
  };

  entry: {
    onwardTicketRequired?: boolean;
    fundsProofRequired?: boolean;
    accommodationProofRequired?: boolean;
    returnTicketRequired?: boolean;
  };

  health: {
    vaccinations: Array<{
      disease: string;                          // 'Yellow fever', 'Polio', ...
      required: boolean;                        // 'required' vs 'recommended'
      notes?: string;
      source?: string;
    }>;
    insuranceRequired?: boolean;
  };

  customs?: {
    currencyInLimit?: string;                   // e.g., '10,000 USD'
    currencyOutLimit?: string;
    restricted?: string[];
    prohibited?: string[];
  };

  driving?: {
    idp1949?: boolean;
    idp1968?: boolean;
  };

  advisory?: {
    level?: number;                             // normalize to 1..5
    label?: string;                             // e.g., 'Exercise normal caution'
    source?: string;                            // which provider (US, UK, CA...)
    updatedAt?: Date;
  };

  provider: 'timatic' | 'sherpa' | 'gov' | 'mixed';
  sources: Array<{ name: string; url: string; checkedAt: Date }>;

  fetchedAt: Date;                              // when we fetched
  validUntil?: Date;                            // TTL for cache
}

const TravelRequirementSchema = new Schema<ITravelRequirement>(
  {
    to: { code: { type: String, required: true }, name: String },
    from: { code: String, name: String },
    citizenship: { type: String, required: true },
    residence: { type: String },
    transit: { type: [String], default: [] },

    passport: { minValidityMonths: Number, blankPages: Number, machineReadable: Boolean, biometric: Boolean },
    visa: { required: { type: Boolean, required: true }, type: { type: String, enum: ['none', 'visa_free', 'evisa', 'voa', 'sticker'] }, maxStayDays: Number, url: String, notes: String },
    entry: { onwardTicketRequired: Boolean, fundsProofRequired: Boolean, accommodationProofRequired: Boolean, returnTicketRequired: Boolean },

    health: {
      vaccinations: [
        {
          disease: String,
          required: Boolean,
          notes: String,
          source: String,
        },
      ],
      insuranceRequired: Boolean,
    },

    customs: { currencyInLimit: String, currencyOutLimit: String, restricted: [String], prohibited: [String] },
    driving: { idp1949: Boolean, idp1968: Boolean },

    advisory: {level: Number, label: String, source: String, updatedAt: Date},
    provider: { type: String, enum: ['timatic', 'sherpa', 'gov', 'mixed'], required: true },
    sources: [
      {
        name: String,
        url: String,
        checkedAt: Date,
      },
    ],

    fetchedAt: { type: Date, default: Date.now },
    validUntil: Date,
  },
  { timestamps: true }
);

// De-dupe same query key; allow multiple rows across time for history:
TravelRequirementSchema.index(
  { 'to.code': 1, citizenship: 1, residence: 1, 'transit': 1 },
  { name: 'requirement_key' }
);

export default mongoose.model<ITravelRequirement>('TravelRequirements', TravelRequirementSchema);
