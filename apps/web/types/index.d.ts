export * from "./auth";
export * from "./trip";

export type ApiEnvelope<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  dataItem?: T;
  dataList?: T[];
  meta?: Record<string, unknown>;
  pages?: number;
  [k: string]: any;
};

