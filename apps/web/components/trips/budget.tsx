"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";

type Props = {
  amount?: number;
  currency?: string;
  onAddExpense?: () => void;
  onSetBudget?: () => void;
  onGroupBalances?: () => void;
  onViewBreakdown?: () => void;
  onAddTripmate?: () => void;
  onOpenSettings?: () => void;
};

function PillBtn({icon, label, onClick}: { icon: React.ReactNode; label: string; onClick?: () => void; }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm hover:bg-muted/80"
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {label}
    </button>
  );
}


export default function Budget({
  amount = 0,
  currency = "KES",
  onAddExpense,
  onSetBudget,
  onGroupBalances,
  onViewBreakdown,
  onAddTripmate,
  onOpenSettings,
}: Props) {
  const value = new Intl.NumberFormat(undefined, {
    style: "currency",
    currencyDisplay: "code",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
<div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Budgeting</h2>
        <Button onClick={onAddExpense} className="rounded-full">
          <Icons.Plus className="mr-2 h-4 w-4" />
          Add expense
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          {/* Left: big total + pill buttons */}
          <div className="flex items-center gap-6">
            <div>
              <div className="text-2xl font-semibold">{value}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <PillBtn icon={<Icons.Pencil />} label="Set budget" onClick={onSetBudget} />
              <PillBtn icon={<Icons.Calculator />} label="Group balances" onClick={onGroupBalances} />
            </div>
          </div>

          {/* Right: link-like actions */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground md:text-right">
            <button className="inline-flex items-center gap-2 hover:underline" onClick={onViewBreakdown}>
              <Icons.ListChecks className="h-4 w-4" />
              View breakdown
            </button>
            <button className="inline-flex items-center gap-2 hover:underline" onClick={onAddTripmate}>
              <Icons.UserPlus className="h-4 w-4" />
              Add tripmate
            </button>
            <button className="inline-flex items-center gap-2 hover:underline" onClick={onOpenSettings}>
              <Icons.Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
