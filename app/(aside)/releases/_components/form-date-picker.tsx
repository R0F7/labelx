"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormDatePickerProps {
  label: string;
  name: string;
  control: any;
  disabledDays?: (date: Date) => boolean;
}

export default function FormDatePicker({
  label,
  name,
  control,
  disabledDays,
}: FormDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Field className="flex flex-col justify-end">
          <FieldLabel>{label}</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !value && "text-muted-foreground",
                  error && "border-destructive focus-visible:ring-destructive",
                )}
              >
                {value ? (
                  format(new Date(value), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  onChange(date ? date.toISOString() : "");
                  setOpen(false);
                }}
                disabled={disabledDays}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FieldError>{error?.message}</FieldError>
        </Field>
      )}
    />
  );
}
