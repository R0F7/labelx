"use client";

import AvatarUpload from "@/components/avatar-upload";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resolveS3Url } from "@/lib/s3-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const LabelSchema = z.object({
  name: z.string().trim().min(1, "Label name is required"),
  logo: z.any().optional(),
});

type LabelFormType = z.infer<typeof LabelSchema>;

export default function AddLabel({ labelData }: { labelData?: any | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = !!labelData;
  const [isOpen, setIsOpen] = useState(false);
  const currentParams = new URLSearchParams(searchParams.toString());

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LabelFormType>({
    resolver: zodResolver(LabelSchema),
    defaultValues: {
      name: "",
      logo: undefined,
    },
  });

  useEffect(() => {
    if (labelData) {
      reset({
        name: labelData.name,
      });

      setIsOpen(true);
    } else {
      reset({ name: "" });
    }
  }, [labelData, reset]);

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen && isEditMode) {
      router.push("/labels", { scroll: false });
    }
  };

  const onSubmit = async (data: LabelFormType) => {
    try {
      const formData = new FormData();
      formData.set("name", data.name);

      if (data.logo) {
        formData.append("logo", data.logo);
      }

      const url = isEditMode ? `/api/labels/${labelData.id}` : "/api/labels";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, { method: method, body: formData });
      const json = await res.json();

      if (!json?.success) {
        toast.error(
          json?.message || `Failed to ${isEditMode ? "update" : "add"} label`,
        );
      } else {
        toast.success(
          `Label ${isEditMode ? "updated" : "added"} successfully!`,
        );
        reset();

        if (isEditMode) {
          currentParams.delete("edit");

          router.replace(
            `/labels${currentParams.toString() ? `?${currentParams.toString()}` : ""}`,
            { scroll: false },
          );
        } else {
          setIsOpen(false);
        }

        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("A network error occurred.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button>Add Label</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Label</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the fields below to modify label details."
                : "Fill the form below to add a new label and their logo"}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <AvatarUpload
                onChange={(file) => {
                  setValue("logo", file, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                defaultValue={
                  isEditMode && labelData.logo ? resolveS3Url(labelData.logo) : undefined
                }
              />
            </Field>

            <Field>
              <FieldLabel>Label Name</FieldLabel>
              <Input {...register("name")} placeholder="e.g. Radiohead" />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Label"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
