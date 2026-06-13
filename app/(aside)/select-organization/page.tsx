import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamSwitcher } from "./team-switcher";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AddOrganization } from "./add-organization";
import { Skeleton } from "@/components/ui/skeleton";
import { switchOrganization } from "./actions";
import SwitchOrganization from "./switch-organization";

const OrganizationCard = async () => {
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });
  console.log(organizations);
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Manage your organization</CardDescription>
          <CardAction>
            <AddOrganization />
          </CardAction>
        </CardHeader>
        <CardContent>
          <SwitchOrganization organizations={organizations} />
        </CardContent>
      </Card>
    </>
  );
};

function Page() {
  return (
    <>
      <section className="p-4 w-full max-w-xl mx-auto my-10 h-full">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="w-full h-48"></Skeleton>
            </div>
          }
        >
          <OrganizationCard />
        </Suspense>
      </section>
    </>
  );
}

export default Page;
