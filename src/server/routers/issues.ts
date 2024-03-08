import { procedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { issues } from "@/server/data/issues";

const issuesRouter = router({
  list: procedure.query(async () => {
    return issues;
  }),
  byId: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input: { id } }) => {
      const issue = issues.find((issue) => issue.id === id);

      if (!issue) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Issue not found",
        });
      }

      return issue;
    }),
  create: procedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input: { title, description } }) => {
      const id = issues.length + 1;
      const issue = { id, title, description };

      console.log(issue);
      return issue;
    }),
  update: procedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input: { id, title, description } }) => {
      const existingIssue = issues.find((issue) => issue.id === id);

      if (!existingIssue) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Issue not found",
        });
      }

      // In a real API, logic to update issue would be written here
      const updatedIssue = { ...existingIssue, title, description };

      console.log(updatedIssue);
      return updatedIssue;
    }),
  delete: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input: { id } }) => {
      const existingIssue = issues.find((issue) => issue.id === id);

      if (!existingIssue) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Issue not found",
        });
      }

      console.log(existingIssue);
      return existingIssue;
    }),
});

export { issuesRouter };
