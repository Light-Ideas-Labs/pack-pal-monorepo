import type { UserDocument } from "../modules/models/users/model";

declare global {
  namespace Express {
    interface User extends UserDocument {}

    interface Request {
      user?: UserDocument;
      guestSessionId?: string;
      flash(type: string, message: string | string[]): void;
    }
  }

  interface CorsOptions {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
  }

  interface EmailMessage {
    subject: string;
    text?: string;
    html?: string;
  }

  interface Project {
    name: string;
    slug: string;
    category: string;
    region: string;
    website: string;
    logoUrl?: string;
    description: string;
    aiSummary?: string;
    tags: string[];
    listedAt: Date;
    isActive: boolean;
  }

  interface TokenMetrics {
    projectId: string;
    tokenSymbol: string;
    tokenName: string;
    priceUSD: number;
    priceChange24h: number;
    marketCapUSD: number;
    volume24hUSD: number;
    circulatingSupply: number;
    totalSupply: number;
    holdersCount?: number;
    lastUpdated: Date;
  }

  interface Tokenomics {
    projectId: string;
    useOfFunds: {
      category: string;
      percentage: number;
    }[];
    vestingSchedule: string;
    tokenReleaseChartUrl?: string;
    tokenDistributionChartUrl?: string;
    keyBackers?: string[];
  }

  interface NewsItem {
    projectId: string;
    title: string;
    link: string;
    publishedAt: Date;
    source: string;
  }

  interface GenericLogger {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug?: (...args: any[]) => void;
  }
}

export {};
