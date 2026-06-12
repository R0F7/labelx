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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewTicket } from "./actions";
import { toast } from "sonner";
import { useState } from "react";

const ticketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

export type TicketSchema = z.infer<typeof ticketSchema>;

export function CreateTicket() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketSchema>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      category: "",
      description: "",
    },
  });
  const onSubmit = async (data: TicketSchema) => {
    const res = await createNewTicket(data);
    if (res.success) {
      toast.success(res.message);
      reset();
      setIsOpen(false);
    } else {
      toast.error(res.message);
      setIsOpen(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Create New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Ticket</DialogTitle>
          <DialogDescription>
            Fill the form below to create a new ticket
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Subject</FieldLabel>
            <Input {...register("subject")} required />
            <FieldError>{errors.subject?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Category</FieldLabel>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  required
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="Distribution"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Distribution">Distribution</SelectItem>
                    <SelectItem value="Royalties">Royalties</SelectItem>
                    <SelectItem value="Takedown">Takedown</SelectItem>
                    <SelectItem value="ID Mapping">ID Mapping</SelectItem>
                    <SelectItem value="Store Link">Store Link</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.category?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea required {...register("description")} />
            <FieldError>{errors.description?.message}</FieldError>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            Create Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
