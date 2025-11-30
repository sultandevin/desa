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
  SheetClose,
  SheetFooter,
  SheetInnerContent,
  SheetInnerSection,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { orpc, queryClient } from "@/utils/orpc";

interface KeputusanCreateFormProps {
  onSuccess?: () => void;
}

const KeputusanCreateForm = ({ onSuccess }: KeputusanCreateFormProps) => {
  const keputusanMutation = useMutation(
    orpc.decision.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.decision.key(),
        });
        toast.success("Keputusan berhasil ditambahkan!");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Gagal menambahkan keputusan: ${error.message}`);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      number: "",
      date: "",
      regarding: "",
      shortDescription: "",
      reportNumber: "",
      reportDate: "",
      notes: "",
      file: null as File | null, // Tambahkan state untuk file
    },
    onSubmit: ({ value }) => {
      if (
        !value.number?.trim() ||
        !value.date ||
        !value.regarding?.trim() ||
        !value.reportNumber?.trim() ||
        !value.reportDate
      ) {
        toast.error("Mohon lengkapi field bertanda bintang (*)");
        return;
      }

      const submitData = async () => {
        let fileId: string | undefined;

        if (value.file) {
          try {
            const formData = new FormData();
            formData.append("file", value.file);

            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              toast.error("Gagal mengupload file");
              return;
            }

            const data = await res.json();
            fileId = data.id;
          } catch (error) {
            console.error("Upload error:", error);
            toast.error("Terjadi kesalahan saat upload file");
            return;
          }
        }

        // Pastikan backend (orpc.decision.create) mendukung properti 'file'
        keputusanMutation.mutate({
          number: value.number.trim(),
          date: value.date,
          regarding: value.regarding.trim(),
          shortDescription: value.shortDescription?.trim() || null,
          reportNumber: value.reportNumber.trim(),
          reportDate: value.reportDate,
          notes: value.notes?.trim() || null,
          file: fileId, // Kirim file ke backend
        });
      };

      submitData();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
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
                    <span className="text-destructive">*</span> Nomor Keputusan
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
                    <span className="text-destructive">*</span> Tanggal
                    Keputusan
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
                    <span className="text-destructive">*</span> Tentang
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

          {/* Input File Baru */}
          <form.Field
            name="file"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Lampiran File</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    id={field.name}
                    type="file"
                    // Hanya menerima PDF
                    accept=".pdf,application/pdf"
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.handleChange(file);
                    }}
                    className="cursor-pointer file:mr-4 file:cursor-pointer file:text-primary"
                  />
                </div>
                <FieldDescription>Format yang didukung: PDF</FieldDescription>
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
                  onBlur={field.handleBlur}
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
        </SheetInnerSection>

        <SheetInnerSection>
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
        <Button type="submit" disabled={keputusanMutation.isPending}>
          {keputusanMutation.isPending ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Plus className="mr-2 size-4" />
              Tambah
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

export { KeputusanCreateForm };
