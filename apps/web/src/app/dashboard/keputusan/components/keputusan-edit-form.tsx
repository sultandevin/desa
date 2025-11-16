"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, Edit } from "lucide-react";
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
  SheetClose,
  SheetFooter,
  SheetInnerContent,
  SheetInnerSection,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { orpc, queryClient } from "@/utils/orpc";

interface KeputusanEditFormProps {
  keputusanId: string;
  onSuccess?: () => void;
}

const KeputusanEditForm = ({ keputusanId, onSuccess }: KeputusanEditFormProps) => {
  const keputusanQuery = useQuery(
    orpc.decision.find.queryOptions({
      input: { id: keputusanId }
    })
  );

  const keputusanMutation = useMutation(
    orpc.decision.update.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: orpc.decision.key(),
        });
        toast.success(`Keputusan ${variables.number} berhasil diperbarui!`);
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Update keputusan error:", error);
        toast.error(`Gagal memperbarui keputusan: ${error.message}`);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      number: keputusanQuery.data?.number || "",
      date: keputusanQuery.data?.date || "",
      regarding: keputusanQuery.data?.regarding || "",
      shortDescription: keputusanQuery.data?.shortDescription || "",
      reportNumber: keputusanQuery.data?.reportNumber || "",
      reportDate: keputusanQuery.data?.reportDate || "",
      notes: keputusanQuery.data?.notes || "",
      file: null as File | null,
    },
    onSubmit: ({ value }) => {
      if (!value.number.trim() || !value.date || !value.regarding.trim() ||
          !value.reportNumber.trim() || !value.reportDate) {
        toast.error("Mohon lengkapi field bertanda bintang (*)");
        return;
      }

      keputusanMutation.mutate({
        id: keputusanId,
        number: value.number.trim(),
        date: value.date,
        regarding: value.regarding.trim(),
        shortDescription: value.shortDescription?.trim() || null,
        reportNumber: value.reportNumber.trim(),
        reportDate: value.reportDate,
        notes: value.notes?.trim() || null,
        // file: value.file,
      });
    },
  });

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
            name="number"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Nomor Keputusan
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="001/KEP/DS/2025"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="date"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Tanggal Keputusan
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    max="2100-12-31"
                    min="1990-01-01"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="regarding"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Tentang
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Perihal keputusan..."
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/* Input File */}
          <form.Field
            name="file"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Lampiran File</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    id={field.name}
                    type="file"
                    accept=".pdf,application/pdf"
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.handleChange(file);
                    }}
                    className="cursor-pointer file:cursor-pointer file:text-primary file:mr-4"
                  />
                </div>
                <FieldDescription>
                  Format yang didukung: PDF. Maksimal ukuran file: 10MB.
                </FieldDescription>
              </Field>
            )}
          />

          <form.Field
            name="shortDescription"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Uraian Singkat
                  <span className="font-normal text-gray-500"> (opsional)</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ringkasan isi keputusan..."
                  autoComplete="off"
                />
              </Field>
            )}
          />
        </SheetInnerSection>

        <SheetInnerSection>
          <h3 className="mb-2 font-semibold text-sm text-muted-foreground">
            Laporan 
          </h3>
          <form.Field
            name="reportNumber"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Nomor Dilaporkan
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="LAP-01/2025"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="reportDate"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    <span className="text-destructive">*</span>
                    Tanggal Dilaporkan
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    max="2100-12-31"
                    min="1990-01-01"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="notes"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Keterangan
                    <span className="font-normal text-gray-500"> (opsional)</span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Catatan tambahan mengenai keputusan jika ada"
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
        <Button type="submit" disabled={keputusanMutation.isPending}>
          {keputusanMutation.isPending ? (
            <>
              <Loader className="animate-spin mr-2 size-4" />
              Menyimpan...
            </>
          ) : (
            <>
              <Edit className="mr-2 size-4" />
              Perbarui
            </>
          )}
        </Button>
        <SheetClose asChild>
          <Button variant="outline">Batal</Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};

export { KeputusanEditForm };