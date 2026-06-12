// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Field, FieldGroup } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import AvatarUpload from "@/components/upload-avatar";
// import { FileMetadata } from "@/hooks/use-file-upload";
// import { useRouter } from "next/navigation";
// import { useState, useTransition } from "react";
// import { toast } from "sonner";

// export default function AddLabel() {
//   const [logoFile, setLogoFile] = useState<FileMetadata | File | undefined>(
//     undefined,
//   );
//   const [labelName, setLabelName] = useState<string>("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [pending, startTransition] = useTransition();
//   const router = useRouter();

//   const handleSubmit = startTransition(async () => {
//     if (!labelName) {
//       toast.error("Label name is required");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("labelName", labelName);
//     if (logoFile) {
//       formData.append("logoFile", logoFile as File);
//     }
//     const res = await fetch("/api/labels", {
//       method: "POST",
//       body: formData,
//     });
//     const data = await res.json();
//     if (data.success) {
//       toast.success("Label added successfully");
//       setIsOpen(false);
//       setLabelName("");
//       setLogoFile(undefined);
//       router.refresh();
//     } else {
//       toast.error(data.message);
//     }
//   });

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <form>
//         <DialogTrigger asChild>
//           <Button>Add Label</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-sm">
//           <DialogHeader>
//             <DialogTitle>Add Label</DialogTitle>
//             <DialogDescription>
//               Fill the form below to add a new label
//             </DialogDescription>
//           </DialogHeader>
//           <FieldGroup>
//             <Field>
//               <AvatarUpload onFileChange={(file) => setLogoFile(file?.file)} />
//             </Field>
//             <Field>
//               <Label htmlFor="name-1">Label Name</Label>
//               <Input
//                 required
//                 id="name-1"
//                 name="name"
//                 value={labelName}
//                 onChange={(e) => setLabelName(e.target.value)}
//               />
//             </Field>
//           </FieldGroup>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button type="submit" onClick={handleSubmit} disabled={pending}>
//               {pending ? "Adding..." : "Add Label"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </form>
//     </Dialog>
//   );
// }

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
import { useRouter } from "next/navigation";
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
  const isEditMode = !!labelData;
  const [isOpen, setIsOpen] = useState(false);

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

      const res = await fetch("/api/labels", {
        method: "POST",
        body: formData,
      });

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
        router.refresh();
        setIsOpen(false);
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
                  isEditMode ? resolveS3Url(labelData.logo) : undefined
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
