"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/theme/theme-switch";
import {useDispatch, useSelector } from "react-redux";
import { selectAuth, signOut as signOutAction } from "@/lib/store/authSlice";
import { AnnouncementBar } from "./announcement-bar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, User, Plus, MapPinned } from "lucide-react";
import { toast } from "sonner";


export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();



  const { token, user } = useSelector(selectAuth);
  const signedIn = Boolean(token);
  const name = user?.userName || (user?.email ? user.email.split("@")[0] : null);
  const role = user?.role;
  const avatarUrl = user?.avatarUrl;
  // Generate initials from name or default to "G" for Guest


  const initials = (name ?? "Guest").split(" ").map((n) => n[0]).join("").toUpperCase();

  const handleSignOut = () => {
    try {
      dispatch(signOutAction());
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error) {
      console.log("Error during sign out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur">
      {/* Top Announcement Bar */}
      <AnnouncementBar username={name ?? undefined} role={role ?? undefined} />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-primary" />
          <span className="font-bold">PackPal</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
        </nav>
        <div className="flex items-center gap-2">
          {signedIn ? (
            <>
              <Link href="/trips/create">
                <Button className="bg-brand-500 hover:bg-brand-600">
                  <Plus className="mr-2 h-4 w-4" />
                  New trip
                </Button>
              </Link>
              <Link href="/trips/list">
                <Button variant="outline">
                  <MapPinned className="mr-2 h-4 w-4" />
                  My trips
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-2">
                    <Avatar className="h-8 w-8">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={name ?? "User"} />
                      ) : (
                        <AvatarFallback>{initials}</AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    {name ?? "Traveler"}
                  </DropdownMenuLabel>
                  <div className="px-2 pb-1 text-xs text-muted-foreground">
                    {role ?? "Traveler"}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/trips/list">
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeSwitch />
            </>
          ) : (
            <>
              <Link href="/auth/sign-in">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/trips/create">
                <Button className="bg-brand-500 hover:bg-brand-600">
                  Get started
                </Button>
              </Link>
              <ThemeSwitch />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
