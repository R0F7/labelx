"use client";

import AvatarUpload from "@/components/avatar-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const UserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: z.string().trim().min(1, "Username is required"),
  image: z.any().optional(),
});

type UserFormType = z.infer<typeof UserSchema>;
interface Props {
  user: {
    name: string;
    username: string;
    image?: string | null;
  };
}

export default function GeneralTab({ user }: Props) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name,
      username: user?.username,
    },
  });

  const onSubmit = async (data: UserFormType) => {
    try {
      const formData = new FormData();
      formData.set("name", data.name);
      formData.set("username", data.username);

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      const json = await res.json();

      if (!json?.success) {
        toast.error(json?.message || `Failed to update profile info`);
        setErrorMsg(json?.message)
      } else {
        toast.success(`Profile updated successfully!`);
        router.refresh();
        setErrorMsg(null)
      }
    } catch (error) {
      console.error(error);
      toast.error("A network error occurred.");
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your public identity and data preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Field className="sm:col-span-2">
            <AvatarUpload
              onChange={(file) => {
                setValue("image", file, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input {...register("name")} />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="username">User name</FieldLabel>
            <Input {...register("username")} placeholder="username" />
            <FieldError>{errors.username?.message || errorMsg}</FieldError>
          </Field>

          <div className="sm:col-span-2 text-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Update Info"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
