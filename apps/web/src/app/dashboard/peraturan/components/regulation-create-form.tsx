"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
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
  const regulationMutation = useMutation(
    orpc.regulation.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.regulation.key(),
        });
        toast.success("Peraturan berhasil ditambahkan!");
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
    onSubmit: ({ value }) => {
      console.log("Data yang dikirim:", value);
      regulationMutation.mutate({
        title: value.title,
        number: value.number,
        level: value.level,
        description: value.description || null,
        effectiveBy: value.effectiveBy
          ? new Date(value.effectiveBy)
          : undefined,
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
          <form.Field
            name="description"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tambahkan deskripsi singkat mengenai peraturan ini"
                />
              </Field>
            )}
          />

          <form.Field
            name="effectiveBy"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Tanggal Ditetapkan</FieldLabel>
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
        <Button type="submit" disabled={regulationMutation.isPending}>
          {regulationMutation.isPending ? (
            <>
              <Loader className="animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Plus />
              Tambah Peraturan
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

export { RegulationCreateForm };
