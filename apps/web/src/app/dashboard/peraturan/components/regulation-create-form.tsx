"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  SheetClose,
  SheetFooter,
  SheetInnerContent,
  SheetInnerSection,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { orpc, queryClient } from "@/utils/orpc";

const RegulationCreateForm = () => {
  const [file, setFile] = useState<File | null>(null);

  const regulationMutation = useMutation(
    orpc.regulation.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.regulation.key(),
        });
        toast.success("Peraturan berhasil ditambahkan!");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Gagal membuat peraturan");
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      title: "",
      number: "",
      level: "",
      description: "",
      effectiveBy: new Date().toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      let fileId: string | null = null;

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
            return;
          }

          const data = await res.json();

          fileId = data.id;
        }

        regulationMutation.mutate({
          title: value.title,
          number: value.number,
          level: value.level,
          description: value.description || null,
          effectiveBy: value.effectiveBy
            ? new Date(value.effectiveBy)
            : undefined,
          file: fileId,
        });
      } catch (e) {
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
            name="title"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  <span className="text-destructive">*</span> Judul Peraturan
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Contoh: Peraturan Akademik Mahasiswa"
                />
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />

          <form.Field
            name="number"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  <span className="text-destructive">*</span> Nomor Peraturan
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Nomor 02 Tahun 2025"
                />
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />

          <form.Field
            name="level"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  <span className="text-destructive">*</span> Tingkat Peraturan
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Universitas / Fakultas / Program Studi"
                />
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          />
        </SheetInnerSection>

        <SheetInnerSection>
          <Field>
            <FieldLabel>Upload Dokumen</FieldLabel>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Field>
        </SheetInnerSection>

        <SheetInnerSection>
          <form.Field
            name="description"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Deskripsi singkat mengenai peraturan ini"
                  rows={4}
                />
              </Field>
            )}
          />
        </SheetInnerSection>

        <SheetInnerSection>
          <form.Field
            name="effectiveBy"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Tanggal Berlaku</FieldLabel>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          />
        </SheetInnerSection>
      </SheetInnerContent>

      <SheetFooter className="grid shrink-0 grid-cols-1 gap-2 border-t bg-background p-4 sm:grid-cols-2">
        {regulationMutation.isPending ? (
          <Button type="submit" disabled>
            <Loader className="animate-spin" />
            Menyimpan...
          </Button>
        ) : (
          <SheetClose asChild>
            <Button type="submit">
              <Plus />
              Tambah Peraturan
            </Button>
          </SheetClose>
        )}
        <SheetClose asChild>
          <Button variant="outline">Tutup</Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
};

export { RegulationCreateForm };
