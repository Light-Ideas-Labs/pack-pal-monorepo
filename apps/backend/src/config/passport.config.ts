import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions as JwtStrategyOptions } from "passport-jwt";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";

import { getUserById, getUserByEmail, createUser } from "../modules/services/users.service";
import User, { UserDocument } from "../modules/models/users/model";
import { TOKEN_TYPES } from "../utils/constant";

// ─── Local Strategy ──────────────────────────────────────────────

const localOptions = {
  usernameField: "email",
};

const localStrategy = new LocalStrategy(
  localOptions,
  async (email: string, password: string, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return done(null, false);
      }
      const isMatch = await user.authenticate(password);
      if (!isMatch) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }
);

// ─── JWT Strategy ────────────────────────────────────────────────

const jwtOptions: JwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY as string,
};

interface JwtPayload {
  sub: string;
  type: string;
}

const jwtVerify = async (payload: JwtPayload, done: (error: any, user?: any) => void) => {
  try {
    if (payload.type !== TOKEN_TYPES.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error as Error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

// ─── Google OAuth2 Strategy ─────────────────────────────────────

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_REDIRECT_URL as string,
  scope: ["profile", "email"],
};

const googleStrategyCallback = async (
  accessToken: string,
  refreshToken: string,
  profile: GoogleProfile,
  done: (error: any, user?: any) => void
) => {
  try {
    const email = profile.emails?.[0].value;
    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName;
    const imageUrl = profile.photos?.[0].value;

    console.log(`Google user: ${email}, ${firstName}, ${lastName}, ${imageUrl}`);

    // TODO: You could check DB here and create or update a user.
    
    done(null, profile);
  } catch (error) {
    done(error as Error, false);
  }
};

// ─── Register Strategies ────────────────────────────────────────

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(new GoogleStrategy(googleStrategyOptions, googleStrategyCallback));

passport.serializeUser((user: Express.User, done) => {
  console.log("Serializing user:", user);
  done(null, user);
});

passport.deserializeUser(async (user: Express.User, done) => {
  done(null, user);
});

export { jwtStrategy, passport };
