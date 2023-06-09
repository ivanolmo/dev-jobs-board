import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

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

      if (!job) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating job",
        });
      }

      return job;
    }),

  getJobs: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
        fullTime: z.boolean().optional(),
        jobTitle: z.string().optional(),
        location: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, jobTitle, location, fullTime } = input;

      const whereClause: Prisma.JobWhereInput = {
        ...(fullTime !== undefined && {
          jobType: fullTime ? { equals: "f" } : { in: ["f", "p", "c"] },
        }),
        ...(jobTitle && {
          jobTitle: { contains: jobTitle, mode: "insensitive" },
        }),
        ...(location && {
          location: { contains: location, mode: "insensitive" },
        }),
      };

      const jobs = await ctx.prisma.job.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (jobs.length > limit) {
        const nextJob = jobs.pop() as (typeof jobs)[number];
        nextCursor = nextJob.id;
      }

      return {
        jobs,
        nextCursor,
      };
    }),

  getJobById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const job = await ctx.prisma.job.findUnique({
        where: {
          id: input.id,
        },
        include: {
          requirements: {
            include: {
              items: true,
            },
          },
          duties: {
            include: {
              items: true,
            },
          },
        },
      });

      if (!job)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found",
        });

      return job;
    }),

  // searchJobs: publicProcedure
  //   .input(
  //     z.object({
  //       cursor: z.string().nullish(),
  //       limit: z.number().min(1).max(100).default(10),
  //       jobTitle: z.string().optional(),
  //       location: z.string().optional(),
  //       fullTime: z.boolean().optional(),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const { cursor, limit, jobTitle, location, fullTime } = input;

  // const whereClause: Prisma.JobWhereInput = {
  //   ...(jobTitle && {
  //     jobTitle: { contains: jobTitle, mode: "insensitive" },
  //   }),
  //   ...(location && {
  //     location: { contains: location, mode: "insensitive" },
  //   }),
  //   ...(fullTime !== undefined && {
  //     jobType: fullTime ? "f" : "p" || "c",
  //   }),
  // };

  //     const jobs = await ctx.prisma.job.findMany({
  //       take: limit + 1,
  //       cursor: cursor ? { id: cursor } : undefined,
  //       where: whereClause,
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     });

  //     let nextCursor: typeof cursor | undefined = undefined;

  //     if (jobs.length > limit) {
  //       const nextJob = jobs.pop() as (typeof jobs)[number];
  //       nextCursor = nextJob.id;
  //     }

  //     return {
  //       jobs,
  //       nextCursor,
  //     };
  //   }),
});
