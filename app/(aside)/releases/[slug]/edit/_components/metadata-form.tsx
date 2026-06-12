import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";

function MetadataForm() {
  return (
    <>
      <section className="w-full">
        <Card>
            <CardHeader>
                <CardTitle>Release Metadata</CardTitle>
                <CardDescription>Fill in the metadata for the release</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Release Title</FieldLabel>
                                <Input/>
                            </Field>
                            <Field>
                                <FieldLabel>Title Version</FieldLabel>
                                <Input/>
                            </Field>
                            <Field>
                                <FieldLabel>Primary Genre</FieldLabel>
                                <Input/>
                            </Field>
                            <Field>
                                <FieldLabel>Secondary Genre</FieldLabel>
                                <Input/>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>
            </CardContent>
        </Card>
      </section>
    </>
  );
}

export default MetadataForm;
