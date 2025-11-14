"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader, Plus, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
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
  const mutation = useMutation(
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
    })
  );

  const form = useForm({
    defaultValues: {
      number: "",
      date: new Date().toISOString().split("T")[0],
      regarding: "",
      shortDescription: "",
      reportNumber: "",
      reportDate: "",
      notes: "",
      file: null as File | null, // Tambahkan state untuk file
    },
    onSubmit: async ({ value }) => {
      if (!value.number || !value.date || !value.regarding) {
        toast.error("Mohon lengkapi field bertanda bintang (*)");
        return;
      }

      // Pastikan backend (orpc.decision.create) mendukung properti 'file'
      mutation.mutate({
        number: value.number,
        date: new Date(value.date).toISOString(),
        regarding: value.regarding,
        shortDescription: value.shortDescription || null,
        reportNumber: value.reportNumber || null,
        reportDate: value.reportDate ? new Date(value.reportDate).toISOString() : null,
        notes: value.notes || null,
        file: value.file, // Kirim file ke backend
      });
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
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  <span className="text-destructive">*</span> Nomor Keputusan
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Nomor surat keputusan"
                  required
                />
              </Field>
            )}
          />

          <form.Field
            name="date"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  <span className="text-destructive">*</span> Tanggal Keputusan
                </FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </Field>
            )}
          />

          <form.Field
            name="regarding"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  <span className="text-destructive">*</span> Tentang
                </FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Perihal keputusan..."
                  required
                  rows={3}
                />
              </Field>
            )}
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
                    // Menerima PDF, CSV, Word (.doc, .docx)
                    accept=".pdf,.csv,.doc,.docx,application/pdf,text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.handleChange(file);
                    }}
                    className="cursor-pointer file:cursor-pointer file:text-primary"
                  />
                </div>
                <FieldDescription>
                  Format yang didukung: PDF, CSV, Word. Maksimal ukuran file tergantung server.
                </FieldDescription>
              </Field>
            )}
          />

          <form.Field
            name="shortDescription"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Uraian Singkat</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ringkasan isi keputusan..."
                  rows={2}
                />
              </Field>
            )}
          />
        </SheetInnerSection>

        <SheetInnerSection>
          <h3 className="mb-2 font-semibold text-sm text-muted-foreground">
            Laporan (Opsional)
          </h3>
          <form.Field
            name="reportNumber"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Nomor Dilaporkan</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Nomor laporan terkait"
                />
              </Field>
            )}
          />

          <form.Field
            name="reportDate"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Tanggal Dilaporkan</FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          />
        </SheetInnerSection>

        <SheetInnerSection>
          <form.Field
            name="notes"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Keterangan</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Catatan tambahan..."
                />
              </Field>
            )}
          />
        </SheetInnerSection>
      </SheetInnerContent>

      <SheetFooter className="grid shrink-0 grid-cols-1 gap-2 border-t bg-background p-4 sm:grid-cols-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader className="animate-spin mr-2 size-4" />
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