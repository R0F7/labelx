"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { SignOut } from "@phosphor-icons/react/dist/ssr";

function RevokeSession({ token }: { token: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        authClient.revokeSession({
          token: token,
        });
      }}
    >
      <SignOut className="size-4" />
    </Button>
  );
}

export default RevokeSession;
