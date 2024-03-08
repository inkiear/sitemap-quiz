import { issuesRouter } from "./routers/issues";
import { procedure, router } from "./trpc";

const appRouter = router({
  greeting: procedure.query(() => "hello tRPC v10!"),
  issues: issuesRouter,
});

export type AppRouter = typeof appRouter;
export { appRouter };
