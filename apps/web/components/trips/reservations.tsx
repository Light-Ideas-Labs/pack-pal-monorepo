"use client";

import * as React from "react";
import * as Icons from "lucide-react";

function Pill({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm hover:bg-muted"
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {label}
    </button>
  );
}

export default function Reservations({
  onAdd,
}: {
  onAdd?: (type: "flight" | "lodging" | "car" | "restaurant" | "attachment" | "other") => void;
}) {
  return (
    <>
      <div className="mb-3 mt-6">
        <h2 className="text-lg font-semibold">Reservations and attachments</h2>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <Pill icon={<Icons.Plane />} label="Flight" onClick={() => onAdd?.("flight")} />
        <Pill icon={<Icons.Building2 />} label="Lodging" onClick={() => onAdd?.("lodging")} />
        <Pill icon={<Icons.Car />} label="Rental car" onClick={() => onAdd?.("car")} />
        <Pill icon={<Icons.Utensils />} label="Restaurant" onClick={() => onAdd?.("restaurant")} />
        <Pill icon={<Icons.Paperclip />} label="Attachment" onClick={() => onAdd?.("attachment")} />
        <Pill icon={<Icons.MoreHorizontal />} label="Other" onClick={() => onAdd?.("other")} />
      </div>
    </>
  );
}
