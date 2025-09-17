"use client";

import * as React from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

type Ctx = { slots: SlotProps[] };
const OTPContext = React.createContext<Ctx | null>(null);

export type InputOTPProps = React.ComponentProps<"div"> & {
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
};

export function InputOTP({
  value,
  onChange,
  maxLength = 6,
  className,
  children,
  ...props
}: InputOTPProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      render={({ slots }) => (
        <div className={cn("flex items-center gap-2", className)} {...props}>
          <OTPContext.Provider value={{ slots }}>{children}</OTPContext.Provider>
        </div>
      )}
    />
  );
}

export function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-2", className)} {...props} />;
}

export function InputOTPSeparator({
  children = <span className="opacity-70">-</span>,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-1 text-sm text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
}

export function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & { index: number }) {
  const ctx = React.useContext(OTPContext);
  const slot = ctx?.slots[index];

  return (
    <div
      className={cn(
        "relative h-10 w-10 rounded-md border bg-background text-center text-base font-medium",
        "flex items-center justify-center",
        slot?.isActive ? "ring-2 ring-primary border-primary" : "border-input",
        className
      )}
      {...props}
    >
      {slot?.char ?? <span className="text-muted-foreground">•</span>}
      {slot?.hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-[2px] animate-pulse bg-foreground" />
        </div>
      )}
    </div>
  );
}
