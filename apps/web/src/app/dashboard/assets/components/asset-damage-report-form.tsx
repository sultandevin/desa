"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";
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

interface AssetDamageReportFormProps {
  assetId: string;
  assetName: string;
  assetCode?: string;
  onSuccess?: () => void;
}

const AssetDamageReportForm = ({
  assetId,
  assetName,
  assetCode,
  onSuccess,
}: AssetDamageReportFormProps) => {
  const form = useForm({
    defaultValues: {
      description: "",
      status: "" as "SEVERE" | "MILD" | "MINIMAL" | "",
    },
    onSubmit: ({ value }) => {
      if (!value.description || !value.status) {
        toast.error("Mohon lengkapi semua field yang wajib diisi");
        return;
      }

      damageReportMutation.mutate({
        assetId: assetId,
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
          <Field>
            <FieldLabel>Aset</FieldLabel>
            <Input
              value={`${assetName}${assetCode ? ` (${assetCode})` : ""}`}
              disabled
              className="bg-muted"
            />
            <FieldDescription>
              Aset yang akan dilaporkan kerusakannya
            </FieldDescription>
          </Field>

          <form.Field
            name="description"
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
                    onValueChange={(value) => field.handleChange(value as typeof field.state.value)}
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
                  <FieldDescription>
                    Tingkat kerusakan aset
                  </FieldDescription>
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
              Laporkan Kerusakan
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

export { AssetDamageReportForm };
