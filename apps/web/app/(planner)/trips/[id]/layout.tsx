import type { ReactNode } from "react";

/**
 * This layout removes Navbar/Footer for the trip details page.
 * Everything under /trips/[id] will render with this minimal frame.
 */
export default function TripDetailsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
