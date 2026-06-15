import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { resolveS3Url } from "@/lib/s3-client";

type Label = {
  id: number;
  logo: string;
  name: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
//   createdByName: string;
//   organizationName: string;
};

export default function LabelDetails({ label }: { label: Label }) {
  console.log(label);
  return (
    <div className="max-w-lg mx-auto space-y-4 p-4">
      {/* Header */}
      <Card className="p-6 flex items-center gap-4">
        <Avatar className="w-16 h-16 border">
          <AvatarImage
            src={label.logo ? resolveS3Url(label.logo) : ""}
            alt={label.name}
          />
          <AvatarFallback>
            {label.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h1 className="text-xl font-semibold">{label.name}</h1>
          <p className="text-sm text-muted-foreground">Label ID: #{label.id}</p>
        </div>
      </Card>
{/* 
      <Card>
        <p>{label.organizationName}</p>
        <p>{label.createdByName}</p>
      </Card> */}

      {/* Meta Info */}
      <Card className="flex flex-col md:flex-row justify-between p-4 text-sm text-muted-foreground space-y-1">
        <p>
          Created:{" "}
          {label.createdAt ? new Date(label.createdAt).toLocaleString() : "N/A"}
        </p>
        <p>
          Updated:{" "}
          {label.updatedAt ? new Date(label.updatedAt).toLocaleString() : "N/A"}
        </p>
      </Card>
    </div>
  );
}
