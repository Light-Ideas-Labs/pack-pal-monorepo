"use client";

import { Button } from "@/components/ui/button"; // Adjust the path as needed
import { Icons } from "./icons"; // Adjust the path as needed

const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

export default function GoogleSignInButton() {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl');
  // onClick={() => signIn('google', { callbackUrl: callbackUrl ?? '/user/dashboard' })}

  const googleAuth = () => {
    window.open(`${baseUrl}/auth/google`, "_self");
  };

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={googleAuth}
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
