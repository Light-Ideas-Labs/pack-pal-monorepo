// modules/models/users/model.ts
import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import crypto from "crypto";
import { emailRegexPattern } from "../../../utils/regax";

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  role: string;
  fullname?: string;
  email: string;
  isVerified: boolean;
  salt?: string;
  passwordHash?: string;
  avatar?: { public_id: string; url: string };
  gender?: string;
  geolocation?: string;
  facebook?: string;
  twitter?: string;
  google?: string;
  instagram?: string;
  tokens?: any[];
  trips?: { tripId: string }[];
  collaborations?: { userId: string; status: string }[];
  bookmarks?: mongoose.Schema.Types.ObjectId;
  subscription?: { status: "active" | "inactive"; plan: string };
}

export interface IUserMethods {
  setPassword(password: string): void;
  encryptPassword(password: string): string;
  authenticate(plainText: string): boolean;
  /** align the name with your implementation */
  billingAddress(): string;
}

// ⬅️ Use HydratedDocument so Mongoose knows about methods on returned docs
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
// ⬅️ Tell the Model about instance methods (third generic on Schema)
export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullname: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: (v: string) => emailRegexPattern.test(v),
        message: "please enter a valid email",
      },
    },
    isVerified: { type: Boolean, default: false },
    salt: String,
    passwordHash: String,
    avatar: { public_id: String, url: String },
    gender: String,
    geolocation: String,
    facebook: String,
    twitter: String,
    google: String,
    instagram: String,
    bookmarks: { type: mongoose.Schema.Types.ObjectId },
    tokens: { type: Array, default: [] },
    trips: [{ tripId: String }],
    role: { type: String, default: "user" },
    subscription: {
      status: { type: String, enum: ["active", "inactive"], default: "inactive" },
      plan: { type: String, default: "free" },
    },
  },
  { timestamps: true }
);

// (optional) virtual setter if you still want it
userSchema
  .virtual("password")
  .set(function (this: IUser, password: string) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.passwordHash = crypto.createHmac("sha1", this.salt).update(password).digest("hex");
  });

userSchema.pre("save", function (next) {
  if (!this.fullname) this.fullname = `${this.firstName || ""} ${this.lastName || ""}`.trim();
  next();
});

// ── instance methods (names match IUserMethods)
userSchema.methods.billingAddress = function (): string {
  return `${this.fullname || ""} ${this.geolocation || ""}`.trim();
};

userSchema.methods.encryptPassword = function (password: string): string {
  if (!password || !this.salt) return "";
  try {
    return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
  } catch {
    return "";
  }
};

userSchema.methods.setPassword = function (password: string): void {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.passwordHash = this.encryptPassword(password);
};

userSchema.methods.authenticate = function (plainText: string): boolean {
  return this.encryptPassword(plainText) === (this.passwordHash || "");
};

userSchema.virtual("id").get(function () {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// ⬅️ Provide Model generic so .find() returns hydrated docs with methods
const User = mongoose.model<IUser, UserModel>("Users", userSchema);
export default User;
