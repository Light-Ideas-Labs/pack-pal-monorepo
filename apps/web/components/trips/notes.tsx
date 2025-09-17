"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Notes({
  placeholder = "Start writing your trip notes…",
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode; // replace with your editor if you have one
}) {
  return (
    <>
      <div className="mb-3 mt-6">
        <h2 className="text-lg font-semibold">Notes</h2>
      </div>
      <Card>
        <CardContent className="p-4">
          {children ? (
            children
          ) : (
            <div className="min-h-[140px] rounded-md border bg-background p-3 text-sm text-muted-foreground">
              {placeholder}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
