// src/routes/health.routes.ts
import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import os from "os";
import pkg from "../../../package.json";

const router: Router = Router();

async function pingMongo(timeoutMs = 1500) {
    const ctl = new AbortController();
    const id = setTimeout(() => ctl.abort(), timeoutMs);
    
    try {
        // readyState: 1 == connected, but still try an admin ping
        if (mongoose.connection.readyState !== 1) return false;
        // @ts-ignore — types for admin() can be loose
        await mongoose.connection.db.admin().command({ ping: 1 }, { signal: ctl.signal });
        return true;
    } catch {
        return false;
    } finally {
        clearTimeout(id);
    }
}

/** Liveness: “is the process up?” – cheap and fast. */
router.get("/healthz", (_req: Request, res: Response) => {
    res.set("Cache-Control", "no-store");
    res.status(200).json({ status: "ok" });
});

/** Readiness: “can we serve traffic?” – checks dependencies. */
router.get("/readyz", async (_req: Request, res: Response) => {
    const mongoHealthy = await pingMongo();
    const healthy = mongoHealthy; // add more checks here later (Redis, S3, etc.)
    
    const payload = { 
        status: healthy ? "ready" : "not_ready",
        checks: {
            mongo: mongoHealthy ? "ok" : "down",
            // redis: "...",
        },
        ts: new Date().toISOString(),
    };
    
    res.set("Cache-Control", "no-store");
    res.status(healthy ? 200 : 503).json(payload);
});

/** Version/build info – handy for debugging deploys. */
router.get("/version", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
        name: pkg.name,
        version: pkg.version,
        node: process.version,
        pid: process.pid,
        uptimeSec: Math.round(process.uptime()),
        hostname: os.hostname(),
        env: process.env.NODE_ENV,
    });
});

/** Minimal Prometheus text metrics (optional; expand as needed). */
router.get("/metrics", (_req, res) => {
    res.type("text/plain");
    // add real counters/histograms later; for now a stub
    res.send(`# HELP packpal_up 1 if the app is up # TYPE packpal_up gauge packpal_up 1`);
});

export default router;
