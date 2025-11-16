"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { orpc, queryClient } from "@/utils/orpc";

interface AssetDamageReportFormProps {
  assetId: string;
  assetName: string;
  onSuccess?: () => void;
}

const AssetDamageReportFormDialog = ({
  assetId,
  assetName,
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

        form.reset();

        onSuccess?.();
      },
      onError: (error) => {
        toast.error("Gagal menambahkan laporan kerusakan");
        console.error(error);
      },
    }),
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Laporkan Kerusakan "{assetName}"</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4 overflow-visible overflow-y-auto py-4">
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
                    rows={3}
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>

        <DialogFooter className="">
          <Button type="submit" disabled={damageReportMutation.isPending}>
            {damageReportMutation.isPending ? (
              <>
                <Loader className="animate-spin" />
                Memuat...
              </>
            ) : (
              "Lapor"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export { AssetDamageReportFormDialog };
