
import mongoose, { Schema } from 'mongoose';

// models/FeatureMatrix.ts (optional, to mirror your FEATURES table)
const FeatureMatrixSchema = new Schema({
  label: { type: String, required: true },
  tiers: {
    free:  { type: String, default: '' },
    pro:   { type: String, default: '' },
    teams: { type: String, default: '' },
  },
  description: { type: String, default: '' }
}, { _id: false });


const FeatureMatrixModel = new Schema({
  items: [FeatureMatrixSchema]
}, { timestamps: true });

export const FeatureMatrix = mongoose.model('FeatureMatrix', FeatureMatrixModel);