// models/Plan.ts
import mongoose, { Schema } from 'mongoose';



const PriceOptionSchema = new Schema({
  interval: { type: String, enum: ['monthly', 'yearly'], required: true },
  amount:   { type: Number, required: true }, // store cents: 399 = $3.99
  currency: { type: String, default: 'USD' }, // usd, eur, gbp, kes, usdt, btc etc.
  subtitle: { type: String }, // e.g. "Billed Monthly"
  badge:    { type: String }  // e.g. "Save 62%"
}, { _id: false });

const PlanSchema = new Schema({
  name: { type: String, enum: ['free', 'pro', 'teams'], required: true, unique: true },
  description: String,
  prices: [PriceOptionSchema],    // free may just be []
  featureMatrixRef: { type: Schema.Types.ObjectId, ref: 'FeatureMatrix' }, // optional if you split features
  limits: {
    trips: Number,
    storageMB: Number,
    mapsPerTrip: Number,
    filesPerTrip: Number,
    packingTemplates: Number
  },
  flags: {
    export: { type: Boolean, default: false },
    backups: { type: Boolean, default: false },
    offline: { type: Boolean, default: false },
    adminAnalytics: { type: Boolean, default: false }
  },
  storefront: { // where/how sold
    androidProductIds: [{ type: String }], // Google Play product IDs
    iosProductIds: [{ type: String }],     // if you add iOS
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Plans', PlanSchema);


