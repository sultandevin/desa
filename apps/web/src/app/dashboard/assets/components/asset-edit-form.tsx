"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, Save } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetClose,
  SheetFooter,
  SheetInnerContent,
  SheetInnerSection,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { orpc, queryClient } from "@/utils/orpc";

const AssetEditForm = ({
  assetId,
  onSuccess,
}: {
  assetId: string;
  onSuccess?: () => void;
}) => {
  const assetQuery = useQuery(
    orpc.asset.find.queryOptions({
      input: { id: assetId },
    }),
  );

  const assetMutation = useMutation(
    orpc.asset.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.asset.key(),
        });
        toast.success("Berhasil memperbarui aset!");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Gagal memperbarui aset");
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      name: "",
      nup: "",
      brandType: "",
      condition: assetQuery.data?.condition || "Baik",
      note: "",
      valueRp: 0,
      acquiredAt: new Date().toISOString().split("T")[0],
    },
    onSubmit: ({ value }) => {
      assetMutation.mutate({
        id: assetId,
        name: value.name,
        nup: value.nup.length === 0 ? undefined : value.nup,
        brandType: value.brandType || undefined,
        condition: value.condition || undefined,
        valueRp: value.valueRp || undefined,
        note: value.note || undefined,
        acquiredAt: value.acquiredAt ? new Date(value.acquiredAt) : undefined,
      });
    },
  });

  // Populate form with existing asset data
  useEffect(() => {
    if (assetQuery.data) {
      const asset = assetQuery.data;
      form.setFieldValue("name", asset.name);
      form.setFieldValue("nup", asset.nup ?? "");
      form.setFieldValue("brandType", asset.brandType ?? "");
      form.setFieldValue("condition", asset.condition ?? "");
      form.setFieldValue("note", asset.note ?? "");
      form.setFieldValue("valueRp", asset.valueRp ? Number(asset.valueRp) : 0);
      form.setFieldValue(
        "acquiredAt",
        asset.acquiredAt
          ? new Date(asset.acquiredAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      );
    }
  }, [assetQuery.data, form.setFieldValue]);

  if (assetQuery.isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  if (assetQuery.isError || !assetQuery.data) {
    return (
      <div className="p-4 text-center text-destructive">
        Gagal memuat data aset
      </div>
    );
  }

  const asset = assetQuery.data;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <SheetInnerContent className="min-w-0 flex-1 overflow-y-auto">
        {/* Metadata Section */}
        <SheetInnerSection>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dibuat pada:</span>
              <span className="font-medium">
                {new Date(asset.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Terakhir diubah:</span>
              <span className="font-medium">
                {new Date(asset.updatedAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </SheetInnerSection>

        {/* Editable Fields */}
        <SheetInnerSection>
          <form.Field
            name="name"
            validators={{
              onBlur: z
                .string()
                .min(3, "Nama aset harus lebih dari 3 karakter"),
            }}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Nama Aset
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Sikil Bau"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="condition"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Kondisi
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                      <SelectValue placeholder="Pilih kondisi aset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baik">Baik</SelectItem>
                      <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                      <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="nup"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>NUP</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="XXXXXX"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="brandType"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Merk/Tipe</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Toyota"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </SheetInnerSection>
        <SheetInnerSection>
          <form.Field
            name="acquiredAt"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Tanggal Perolehan
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={field.state.value}
                    max={new Date().toISOString().split("T")[0]}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="valueRp"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Nilai (Rp)</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                    aria-invalid={isInvalid}
                    placeholder="1000000"
                    autoComplete="off"
                    min="0"
                    step="0.01"
                  />
                  <FieldDescription>Nilai aset dalam Rupiah</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="note"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Catatan</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Catatan tamabahan mengenai aset jika ada"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </SheetInnerSection>
      </SheetInnerContent>

      <SheetFooter className="grid shrink-0 grid-cols-1 gap-2 border-t bg-background p-4 sm:grid-cols-2">
        <Button type="submit" disabled={assetMutation.isPending}>
          {assetMutation.isPending ? (
            <>
              <Loader className="animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <Save />
              Simpan Perubahan
            </>
          )}
        </Button>
        <SheetClose asChild>
          <Button variant={`outline`}>Tutup</Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};

export { AssetEditForm };
