"use client";

import { useWatch } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReviewRelease({ formMethods }: { formMethods: any }) {
  const { control } = formMethods;
  const formData = useWatch({ control });

  if (!formData) return null;

  const Field = ({ label, value }: { label: string; value: any }) => (
    <div>
      <p className="text-muted-foreground text-[10px] uppercase font-bold">{label}</p>
      <p className="text-sm font-medium break-words">{value ?? "N/A"}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Full Release Review</h2>

      {/* 1. Metadata / Release Info */}
      <Card className="pt-0">
        <CardHeader className="bg-muted py-3"><CardTitle className="text-sm">Release Metadata</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
          <Field label="Release Title" value={formData.releaseTitle} />
          <Field label="Version" value={formData.titleVersion} />
          <Field label="Language" value={formData.metadataLanguage} />
          <Field label="Release Type" value={formData.releaseType} />
          <Field label="Primary Genre" value={formData.primaryGenre} />
          <Field label="Secondary Genre" value={formData.secondaryGenre} />
          <Field label="UPC" value={formData.upc} />
          <Field label="Label" value={formData.labelData?.name} />
          <Field label="Original Date" value={formData.originalReleaseDate} />
          <Field label="Digital Date" value={formData.releaseDate} />
        </CardContent>
      </Card>

      {/* 2. Primary Artists */}
      <Card className="pt-0">
        <CardHeader className="bg-muted py-3"><CardTitle className="text-sm">Artists</CardTitle></CardHeader>
        <CardContent>
          {formData.artists?.map((a: any, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <Badge variant="outline">{a.artistData.name}</Badge>
              <span className="text-xs text-muted-foreground self-center">({a.artistType})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Tracks Details (Full Breakdown) */}
      <Card className="pt-0">
        <CardHeader className="bg-muted py-3"><CardTitle className="text-sm">Tracks ({formData.tracks?.length})</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {formData.tracks?.map((t: any, i: number) => (
            <div key={i} className="border-b pb-4 last:border-0 space-y-3">
              <div className="flex justify-between">
                <p className="font-bold text-base">{t.title} <span className="text-xs font-normal">({t.trackVersion})</span></p>
                <Badge variant="secondary">{t.isrc}</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <Field label="Duration" value={`${t.duration}s`} />
                <Field label="Genre" value={t.primaryGenre} />
                <Field label="Origin" value={t.trackOrigin} />
                <Field label="Language" value={t.trackLanguage} />
                <Field label="Explicit" value={t.explicitContent} />
                <Field label="Instrumental" value={t.isInstrumental ? "Yes" : "No"} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Writers</p>
                <div className="flex flex-wrap gap-2">
                  {t.writers?.map((w: any, idx: number) => (
                    <div key={idx} className="bg-muted px-2 py-1 rounded text-xs">
                      <span className="font-bold">{w.role}:</span> {w.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Stores */}
      <Card className="pt-0">
        <CardHeader className="bg-muted py-3"><CardTitle className="text-sm">Selected Stores</CardTitle></CardHeader>
        <CardContent className="pt-4 flex flex-wrap gap-2">
          {formData.stores?.map((store: string) => (
            <Badge key={store} variant="secondary">{store}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}