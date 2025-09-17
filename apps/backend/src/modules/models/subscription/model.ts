import mongoose, { Schema } from 'mongoose';

const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true, index: true },
  plan: { type: String, enum: ['free', 'pro', 'teams'], required: true },
  provider: { type: String, enum: ['google_play', 'stripe', 'manual', 'paypal', 'exion'], required: true },
  productId: { type: String, required: true }, // e.g. packpal_pro_yearly
  purchaseToken: { type: String, required: true, index: true },
  status: { type: String, enum: ['active', 'canceled', 'expired', 'in_grace'], default: 'active' },
  startAt: { type: Date, required: true },
  renewsAt: { type: Date },
  canceledAt: { type: Date },
  raw: Schema.Types.Mixed // store provider response blob
}, { timestamps: true });

SubscriptionSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Subscriptions', SubscriptionSchema);
