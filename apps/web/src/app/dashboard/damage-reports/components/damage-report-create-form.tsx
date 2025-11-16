"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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

interface DamageReportCreateFormProps {
  onSuccess?: () => void;
}

const DamageReportCreateForm = ({
  onSuccess,
}: DamageReportCreateFormProps = {}) => {
  // Fetch assets for the dropdown
  const assets = useQuery(
    orpc.asset.list.queryOptions({
      input: { pageSize: 100, query: "" },
    }),
  );

  const form = useForm({
    defaultValues: {
      assetId: "",
      description: "",
      status: "" as "SEVERE" | "MILD" | "MINIMAL" | "",
    },
    onSubmit: ({ value }) => {
      if (!value.assetId || !value.description || !value.status) {
        toast.error("Mohon lengkapi semua field yang wajib diisi");
        return;
      }

      damageReportMutation.mutate({
        assetId: value.assetId,
        description: value.description,
        status: value.status as "SEVERE" | "MILD" | "MINIMAL",
      });
    },
  });

  const damageReportMutation = useMutation(
    orpc.damageReport.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.damageReport.key(),
        });
        toast.success("Laporan kerusakan berhasil ditambahkan!");

        // Reset form
        form.reset();

        // Call onSuccess callback to close dialog
        onSuccess?.();
      },
      onError: (error) => {
        toast.error("Gagal menambahkan laporan kerusakan");
        console.error(error);
      },
    }),
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <SheetInnerContent className="min-w-0 flex-1 overflow-y-auto">
        <SheetInnerSection>
          <form.Field
            name="assetId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Aset
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih aset yang rusak" />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.data?.data.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.name} {asset.code ? `(${asset.code})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Pilih aset yang mengalami kerusakan
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </SheetInnerSection>

        <SheetInnerSection>
          <form.Field
            name="description"
            validators={{
              onBlur: z
                .string()
                .min(10, "Panjang deskripsi minimal 10 karakter"),
            }}
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Deskripsi Kerusakan
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Jelaskan detail kerusakan yang terjadi..."
                    autoComplete="off"
                    rows={5}
                  />
                  <FieldDescription>
                    Jelaskan kondisi kerusakan dengan detail
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="status"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Status Kerusakan
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as typeof field.state.value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat kerusakan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MINIMAL">Ringan</SelectItem>
                      <SelectItem value="MILD">Sedang</SelectItem>
                      <SelectItem value="SEVERE">Parah</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>Tingkat kerusakan aset</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </SheetInnerSection>
      </SheetInnerContent>

      <SheetFooter className="grid shrink-0 grid-cols-1 gap-2 border-t bg-background p-4 sm:grid-cols-2">
        <Button type="submit" disabled={damageReportMutation.isPending}>
          {damageReportMutation.isPending ? (
            <>
              <Loader className="animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <Plus />
              Tambah Laporan
            </>
          )}
        </Button>
        <SheetClose asChild>
          <Button variant="outline">Tutup</Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};

export { DamageReportCreateForm };
