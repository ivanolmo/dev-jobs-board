import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: undefined },
    transformer: superjson,
  });
