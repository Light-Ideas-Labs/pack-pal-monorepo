import mongoose, { Schema, Types } from 'mongoose';

const TripDaySchema = new Schema({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trips', required: true, index: true },
  label: { type: String, default: '' },       // human-friendly day label (e.g. "Day 1", or "Nairobi Arrival")
  date: { type: Date, required: true },       // actual calendar date for this day in the trip
  order: { type: Number, required: true },    // 1-based index in the trip
  description: { type: String },
  category: { type: String, enum: ['travel', 'activity', 'meal', 'stay', 'other'], default: 'other' },
  website: { type: String },
  tokenSymbol: { type: String }, // e.g. "USD", "EUR", "KES", "BTC", "ETH", "USDT", "USDC"
  cost: { type: Number },        // in the currency of tokenSymbol, e.g. 19.99
  location: {
    type: { type: String, enum: ['hotel', 'restaurant', 'activity'], default: 'activity' },
    name: { type: String },
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: String
}, { timestamps: true });

TripDaySchema.index({ tripId: 1, order: 1 }, { unique: true });
TripDaySchema.index({ tripId: 1, date: 1 }, { unique: true });

export default mongoose.model('TripDays', TripDaySchema);
