import express, { Router } from "express"
const routing: Router = express.Router();

// v1 routes imports
import docsRoute from "./docs.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./users.route"
import plansRoutes from "./plans.routes";
import tripsRoutes from "./trips.routes";
import subscriptionRoutes from "./subscription.routes";
import travelRequirementRoutes from "./travel.requirements.routes";
import watchlistRoutes from "./watchlist.routes";

// v1 routes
routing.use("/api/v1", docsRoute);
routing.use("/api/v1/auth", authRoutes);
routing.use("/api/v1/users", userRoutes);
routing.use("/api/v1/plans", plansRoutes);
routing.use("/api/v1/trips", tripsRoutes);
routing.use("/api/v1/subscription", subscriptionRoutes);
routing.use("/api/v1", travelRequirementRoutes);
routing.use("/api/v1/watchlist", watchlistRoutes);


export default routing;