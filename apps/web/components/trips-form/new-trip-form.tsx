"use client";

import { useRouter } from "next/navigation";
import { format as fmt } from "date-fns";
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
import { useAppDispatch, useAppSelector } from "@/lib/store/StoreProvider";
import { selectToken } from "@/lib/store/authSlice";
import { NewTripSchema, type TripsFormInput, type TripsFormValues } from "@/lib/validation/trip";
import { toast } from "sonner";

const COLOR_HEX: Record<TripsFormValues["coverColor"], string> = {
  peach: "#FFD7C2",
  lavender: "#E7D7FF",
  mint: "#CFF8E5",
  sun: "#FFE79B",
  ocean: "#BFE5FF",
  grape: "#D9C2FF",
}

type Props = React.ComponentProps<"form"> & { redirectTo?: string };

export default function NewTripForm({ redirectTo, ...formProps }: Props) {
  const router = useRouter();
  const [createTrip, { isLoading, error }] = useCreateTripMutation();

  const form = useForm<TripsFormInput, any, TripsFormValues>({
    resolver: zodResolver(NewTripSchema),
    defaultValues:{
      title: "",
      destination: "",
      coverColor: "peach",
      invites: "",
      visibility: "friends",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = async (values: TripsFormValues) => {
    console.log("Creating trip with values:", values);
    // Compose a friendly title for the backend if you want
    const title = values.title.trim() || (values.destination ? `Trip to ${values.destination}` : "Untitled Trip");

    // Convert Date → ISO string (or whatever your API expects)
    const startISO = values.startDate ? fmt(values.startDate, "yyyy-MM-dd") : "";
    const endISO   = values.endDate   ? fmt(values.endDate, "yyyy-MM-dd")   : "";

    const payload = {
      title,
      destination: values.destination || undefined,
      startDate: startISO,
      endDate: endISO,
      coverColor: COLOR_HEX[values.coverColor],
      invites: values.invites ? values.invites.split(",").map((s) => s.trim()).filter((s) => s.length > 0) : [],
      visibility: values.visibility,
    }

    try {

        // Todo: add color/destination to your model later if you like
        // color: values.color,
        // destination: values.destination
        console.log("[NewTripForm] calling createTrip…", payload);
        const res = await createTrip(payload).unwrap();
        console.log("[NewTripForm] createTrip result:", res);
        
        // Navigate to the new trip’s page – adjust if your API returns something different 
        const tripId = (res.data as { _id?: string; id?: string })._id ?? res.data.id;
        
        toast.success("Trip created!");
        router.push(`/trips/${encodeURIComponent(tripId)}`);
    } catch (err: any) {
      console.log("Failed to create trip:", err);
      

      const msg = err?.data?.message || err?.error || "Something went wrong creating your trip.";
      // optionally toast.error(msg) if you use react-hot-toast
      toast.error(msg);
    }
  };

  const apiErr = (error as any)?.data?.message || (error as any)?.error;

  return (
    <div className="mx-auto max-w-xl py-10">
      <h1 className="mb-6 text-center text-3xl font-semibold">Plan a new trip</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6" {...formProps}>

          {form.formState.errors.root && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Trip Name */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where to?</FormLabel>
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
                const label = field.value ? fmt(field.value, "PPP") : "Pick a date";
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
                const label = field.value ? fmt(field.value, "PPP") : "Pick a date";
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
            name="coverColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <div className="mt-2 flex gap-2">
                  {Object.entries(COLOR_HEX).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => field.onChange(key)}
                      className={`h-8 w-8 rounded-full border ring-offset-2 focus:outline-none focus:ring-2 ${value} ${
                        field.value === key ? "ring-2 ring-foreground/60" : ""
                      }`}
                      style={{ backgroundColor: value }}
                      aria-label={key}
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
            {apiErr ? <p className="text-sm text-destructive">{apiErr}</p> : null}
          </div>
        </form>
      </Form>
    </div>
  );
}
