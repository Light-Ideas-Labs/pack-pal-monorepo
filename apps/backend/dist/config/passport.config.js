"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = exports.jwtStrategy = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const model_1 = __importDefault(require("../modules/models/users/model"));
const constant_1 = require("../utils/constant");
// ─── Local Strategy ──────────────────────────────────────────────
const localOptions = {
    usernameField: "email",
};
const localStrategy = new passport_local_1.Strategy(localOptions, async (email, password, done) => {
    try {
        const user = await model_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            return done(null, false);
        }
        const isMatch = await user.authenticate(password);
        if (!isMatch) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
});
// ─── JWT Strategy ────────────────────────────────────────────────
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
};
const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== constant_1.TOKEN_TYPES.ACCESS) {
            throw new Error("Invalid token type");
        }
        const user = await model_1.default.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
};
const jwtStrategy = new passport_jwt_1.Strategy(jwtOptions, jwtVerify);
exports.jwtStrategy = jwtStrategy;
// ─── Google OAuth2 Strategy ─────────────────────────────────────
const googleStrategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL,
    scope: ["profile", "email"],
};
const googleStrategyCallback = async (accessToken, refreshToken, profile, done) => {
    var _a, _b, _c, _d;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        const firstName = (_b = profile.name) === null || _b === void 0 ? void 0 : _b.givenName;
        const lastName = (_c = profile.name) === null || _c === void 0 ? void 0 : _c.familyName;
        const imageUrl = (_d = profile.photos) === null || _d === void 0 ? void 0 : _d[0].value;
        console.log(`Google user: ${email}, ${firstName}, ${lastName}, ${imageUrl}`);
        // TODO: You could check DB here and create or update a user.
        done(null, profile);
    }
    catch (error) {
        done(error, false);
    }
};
// ─── Register Strategies ────────────────────────────────────────
passport_1.default.use(localStrategy);
passport_1.default.use(jwtStrategy);
passport_1.default.use(new passport_google_oauth20_1.Strategy(googleStrategyOptions, googleStrategyCallback));
passport_1.default.serializeUser((user, done) => {
    console.log("Serializing user:", user);
    done(null, user);
});
passport_1.default.deserializeUser(async (user, done) => {
    done(null, user);
});
