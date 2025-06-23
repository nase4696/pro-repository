"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <Icons.alert className="h-16 w-16 text-red-500" />
      <h2 className="text-red-500 font-semibold text-center text-sm sm:text-lg">
        {error.message}
      </h2>
      <Button onClick={() => reset()}>リトライ</Button>
    </div>
  );
}
