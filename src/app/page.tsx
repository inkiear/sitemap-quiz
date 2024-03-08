"use client";

import { api } from "@/trpc/react";
import { EditIcon, XIcon } from "lucide-react";
import CreateIssueDialog from "./_components/create-issue-dialog";
import UpdateIssueDialog from "./_components/update-issue-dialog";
import { useState } from "react";
import { issues } from "@/server/data/issues";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { data } = api.issues.list.useQuery();
  const { mutateAsync: deleteMutate, isPending: deleteIsPending } =
    api.issues.delete.useMutation();

  const [editIssue, setEditIssue] = useState<(typeof issues)[0] | undefined>(
    undefined
  );
  const [deleteIssue, setDeleteIssue] = useState<
    (typeof issues)[0] | undefined
  >(undefined);
  const [activeIssue, setActiveIssue] = useState<
    (typeof issues)[0] | undefined
  >(undefined);

  return (
    <main className="max-w-lg mx-auto py-12">
      <div className="flex justify-end mb-4">
        <CreateIssueDialog />
      </div>

      <div className="flex flex-col gap-4">
        {data?.map((issue) => (
          <Card key={issue.id}>
            <CardHeader>
              <CardTitle className="flex justify-between gap-4">
                <div>{issue.title}</div>
                <div className="flex justify-between gap-2">
                  <Button
                    size="icon"
                    className="h-6 w-6 bg-yellow-500"
                    onClick={() => setEditIssue(issue)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    size="icon"
                    className="h-6 w-6 bg-red-500"
                    onClick={async () => {
                      setDeleteIssue(issue);
                      await deleteMutate({ id: issue.id });
                      setDeleteIssue(undefined);
                    }}
                    disabled={deleteIsPending && deleteIssue === issue}
                  >
                    <XIcon />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>ID: {issue.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{issue.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <UpdateIssueDialog
        issue={editIssue}
        open={!!editIssue}
        onOpenChange={(open) => {
          if (!open) {
            setEditIssue(undefined);
          }
        }}
      />
    </main>
  );
}
