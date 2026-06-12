"use client";

import { useId, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Organization } from "better-auth/plugins";

const TeamSwitcher = ({ organizations }: { organizations: Organization[] }) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const selectedOrg = organizations?.find((org) => org.name === value);

  return (
    <div className="w-full space-y-2">
      <input type="text" name="organizationId" hidden readOnly defaultValue={selectedOrg?.id} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedOrg ? (
              <span className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage
                    src={selectedOrg?.logo!}
                    alt={selectedOrg.name}
                  />
                  <AvatarFallback>{selectedOrg.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{selectedOrg.name}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select user</span>
            )}
            <ChevronsUpDownIcon
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search organization..." />
            <CommandList>
              <CommandEmpty>No organizations found.</CommandEmpty>
              <CommandGroup>
                {organizations?.map((org) => (
                  <CommandItem
                    key={org.name}
                    value={org.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src={org.logo!} alt={org.name} />
                        <AvatarFallback>{org.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="flex flex-col">
                        <span className="font-medium">{org.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {org.slug}
                        </span>
                      </span>
                    </span>
                    {value === org.name && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { TeamSwitcher };
