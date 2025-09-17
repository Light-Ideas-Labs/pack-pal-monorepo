"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

// wire to your RTKQ mutation
import { useCreateTripMutation } from "@/lib/api/tripsApi"; // <- adjust import
import { NewTripSchema, type TripsFormInput, type TripsFormValues } from "@/lib/validation/trip";


  const COLORS = [
    { key: "peach",    className: "bg-[#FFD7C2]" },
    { key: "lavender", className: "bg-[#E7D7FF]" },
    { key: "mint",     className: "bg-[#CFF8E5]" },
    { key: "sun",      className: "bg-[#FFE79B]" },
    { key: "ocean",    className: "bg-[#BFE5FF]" },
    { key: "grape",    className: "bg-[#D9C2FF]" },
  ] as const;

export default function NewTripForm() {
  const router = useRouter();
  const [createTrip, { isLoading }] = useCreateTripMutation();

  const form = useForm<TripsFormInput, any, TripsFormValues>({
    resolver: zodResolver(NewTripSchema),
    defaultValues:{
      name: "",
      destination: "",
      color: "peach",
      invites: "",
      visibility: "friends",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = async (values: TripsFormValues) => {
    // Compose a friendly title for the backend if you want
    const title =
      values.name.trim() ||
      (values.destination ? `Trip to ${values.destination}` : "Untitled Trip");

    const payload = {
      title,
      startDate: values.startDate,
      endDate: values.endDate,
      // add color/destination to your model later if you like
      // color: values.color,
      // destination: values.destination,
    };

    // const res = await createTrip(payload).unwrap();
    // const id = res?.data?._id || res?._id;
    // if (id) router.push(`/trips/${id}`);
  };

  return (
    <div className="mx-auto max-w-xl py-10">
      <h1 className="mb-6 text-center text-3xl font-semibold">Plan a new trip</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Trip Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where to? (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Rome, Italy, Nairobi..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dates (shadcn calendar pickers) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Start */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => {
                const label =
                  field.value ? format(field.value, "PPP") : "Pick a date";
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="justify-start gap-2"
                          >
                            <CalendarIcon className="h-4 w-4" />
                            <span className={!field.value ? "text-muted-foreground" : ""}>
                              {label}
                            </span>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(d) => {
                            field.onChange(d);
                            const end = form.getValues("endDate");
                            if (d && end && end < d) {
                              form.setValue("endDate", d, { shouldValidate: true });
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* End */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => {
                const start = form.getValues("startDate");
                const label =
                  field.value ? format(field.value, "PPP") : "Pick a date";
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>End date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="justify-start gap-2"
                          >
                            <CalendarIcon className="h-4 w-4" />
                            <span className={!field.value ? "text-muted-foreground" : ""}>
                              {label}
                            </span>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => (start ? date < start : false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* Color picker (kept as you wanted) */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <div className="mt-2 flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => field.onChange(c.key)}
                      className={`h-8 w-8 rounded-full border ring-offset-2 focus:outline-none focus:ring-2 ${c.className} ${
                        field.value === c.key ? "ring-2 ring-foreground/60" : ""
                      }`}
                      aria-label={c.key}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Invite + Visibility */}
          <div className="flex items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="invites"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Invite tripmates</FormLabel>
                  <FormControl>
                    <Input placeholder="comma-separated emails or @usernames" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <select
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      {...field}
                    >
                      <option value="private">Private</option>
                      <option value="friends">Friends</option>
                      <option value="public">Public</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-2 text-center">
            <Button type="submit" size="lg" className="rounded-full px-8" disabled={isLoading}>
              {isLoading ? "Creating…" : "Start planning"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
