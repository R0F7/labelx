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

interface AsyncDataItem {
  id: number | string;
  name: string;
}

interface AsyncCmdboxProps {
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  watcher: string | undefined;
  data: AsyncDataItem[];
  placeholder: string;
  searchPlaceholder: string;
  emptyPlaceholder: string;
  onSearchChange: (value: string) => void;
  setValue: UseFormSetValue<any>;
  setValueName: string;
  errors: FieldErrors<any>;
}

export default function AsyncCmdbox({
  label,
  open,
  setOpen,
  watcher,
  data = [],
  placeholder,
  searchPlaceholder,
  emptyPlaceholder,
  onSearchChange,
  setValue,
  setValueName,
  errors,
}: AsyncCmdboxProps) {
  const getNestedError = (errors: any, path: string) => {
    return path.split(".").reduce((obj, key) => obj?.[key], errors);
  };

  const fieldError = getNestedError(errors, setValueName);

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
              !watcher && "text-muted-foreground",
            )}
          >
            {watcher
              ? data.find((d) => d.id.toString() === watcher)?.name || watcher
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align="start">
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
                      setValue(setValueName, item.id.toString(), {
                        shouldValidate: true,
                      });
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          item.id.toString() === watcher
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

      {/* <FieldError>
        {(errors?.[setValueName] as any)?.message ||
          (errors?.artists as any)?.[setValueName.split(".")[1]]?.[
            setValueName.split(".")[2]
          ]?.message}
      </FieldError> */}
      <FieldError>{fieldError?.message}</FieldError>
    </Field>
  );
}
