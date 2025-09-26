"use client";

import { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // if you have one; otherwise inline a simple classnames helper
import * as Icons from "lucide-react";
import { toast } from "sonner";

type Collaborator = { id: string; name?: string; avatarUrl?: string };

type InviteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteLink: string;                                      /** The shareable link (you can generate this server-side). */
  defaultPermission?: "edit" | "view";                   /** Initial permission for link & invites. */
  collaborators?: Collaborator[];                     /** Shown in the (optional) avatar preview block */
  onInviteEmails?: (emailsOrHandles: string[], permission: "edit" | "view") => Promise<void> | void;    /** Called when user submits emails/usernames */
  onCopyLink?: (link: string, permission: "edit" | "view") => void;      /** Called after “Copy link” (optional – analytics) */
  privacy?: { notesVisible: boolean; reservationsVisible: boolean };   /** Privacy toggles */
  onPrivacyChange?: (p: { notesVisible: boolean; reservationsVisible: boolean }) => void;
};

function withPerm(link: string, perm: "edit" | "view") {
  try {
    const u = new URL(link, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    u.searchParams.set("perm", perm);
    return u.toString();
  } catch {
    // fallback if it's a relative/path-only string
    const sep = link.includes("?") ? "&" : "?";
    return `${link}${sep}perm=${perm}`;
  }
}

export default function InviteDialog({
  open,
  onOpenChange,
  inviteLink,
  defaultPermission = "edit",
  collaborators = [],
  onInviteEmails,
  onCopyLink,
  privacy,
  onPrivacyChange,
}: InviteDialogProps) {
  const [perm, setPerm] = useState<"edit" | "view">(defaultPermission);
  const [emailInput, setEmailInput] = useState("");
  const [notesVisible, setNotesVisible] = useState(privacy?.notesVisible ?? true);
  const [reservationsVisible, setReservationsVisible] = useState(privacy?.reservationsVisible ?? false);

  useEffect(() => setPerm(defaultPermission), [defaultPermission]);
  useEffect(() => {
    onPrivacyChange?.({ notesVisible, reservationsVisible });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notesVisible, reservationsVisible]);
  
  const isViewOnly = perm === "view";
  const linkForPerm = useMemo(() => withPerm(inviteLink, perm), [inviteLink, perm]);


  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkForPerm);
      toast.success("Link copied");
      onCopyLink?.(linkForPerm, perm);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const submitEmails = async () => {
    const parts = emailInput.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);

    if (!parts.length) {
      toast.message("Type one or more emails or @usernames");
      return;
    }

    try {
      await onInviteEmails?.(parts, perm);
      toast.success("Invites sent");
      setEmailInput("");
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to send invites");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-md p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>Invite tripmates</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4">
          {/* Segmented permission control */}
          <div className="grid grid-cols-2 overflow-hidden rounded-md border bg-muted p-0.5">
            <button
              type="button"
              onClick={() => setPerm("edit")}
              className={cn(
                "rounded-sm py-1.5 text-sm transition",
                perm === "edit" ? "bg-background shadow font-medium" : "text-muted-foreground"
              )}
            >
              Can edit
            </button>
            <button
              type="button"
              onClick={() => setPerm("view")}
              className={cn(
                "rounded-sm py-1.5 text-sm transition",
                perm === "view" ? "bg-background shadow font-medium" : "text-muted-foreground"
              )}
            >
              View only
            </button>
          </div>

          {/* OPTIONAL: collaborators preview (skeleton if empty) */}
          <div className="mt-3 rounded-md border bg-muted/40 p-3">
            {collaborators.length ? (
              <div className="flex -space-x-2">
                {collaborators.slice(0, 8).map((c) => (
                  <Avatar key={c.id} className="h-8 w-8 border bg-background">
                    <AvatarImage src={c.avatarUrl} alt={c.name} />
                    <AvatarFallback className="text-[10px]">
                      {c.name?.slice(0, 2)?.toUpperCase() ?? "PP"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {collaborators.length > 8 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-xs">
                    +{collaborators.length - 8}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-20 animate-pulse rounded-md bg-muted" />
            )}
          </div>

          {/* Copy link row */}
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Icons.Link2 className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={inviteLink}
                readOnly
                className="pl-8"
                aria-label="Invite link"
              />
            </div>
            <Button onClick={copyLink} className="shrink-0">
              Copy link
            </Button>
          </div>

          {/* Invite by email/user (disabled in view-only mode) */}
          <div className="mt-3">
            <div className="relative">
              <Icons.Mail className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={isViewOnly ? "Switch to “Can edit” to invite by email" : "Invite by email or user"}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isViewOnly && submitEmails()}
                className="pl-8"
                disabled={isViewOnly}
                aria-disabled={isViewOnly}
                title={isViewOnly ? "View-only link: email invites are disabled" : undefined}
              />
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" onClick={submitEmails} disabled={isViewOnly}>
                Send invite
              </Button>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="icon" title="Share on X">
                  <Icons.Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Share on Facebook">
                  <Icons.Facebook className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Privacy settings */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">Notes/checklists</Label>
                  <div className="text-xs text-muted-foreground">
                    {notesVisible ? "Visible" : "Hidden"}
                  </div>
                </div>
                <Switch checked={notesVisible} onCheckedChange={setNotesVisible} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">Travel reservations</Label>
                  <div className="text-xs text-muted-foreground">
                    {reservationsVisible ? "Visible" : "Hidden"}
                  </div>
                </div>
                <Switch checked={reservationsVisible} onCheckedChange={setReservationsVisible} />
              </div>
            </div>
          </div>

          {/* Footer link */}
          <div className="mt-4">
            <Button variant="ghost" className="h-auto px-0 text-sm text-muted-foreground" asChild>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <Icons.Users className="mr-2 inline-block h-4 w-4" />
                Manage tripmates
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
