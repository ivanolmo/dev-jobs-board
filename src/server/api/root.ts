import { createTRPCRouter } from "~/server/api/trpc";
import { jobRouter } from "./routers/jobs";

export const appRouter = createTRPCRouter({
  job: jobRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
