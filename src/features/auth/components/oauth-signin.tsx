"use client";

import { signIn } from "next-auth/react";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingButton } from "@/components/ui/button/loading-button";

export function OAuthSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get("redirect_to") || "/home";

  const handleSignIn = (provider: "google") => {
    setIsLoading(true);
    signIn(provider, {
      redirect: true,
      redirectTo: `${from}?toast_code=login_success
    )}`,
    });
  };

  return (
    <div>
      <LoadingButton
        className="w-full"
        variant="outline"
        isLoading={isLoading}
        disabled={isLoading}
        onClick={() => handleSignIn("google")}
        spinnerVariant="gray"
      >
        {isLoading ? (
          <p>Googleでログイン</p>
        ) : (
          <>
            <Icons.google className="mr-2 h-4 w-4" />
            <p>Googleでログイン</p>
          </>
        )}
      </LoadingButton>
    </div>
  );
}
