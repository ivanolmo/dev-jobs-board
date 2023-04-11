import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const jobSchema = z.object({
  company: z.string(),
  companyUrl: z.string(),
  applyUrl: z.string(),
  logoUrl: z.string().optional(),
  logoBgColor: z.string().optional(),
  jobTitle: z.string(),
  jobType: z.string(),
  location: z.string(),
  description: z.string(),
  salary: z.string(),
  requirements: z.object({
    content: z.string(),
    items: z.array(z.string()),
  }),
  duties: z.object({
    content: z.string(),
    items: z.array(z.string()),
  }),
  createdAt: z.date().optional(),
});

export const jobRouter = createTRPCRouter({
  createJob: publicProcedure
    .input(jobSchema)
    .mutation(async ({ ctx, input }) => {
      const { requirements, duties, createdAt, ...rest } = input;

      const job = await ctx.prisma.job.create({
        data: {
          ...rest,
          createdAt: createdAt ? new Date(createdAt) : new Date(),
          requirements: {
            create: {
              content: requirements.content,
              items: {
                create: requirements.items.map((item) => ({
                  item: item,
                })),
              },
            },
          },
          duties: {
            create: {
              content: duties.content,
              items: {
                create: duties.items.map((item) => ({
                  item: item,
                })),
              },
            },
          },
        },
      });

      // check for errors
      if (!job) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }

      return job;
    }),

  getJobs: publicProcedure.query(async ({ ctx }) => {
    const jobs = await ctx.prisma.job.findMany();

    return jobs;
  }),
});
