"use client";

import { z } from "zod";

export const NewTripSchema = z.object({
  title: z.string().min(2, "Trip name is required").max(80).transform(v => (v ?? "").trim()),
  destination: z.string().trim().min(2, "Where to?"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  coverColor: z.enum(["peach", "lavender", "mint", "sun", "ocean", "grape"]),
  invites: z.string().optional(), // comma-separated emails/usernames
  visibility: z.enum(["private", "friends", "public"]).default("private"),

}).refine((v) => v.endDate >= v.startDate, {
  path: ["endDate"],
  message: "End date must be after start date",
});

export type TripsFormInput = z.input<typeof NewTripSchema>;
export type TripsFormValues = z.output<typeof NewTripSchema>;

