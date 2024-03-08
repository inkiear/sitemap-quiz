"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { issues } from "@/server/data/issues";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
});

interface UpdateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issue?: (typeof issues)[0];
}

const UpdateIssueDialog = ({
  open,
  onOpenChange,
  issue,
}: UpdateIssueDialogProps) => {
  const { mutateAsync, isPending } = api.issues.update.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
    },
  });
  const { reset } = form;

  useEffect(() => {
    reset(issue);
  }, [reset, issue]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (issue) {
      await mutateAsync({
        id: issue.id,
        title: values.title,
        description: values.description,
      });
      onOpenChange?.(false);
      form.reset();
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(change) => {
        form.reset({
          title: "",
          description: "",
        });
        onOpenChange?.(change);
      }}
    >
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Issue</AlertDialogTitle>
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

export default UpdateIssueDialog;
