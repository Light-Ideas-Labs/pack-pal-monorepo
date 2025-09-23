"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSignOutMutation } from "@/lib/api/authApi";
import { useAppSelector } from "@/lib/store/StoreProvider";
import { selectIsAuthed } from "@/lib/store/globalSlice";
import { toast } from "sonner";

export function AuthButton() {
  const isAuthed = useAppSelector(selectIsAuthed);
  const [signOut, { isLoading }] = useSignOutMutation();
  const router = useRouter();

  if (!isAuthed) return null;

  const handleSignOut = async () => {
    try{
      await signOut().unwrap();
      router.push("auth/sign-in");
    }catch (error){
      toast.error("Sign out failed. Please try again.");
    }
  };

  return (
    <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? "Signing out…" : "Sign out"}
    </Button>
  );
}
