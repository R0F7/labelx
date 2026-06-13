"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { createOrganization } from "./actions";
import { toast } from "sonner";

export function AddOrganization() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createOrganization,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Organization created successfully!");
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Create Organization</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form className="space-y-4" action={formAction}>
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
            <DialogDescription>
              Fill the form below to create a new Organization
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input defaultValue={state?.input?.name} name="name" required />
              <FieldError>{state?.error?.name}</FieldError>
            </Field>
            <Field>
              <Label htmlFor="username-1">Slug</Label>
              <Input defaultValue={state?.input?.slug} name="slug" required />
              <FieldError>{state?.error?.slug}</FieldError>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Processing..." : "Create Organization"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
