"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routing = express_1.default.Router();
// v1 routes imports
const docs_routes_1 = __importDefault(require("./docs.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const users_route_1 = __importDefault(require("./users.route"));
const projects_routes_1 = __importDefault(require("./projects.routes"));
const metrics_routes_1 = __importDefault(require("./metrics.routes"));
const tokenomics_routes_1 = __importDefault(require("./tokenomics.routes"));
const news_routes_1 = __importDefault(require("./news.routes"));
const listing_routes_1 = __importDefault(require("./listing.routes"));
const watchlist_routes_1 = __importDefault(require("./watchlist.routes"));
const project_history_routes_1 = __importDefault(require("./project.history.routes"));
const submission_routes_1 = __importDefault(require("./submission.routes"));
// v1 routes
routing.use("/api/v1", docs_routes_1.default);
routing.use("/api/v1/auth", auth_routes_1.default);
routing.use("/api/v1/users", users_route_1.default);
routing.use("/api/v1/projects", projects_routes_1.default);
routing.use("/api/v1/metrics", metrics_routes_1.default);
routing.use("/api/v1/tokenomics", tokenomics_routes_1.default);
routing.use("/api/v1/news", news_routes_1.default);
routing.use("/api/v1/listings", listing_routes_1.default);
routing.use("/api/v1/watchlist", watchlist_routes_1.default);
routing.use("/api/v1/submissions", submission_routes_1.default);
routing.use("/api/v1/project-history", project_history_routes_1.default);
exports.default = routing;
