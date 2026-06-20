"use client";

import { useWatch } from "react-hook-form";
import { allStores } from "../../data/data";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function SelectStores({ formMethods }: { formMethods: any }) {
  const { control, setValue } = formMethods;

  const selectedStores = useWatch({
    control,
    name: "stores",
    defaultValue: []
  });

  const toggleStore = (storeName: string) => {
    const isSelected = selectedStores.includes(storeName);
    const updated = isSelected
      ? selectedStores.filter((s: string) => s !== storeName)
      : [...selectedStores, storeName];
    setValue("stores", updated);
  };

  const toggleSelectAll = () => {
    if (selectedStores.length === allStores.length) {
      setValue("stores", []);
    } else {
      setValue("stores", allStores.map((s) => s.name));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Stores</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Select All Button */}
        <div
          onClick={toggleSelectAll}
          className={cn(
            "p-3 border text-center flex flex-col items-center justify-center transition-all cursor-pointer border-border text-sm font-medium hover:bg-primary/5",
            selectedStores.length === allStores.length && "border-primary bg-primary/10 ring-1 ring-primary"
          )}
        >
          <span>Select All</span>
        </div>

        {/* Store Buttons */}
        {allStores.map((store) => {
          const isSelected = selectedStores.includes(store.name);
          return (
            <div
              key={store.id}
              onClick={() => toggleStore(store.name)}
              className={cn(
                "p-3 border text-center flex flex-col items-center justify-center transition-all cursor-pointer border-border text-sm font-medium hover:bg-primary/5",
                isSelected && "border-primary bg-primary/10 ring-1 ring-primary"
              )}
            >
              <div className="h-8 w-8 mb-2 relative">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <span>{store.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}