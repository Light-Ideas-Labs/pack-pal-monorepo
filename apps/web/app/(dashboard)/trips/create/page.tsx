"use client";

import { useState, useEffect } from "react";
import NewTripForm from "@/components/trips-form/new-trip-form";

export default function NewTripPage() {
  return (
    <div className="mx-auto max-w-xl">
      <NewTripForm />
    </div>
  );
}


