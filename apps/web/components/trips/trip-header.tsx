import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as Icons from "lucide-react";

type Collab = { id: string; name?: string; image?: string };

export default function TripHeader(props: {
  title: string;
  startDate?: string | Date;
  endDate?: string | Date;
  coverUrl?: string;
  collaborators?: Collab[];
}) {
  const { title, startDate, endDate, coverUrl, collaborators = [] } = props;

  const fmt = (d?: string | Date) =>
    d ? new Date(d).toLocaleDateString(undefined, { month: "numeric", day: "numeric" }) : "";

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="h-40 w-full bg-muted">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl || "/images/cover-placeholder.jpg"})` }}
          />
        </div>
        <div className="space-y-1 p-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Icons.Calendar className="h-4 w-4" />
            <span>
              {fmt(startDate)} – {fmt(endDate)}
            </span>
            <span className="mx-1">•</span>
            <div className="flex -space-x-2">
              {collaborators.map((c) => (
                <Avatar key={c.id} className="h-6 w-6 border">
                  <AvatarImage src={c.image} alt={c.name} />
                  <AvatarFallback>{c.name?.slice(0, 2) || "PP"}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
