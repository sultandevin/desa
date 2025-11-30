"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Edit, Loader } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
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

const KeputusanEditForm = ({
  keputusanId,
  onSuccess,
}: KeputusanEditFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const keputusanQuery = useQuery(
    orpc.decision.find.queryOptions({
      input: { id: keputusanId },
    }),
  );

  const keputusanMutation = useMutation(
    orpc.decision.update.mutationOptions({
      onSuccess: (_, variables) => {
        setIsSubmitting(false); 
        queryClient.invalidateQueries({
          queryKey: orpc.decision.key(),
        });
        toast.success(`Keputusan ${variables.number} berhasil diperbarui!`);
        onSuccess?.();
      },
      onError: (error) => {
        setIsSubmitting(false); 
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
      // file: null as File | null,
      file: keputusanQuery.data?.file || null,
    },
    onSubmit: async ({ value }) => {
      if (
        !value.number.trim() ||
        !value.date ||
        !value.regarding.trim() ||
        !value.reportNumber.trim() ||
        !value.reportDate
      ) {
        toast.error("Mohon lengkapi field bertanda bintang (*)");
        return;
      }

      const trimmedNumber = value.number.trim();
      const trimmedReportNumber = value.reportNumber.trim();

      if (!/^[a-zA-Z0-9\s\/\-\.()&\[\]]+$/.test(trimmedNumber)) {
        toast.error("Nomor keputusan hanya boleh huruf, angka, spasi, dan karakter: / - . ( ) & [ ]");
        return;
      }

      if (!/^[a-zA-Z0-9\s\/\-\.()&\[\]]+$/.test(trimmedReportNumber)) {
        toast.error("Nomor laporan hanya boleh huruf, angka, spasi, dan karakter: / - . ( ) & [ ]");
        return;
      }

      if (value.date && value.reportDate) {
        const decisionDate = new Date(value.date);
        const reportDate = new Date(value.reportDate);
        if (reportDate < decisionDate) {
          toast.error("Tanggal laporan tidak boleh lebih awal dari tanggal keputusan");
          return;
        }
      }

      if (keputusanMutation.isPending) {
        return;
      }

      setIsSubmitting(true);

      let fileId: string | null = value.file;

      try {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            toast.error("Upload file gagal");
            setIsSubmitting(false);
            return;
          }

          const data = await res.json();
          fileId = data.id;
        }

        keputusanMutation.mutate({
          id: keputusanId,
          number: trimmedNumber,
          date: value.date,
          regarding: value.regarding.trim(),
          shortDescription: value.shortDescription?.trim() || null,
          reportNumber: trimmedReportNumber,
          reportDate: value.reportDate,
          notes: value.notes?.trim() || null,
          file: fileId,
        });
      } catch (e) {
        setIsSubmitting(false);
        toast.error("Terjadi kesalahan.");
      }
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
                <div className="space-y-2">
                  <Input
                    id={field.name}
                    type="file"
                    accept=".pdf,application/pdf"
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null;
                      setFile(selectedFile);
                    }}
                    className="cursor-pointer file:mr-4 file:cursor-pointer file:text-primary"
                  />
                  {keputusanQuery.data?.file && !file && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">File tersimpan:</span>

                      {keputusanQuery.data.fileUrl ? (
                        <a
                          href={keputusanQuery.data.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {keputusanQuery.data.file}
                        </a>
                      ) : (
                        <span className="font-medium text-foreground">
                          {keputusanQuery.data.file}
                        </span>
                      )}
                    </div>
                  )}  
                </div>
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
          <h3 className="mb-2 font-semibold text-muted-foreground text-sm">
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
                    <span className="font-normal text-gray-500">
                      {" "}
                      (opsional)
                    </span>
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
        <Button
          type="submit"
          disabled={keputusanMutation.isPending || isSubmitting}
        >
          {keputusanMutation.isPending || isSubmitting ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" />
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
