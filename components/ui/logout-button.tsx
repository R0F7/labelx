"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutMenuItem() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/login");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to logout");
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
    >
      Logout
    </DropdownMenuItem>
  );
}