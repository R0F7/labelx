"use client";

import * as React from "react";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
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
  name: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  watcher: string | undefined;
  data: DataItem[];
  placeholder: string;
  searchPlaceholder: string;
  emptyPlaceholder: string;
  setValue: UseFormSetValue<any>;
  setValueName: string;
  errors: FieldErrors<any>;
}

export default function Cmdbox({
  name,
  open,
  setOpen,
  watcher,
  data = [],
  placeholder,
  searchPlaceholder,
  emptyPlaceholder,
  setValue,
  setValueName,
  errors,
}: CmdboxProps) {
  return (
    <Field className="flex flex-col">
      <FieldLabel>{name}</FieldLabel>

      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between font-normal",
              !watcher && "text-muted-foreground",
            )}
          >
            {watcher
              ? data.find((d) => d.value === watcher)?.label
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
                      setValue(setValueName, d.value, {
                        shouldValidate: true,
                      });
                      setOpen(false);
                    }}
                    className="w-full"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        d.value === watcher ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {d.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <FieldError>{(errors?.[setValueName] as any)?.message}</FieldError>
    </Field>
  );
}
