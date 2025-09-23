import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as Icons from "lucide-react";

type Collab = { id: string; name?: string; image?: string };
type CurrentUser = { id?: string; name?: string; image?: string };

const COLOR_BG: Record<string, string> = {
  peach: "#FFD7C2",
  lavender: "#E7D7FF",
  mint: "#CFF8E5",
  sun: "#FFE79B",
  ocean: "#BFE5FF",
  grape: "#D9C2FF",
};

const resolveColor = (c?: string) => (c && COLOR_BG[c]) || c || "#e5e7eb"; // fallback gray if nothing set

export default function TripHeader(props: { title: string; startDate?: string | Date; endDate?: string | Date; coverColor?: string; coverUrl?: string; currentUser?: CurrentUser; collaborators?: Collab[]; onInviteClick?: () => void; }) {
  const { title, startDate, endDate, coverColor, coverUrl, currentUser, collaborators = [], onInviteClick } = props;

  const fmt = (d?: string | Date) => d ? new Date(d).toLocaleDateString(undefined, { month: "numeric", day: "numeric" }) : "";

  // Prefer color; only use image if provided
  const bgStyle: React.CSSProperties = coverUrl
    ? { backgroundImage: `url(${coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundColor: resolveColor(coverColor) };


  // first show current user, then others (dedupe by id)
  const people: Collab[] = useMemo(() => {
    const me: Collab | null = currentUser ? { id: currentUser.id || "me", name: currentUser.name || "You", image: currentUser.image } : null;
    const list = [...(me ? [me] : []), ...collaborators];
    const seen = new Set<string>();
    return list.filter(p => {
      const key = p.id ?? p.name ?? "";
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  }, [currentUser, collaborators]);

  return (
<Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        {/* Cover */}
        <div className="h-40 w-full" style={bgStyle}>
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl || "/images/cover-placeholder.jpg"})` }}
          />
        </div>

        {/* Header row: title (left) | collaborators + invite (right) */}
        <div className="flex items-start justify-between gap-3 p-4 pb-2">
          <h1 className="text-2xl font-semibold">{title}</h1>

          <div className="flex items-center gap-2">
            {/* Avatars (right-aligned, overlap) */}
            <div className="flex -space-x-2">
              {people.slice(0, 4).map((c) => (
                <Avatar key={c.id} className="h-8 w-8 border">
                  <AvatarImage src={c.image} alt={c.name} />
                  <AvatarFallback className="text-[10px]">
                    {c.name?.slice(0, 2)?.toUpperCase() ?? "PP"}
                  </AvatarFallback>
                </Avatar>
              ))}
              {people.length > 4 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted text-xs">
                  +{collaborators.length - 4}
                </div>
              )}
            </div>

            {/* Invite button */}
            <button
              type="button"
              onClick={onInviteClick}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground hover:bg-muted"
              aria-label="Invite people"
              title="Invite people"
            >
              <Icons.UserPlus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sub row: dates */}
        <div className="flex items-center gap-3 px-4 pb-4 text-sm text-muted-foreground">
          <Icons.Calendar className="h-4 w-4" />
          <span>
            {fmt(startDate)} – {fmt(endDate)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
