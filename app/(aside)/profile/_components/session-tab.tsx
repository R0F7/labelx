import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import Form from "next/form";

import { TabsContent } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { revokeSession } from "../actions";
import { Button } from "@/components/ui/button";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { headers } from "next/headers";

export default async function SessionTab() {
  const sessions = await auth.api.listSessions({
    headers: await headers(),
  });

  return (
    <TabsContent value="session">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>
            You have {sessions?.length || 0} sessions active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col gap-4">
            {sessions && sessions.length > 0 ? (
              sessions.map((session) => (
                <Item key={session.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>
                      {session.ipAddress || "Unknown Device"}
                    </ItemTitle>
                    <ItemDescription>
                      Last active:{" "}
                      {new Date(session.updatedAt).toLocaleString()}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Form action={revokeSession}>
                      <input type="hidden" name="token" value={session.token} />
                      <Button>
                        <SignOut className="size-4" />
                      </Button>
                    </Form>
                  </ItemActions>
                </Item>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active sessions found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
