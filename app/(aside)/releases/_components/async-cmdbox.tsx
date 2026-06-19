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

interface AsyncDataItem {
  id: number | string;
  name: string;
}

interface AsyncCmdboxProps {
  label: string;
  name: string;
  control: any;
  data: AsyncDataItem[];
  placeholder: string;
  searchPlaceholder: string;
  emptyPlaceholder: string;
  onSearchChange: (value: string) => void;
}

export default function AsyncCmdbox({
  label,
  name,
  control,
  data = [],
  placeholder,
  searchPlaceholder,
  emptyPlaceholder,
  onSearchChange,
}: AsyncCmdboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const errorMessage = error?.message || (error as any)?.id?.message;

        return (
          <Field className="flex flex-col">
            <FieldLabel>{label}</FieldLabel>

            <Popover open={open} onOpenChange={setOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between font-normal text-left",
                    !value?.id && "text-muted-foreground",
                    errorMessage &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                >
                  {value?.id ? value.name : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="p-0"
                align="start"
              >
                <Command shouldFilter={false} className="w-full">
                  <CommandInput
                    onValueChange={onSearchChange}
                    placeholder={searchPlaceholder}
                    className="w-full"
                  />
                  <CommandList className="w-full">
                    <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
                    <CommandGroup className="w-full">
                      {data?.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.name}
                          onSelect={() => {
                            onChange({
                              id: item.id.toString(),
                              name: item.name,
                            });
                            setOpen(false);
                          }}
                          className="w-full flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                item.id.toString() === value?.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {item.name}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <FieldError>{errorMessage}</FieldError>
          </Field>
        );
      }}
    />
  );
}
