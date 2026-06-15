import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Capitalize } from "@/lib/utils";
import { Mail, UserIcon } from "lucide-react";

interface Props {
  user: {
    name: string;
    username: string;
    email: string;
    role: string;
    image?: string | null;
  };
}

export default async function UserCard({ user }: Props) {
  return (
    <div className="md:col-span-4 lg:col-span-3 space-y-6">
      <Card className="border-none shadow-sm overflow-hidden py-0">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardContent className="relative pt-0 text-center">
          <Avatar className="h-24 w-24 border-4 border-white mx-auto -mt-12 mb-4 shadow-xl">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>
              <UserIcon className="size-12" />
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold">{user?.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 italic">
            @{user?.username || user?.email}
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">{Capitalize(user?.role || "")}</Badge>
          </div>
        </CardContent>
        <Separator />
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
            <Mail className="h-4 w-4" /> {user?.email}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
