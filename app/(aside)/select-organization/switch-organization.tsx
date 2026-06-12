"use client";
import React, { useActionState } from "react";
import { switchOrganization } from "./actions";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { TeamSwitcher } from "./team-switcher";
import { Button } from "@/components/ui/button";
import { type Organization } from "better-auth/plugins";

function SwitchOrganization({
  organizations,
}: {
  organizations: Organization[];
}) {
    const [state,action,pending] = useActionState(switchOrganization,null)
  return (
    <form className="space-y-4" action={action}>
      <FieldGroup>
        <Field>
          <FieldLabel>Select Organization</FieldLabel>
          <TeamSwitcher organizations={organizations} />
        </Field>
        <Field>
          <Button>Select Organization</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export default SwitchOrganization;
