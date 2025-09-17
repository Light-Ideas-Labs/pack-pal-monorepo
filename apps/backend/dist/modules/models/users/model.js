"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const regax_1 = require("../../../utils/regax");
// ─── Schema ──────────────────────────────────────────────────
const userSchema = new mongoose_1.Schema({
    fullname: { type: String }, // Optional override
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value) {
                return regax_1.emailRegexPattern.test(value);
            },
            message: "please enter a valid email",
        },
    },
    isVerified: { type: Boolean, default: false },
    salt: { type: String },
    password: { type: String },
    // profile extras
    avatar: { public_id: String, url: String },
    imgUrl: { type: String },
    gender: { type: String },
    geolocation: { type: String },
    website: { type: String },
    picture: { type: String },
    // Social
    facebook: { type: String },
    twitter: { type: String },
    google: { type: String },
    github: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    steam: { type: String },
    bookmarks: { type: mongoose_1.default.Schema.Types.ObjectId },
    // External tokens (optional)
    tokens: { type: Array, default: [] },
    // App usage
    projects: [{ projectId: String }],
    role: { type: String, default: 'user' },
    subscription: {
        status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
        plan: { type: String, default: 'free' },
    },
}, { timestamps: true });
// ─── Hooks ───────────────────────────────────────────────────
userSchema.pre("save", function (next) {
    if (!this.fullname) {
        this.fullname = `${this.firstName || ""} ${this.lastName || ""}`.trim();
    }
    next();
});
// ─── Methods ─────────────────────────────────────────────────
// billingAddress method
userSchema.methods.billingAddress = function () {
    return `${this.fullname || ""} ${this.geolocation || ""}`.trim();
};
// encryptPassword method
userSchema.methods.encryptPassword = function (password) {
    if (!password || !this.salt)
        return "";
    try {
        return crypto_1.default.createHmac("sha1", this.salt).update(password).digest("hex");
    }
    catch (err) {
        return "";
    }
};
// authenticate method
userSchema.methods.authenticate = function (plainText) {
    return this.encryptPassword(plainText) === this.password;
};
userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });
// ─── Export ──────────────────────────────────────────────────
const userModel = mongoose_1.default.model('Users', userSchema);
exports.default = userModel;
