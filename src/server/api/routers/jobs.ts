import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const jobSchema = z.object({
  company: z.string().max(50),
  companyUrl: z.string().max(100),
  applyUrl: z.string().max(100),
  logoUrl: z.string().max(100).optional(),
  logoBgColor: z.string().max(20).optional(),
  jobTitle: z.string().max(50),
  jobType: z.string().max(50),
  location: z.string().max(50),
  description: z.string().max(1000),
  salary: z.string().max(50),
  requirements: z.object({
    content: z.string().max(500),
    items: z.array(z.string().max(100)),
  }),
  duties: z.object({
    content: z.string().max(500),
    items: z.array(z.string().max(100)),
  }),
  createdAt: z.date().optional(),
});

export const jobRouter = createTRPCRouter({
  createJob: publicProcedure
    .input(jobSchema)
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.prisma.job.create({
        data: {
          ...input,
          createdAt: new Date(),
        },
      });

      return job;
    }),

  getJobs: publicProcedure.query(async ({ ctx }) => {
    const jobs = await ctx.prisma.job.findMany();

    return jobs;
  }),
});
