"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PencilSimple } from "@phosphor-icons/react";
import { updateTicketAction } from "./actions";
import { toast } from "sonner";

const ticketUpdateSchema = z.object({
  status: z.string().min(1, "Status is required"),
  message: z.string().optional().or(z.literal("")), 
});

export type TicketUpdateSchema = z.infer<typeof ticketUpdateSchema>;

interface UpdateTicketProps {
  ticketId: number;
  currentStatus: string;
}

export default function UpdateTicket({
  ticketId,
  currentStatus,
}: UpdateTicketProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketUpdateSchema>({
    resolver: zodResolver(ticketUpdateSchema),
    defaultValues: {
      status: currentStatus || "pending",
      message: "",
    },
  });

  const onSubmit = async (data: TicketUpdateSchema) => {
    try {
      const res = await updateTicketAction(ticketId, data);
      if (res.success) {
        toast.success(res.message);
        reset({ status: data.status, message: "" });
        setIsOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full cursor-pointer">
          <PencilSimple size={16} /> Update Ticket
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Ticket</DialogTitle>
          <DialogDescription>
            Make changes to this ticket's details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.status?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Internal Message / Reply</FieldLabel>
              <Textarea
                placeholder="Type why you are updating or write a reply..."
                {...register("message")}
              />
              <FieldError>{errors.message?.message}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
