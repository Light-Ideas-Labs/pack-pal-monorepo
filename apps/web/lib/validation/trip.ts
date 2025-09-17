"use client";

import { z } from "zod";

export const NewTripSchema = z.object({
  name: z.string().min(2, "Where to?").max(80),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  color: z.enum(["peach", "lavender", "mint", "sun", "ocean", "grape"]),
  invites: z.string().optional(), // comma-separated emails/usernames
  visibility: z.enum(["private", "friends", "public"]).default("friends"),
  destination: z.string().min(2, "Where to?").optional(),
}).refine((v) => v.endDate >= v.startDate, {
  path: ["endDate"],
  message: "End date must be after start date",
});

export type TripsFormInput = z.input<typeof NewTripSchema>;
export type TripsFormValues = z.output<typeof NewTripSchema>;

