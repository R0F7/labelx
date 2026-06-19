"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  name: string;         
  control: any;        
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export default function FormSelect({
  label,
  name,
  control,
  options = [],
  placeholder = "Select an option",
  className,
}: FormSelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Field className={cn("flex flex-col", className)}>
          <FieldLabel>{label}</FieldLabel>
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={cn(error && "border-destructive focus:ring-destructive")}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError>{error?.message}</FieldError>
        </Field>
      )}
    />
  );
}