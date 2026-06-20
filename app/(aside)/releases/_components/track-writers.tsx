import { useState } from "react";
import { useFieldArray, Control, FieldErrors } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface TrackWritersProps {
  control: Control<any>;
  trackIndex: number;
  errors: FieldErrors<any>;
}

export const TrackWriters = ({
  control,
  trackIndex,
  errors,
}: TrackWritersProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `tracks.${trackIndex}.writers`,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [tempRole, setTempRole] = useState("");
  const [tempName, setTempName] = useState("");
  const [modalErrors, setModalErrors] = useState({ role: "", name: "" });

  const handleAddWriter = () => {
    let hasError = false;
    const newErrors = { role: "", name: "" };

    if (!tempRole) {
      newErrors.role = "Role is required";
      hasError = true;
    }
    if (!tempName.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    if (hasError) {
      setModalErrors(newErrors);
      return;
    }

    append({ role: tempRole, name: tempName.trim() });
    setTempRole("");
    setTempName("");
    setModalErrors({ role: "", name: "" });
    setIsOpen(false);
  };

  const writerError = errors?.tracks?.[trackIndex]?.writers?.message;

  return (
    <div
      className={cn(
        "space-y-2 border rounded-md p-4 bg-card",
        writerError ? "border-destructive" : "border-border",
      )}
    >
      <h3 className="text-base font-medium text-foreground">
        Writers / Publishers
      </h3>

      <div className="flex flex-wrap gap-2">
        {fields.map((field: any, index) => (
          <span
            key={field.id}
            className="flex items-center gap-1 rounded-md bg-muted px-3 py-1 text-sm border border-border"
          >
            <strong>{field.role}</strong> — {field.name}
            <button
              type="button"
              onClick={() => remove(index)}
              className="hover:text-destructive ml-1"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Writers
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Writer / Publisher</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field>
              <FieldLabel>Role *</FieldLabel>
              <Select
                value={tempRole}
                onValueChange={(v) => {
                  setTempRole(v);
                  setModalErrors((p) => ({ ...p, role: "" }));
                }}
              >
                <SelectTrigger
                  className={modalErrors.role ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Composer",
                    "Lyricist",
                    "Arranger",
                    "Producer",
                    "Publisher",
                  ].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{modalErrors.role}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Name *</FieldLabel>
              <Input
                value={tempName}
                onChange={(e) => {
                  setTempName(e.target.value);
                  setModalErrors((p) => ({ ...p, name: "" }));
                }}
                placeholder="e.g. Jhon Doe"
                className={modalErrors.name ? "border-destructive" : ""}
              />
              <FieldError>{modalErrors.name}</FieldError>
            </Field>
          </div>
          <DialogFooter>
            <Button onClick={handleAddWriter}>Add to Track</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {typeof writerError === "string" && (
        <p className="text-xs font-medium text-destructive mt-2">
          {writerError}
        </p>
      )}
    </div>
  );
};
