"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AddType = "flight" | "lodging" | "car" | "restaurant" | "attachment" | "other";
type ReservationsProps = {
  onAdd?: (type: AddType) => void;
  budget?: {
    amount: number;
    spent?: number;
    currency?: string;
    onView?: () => void;
  };
  className?: string;
};

function RowItem({
  icon,
  label,
  onClick,
  withDivider = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  withDivider?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", withDivider && "pl-4 relative")}>
      {withDivider && <span className="absolute left-0 h-5 w-px bg-border" />}
      <button
        type="button"
        onClick={onClick}
        className="group flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 hover:bg-muted/50"
      >
        <span className="[&>svg]:h-4 [&>svg]:w-4 text-foreground/80 group-hover:text-foreground">
          {icon}
        </span>
        <span className="text-[11px] leading-4 text-muted-foreground">{label}</span>
      </button>
    </div>
  );
}

export default function Reservations({
  onAdd,
  budget = { amount: 0, spent: 0, currency: "USD" },
  className,
}: ReservationsProps) {
  const formatted = useMemo(() => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: budget.currency || "USD",
        maximumFractionDigits: 2,
      }).format(budget.amount || 0);
    } catch {
      return `${budget.currency ?? "USD"} ${(budget.amount || 0).toFixed(2)}`;
    }
  }, [budget.amount, budget.currency]);

  const pct =
    typeof budget.spent === "number" && budget.amount > 0
      ? Math.max(0, Math.min(100, (budget.spent / budget.amount) * 100))
      : 0;

  return (
    <section className={cn("mt-4 overflow-visible", className)}>
      <div className="grid gap-3 md:grid-cols-[1fr_minmax(220px,240px)]">
        {/* Left: Reservations */}
        <div className="rounded-xl border bg-muted/30 p-3 sm:p-4">
          <h3 className="mb-2 text-sm font-semibold">Reservations and attachments</h3>

          <div className="flex flex-wrap items-center gap-3">
            <RowItem icon={<Icons.Plane />} label="Flight" onClick={() => onAdd?.("flight")} />
            <RowItem icon={<Icons.Building2 />} label="Lodging" onClick={() => onAdd?.("lodging")} withDivider />
            <RowItem icon={<Icons.Car />} label="Rental car" onClick={() => onAdd?.("car")} withDivider />
            <RowItem icon={<Icons.Utensils />} label="Restaurant" onClick={() => onAdd?.("restaurant")} withDivider />
            <RowItem icon={<Icons.Paperclip />} label="Attachment" onClick={() => onAdd?.("attachment")} withDivider />
            <RowItem icon={<Icons.MoreHorizontal />} label="Other" onClick={() => onAdd?.("other")} withDivider />
          </div>
        </div>

        {/* Right: Budget snapshot */}
        <div className="rounded-xl border bg-muted/30 p-3 sm:p-4">
          <h3 className="text-sm font-semibold">Budgeting</h3>
          <div className="mt-1 text-xl font-semibold tracking-tight">{formatted}</div>

          {/* tiny progress bar (optional) */}
          <div className="mt-2 h-6 rounded-lg bg-primary/20 p-1">
            <div
              className="h-full rounded-md bg-primary"
              style={{ width: `${pct}%` }}
              aria-hidden
            />
          </div>

          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={budget.onView}
            className="px-0 mt-1"
          >
            View details
          </Button>
        </div>
      </div>
    </section>
  );
}
