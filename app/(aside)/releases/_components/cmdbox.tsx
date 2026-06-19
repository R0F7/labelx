"use client";

import * as React from "react";
import { Controller } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DataItem {
  label: string;
  value: string;
}

interface CmdboxProps {
  label: string;      
  name: string;       
  control: any;       
  data: DataItem[];
  placeholder: string;
  searchPlaceholder: string;
  emptyPlaceholder: string;
}

export default function Cmdbox({
  label,
  name,
  control,
  data = [],
  placeholder,
  searchPlaceholder,
  emptyPlaceholder,
}: CmdboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Field className="flex flex-col">
          <FieldLabel>{label}</FieldLabel>

          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between font-normal text-left",
                  !value && "text-muted-foreground",
                  error && "border-destructive focus-visible:ring-destructive"
                )}
              >
                {value
                  ? data.find((d) => d.value === value)?.label || value
                  : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0" align="start">
              <Command className="w-full">
                <CommandInput placeholder={searchPlaceholder} className="w-full" />
                <CommandList className="w-full">
                  <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
                  <CommandGroup className="w-full">
                    {data.map((d) => (
                      <CommandItem
                        key={d.value}
                        value={d.label}
                        onSelect={() => {
                          onChange(d.value);
                          setOpen(false);
                        }}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              d.value === value ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {d.label}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FieldError>{error?.message}</FieldError>
        </Field>
      )}
    />
  );
}