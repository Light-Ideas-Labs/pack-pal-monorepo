import { Suspense } from "react";
import RequireAuth from "@/components/auth/require-auth";
import NewTripForm from "@/components/trips/new-trip-form";

export default function NewTripPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Satisfies Next’s requirement for any useSearchParams() below */}
      <Suspense fallback={null}>
        <RequireAuth>
          <NewTripForm />
        </RequireAuth>
      </Suspense>
    </div>
  );
}


