import mongoose, { Schema } from "mongoose";
import { TOKEN_TYPES } from "../../../utils/constant";

const tokenSchema = new Schema({
  token: { type: String, required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true, index: true },
  type: { type: String, enum: Object.values(TOKEN_TYPES), required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL
  blacklisted: { type: Boolean, default: false },
  schemaVersion: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model("Tokens", tokenSchema);
