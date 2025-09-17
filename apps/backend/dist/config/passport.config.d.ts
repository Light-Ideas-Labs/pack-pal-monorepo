import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
declare const jwtStrategy: JwtStrategy;
export { jwtStrategy, passport };
