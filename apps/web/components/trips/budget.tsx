"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Budget({
  amount = 0,
  currency = "KES",
  onView,
}: {
  amount?: number;
  currency?: string;
  onView?: () => void;
}) {
  const value = new Intl.NumberFormat(undefined, {
    style: "currency",
    currencyDisplay: "code",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <Card className="mb-6">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-sm text-muted-foreground">Budgeting</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
        <Button variant="outline" size="sm" onClick={onView}>
          View details
        </Button>
      </CardContent>
    </Card>
  );
}
