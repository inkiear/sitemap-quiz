"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
});

interface CreateIssueDialogProps {
  open?: boolean;
  onOpenChange?: () => void;
}

const CreateIssueDialog = ({
  open: openProp,
  onOpenChange,
}: CreateIssueDialogProps) => {
  const { mutateAsync, isPending } = api.issues.create.useMutation();

  const [open, setOpen] = useState(openProp ?? false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { title: "", description: "" },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync({ title: values.title, description: values.description });
    form.reset();
    setOpen(false);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        onOpenChange?.();
      }}
    >
      <AlertDialogTrigger asChild>
        <Button>Create Issue</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Issue</AlertDialogTitle>
            <AlertDialogDescription>
              Fill in all the fields.
            </AlertDialogDescription>
            <div>
              <Label>Title</Label>
              <Input placeholder="Title" {...form.register("title")} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Description"
                {...form.register("description")}
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t mt-4 pt-4">
            <AlertDialogCancel type="button" disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <Button type="submit" disabled={isPending}>
              Continue
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateIssueDialog;
