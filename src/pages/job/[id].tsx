import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { GetStaticProps, NextPage } from "next";

import Header from "~/components/Header";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

dayjs.extend(relativeTime);

const SingleJobPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: job, isLoading } = api.job.getJobById.useQuery({
    id,
  });

  // TODO - improve these states
  if (!job) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  const timeFromNow = dayjs(job.createdAt).fromNow();

  const bgColorStyle = {
    backgroundColor: job.logoBgColor || "violet",
  };

  return (
    <>
      <Head>
        <title>{`Job @ ${job.company}`}</title>
      </Head>
      <Header />
      <main className="flex min-h-screen flex-col items-center gap-6 px-6 text-dark-gray dark:text-gray">
        {/* card at top */}
        <section className="relative -mt-4 flex w-full flex-col items-center gap-7 rounded-md bg-white pb-8 pt-12 dark:bg-very-dark-blue">
          <div
            className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 transform place-items-center rounded-2xl px-2.5"
            style={bgColorStyle}
          >
            {/* TODO - needs a default logo */}
            <Image
              src={job.logoUrl ?? ""}
              width={64}
              height={64}
              alt={`${job.company}'s logo`}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-md font-bold text-black dark:text-white">
              {job.company}
            </h1>
            <span className="text-body">{`${job.companyUrl.toLowerCase()}.com`}</span>
          </div>
          <Link href={job.companyUrl}>
            <button className="rounded-md bg-light-gray px-5 py-4 font-bold text-violet dark:bg-violet/10 dark:text-light-violet">
              Company Site
            </button>
          </Link>
        </section>
        {/* long section with rest of job details */}
        <section className="flex w-full flex-col gap-12 rounded-md bg-white px-6 py-10 text-body dark:bg-very-dark-blue">
          {/* time, title, location */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="">{timeFromNow}</span>•<span>{job.jobType}</span>
            </div>
            <span className="text-md font-bold text-black dark:text-white">
              {job.jobTitle}
            </span>
            <span className="text-sm font-bold text-violet dark:text-light-violet">
              {job.location}
            </span>
          </div>
          {/* apply button and description */}
          <div className="space-y-8">
            <Link href={job.applyUrl}>
              <button className="w-full rounded-md bg-violet px-5 py-4 font-bold text-white">
                Apply Now
              </button>
            </Link>
            <p>{job.description}</p>
          </div>
          {/* requirements */}
          <div className="space-y-8">
            <h2 className="text-md font-bold text-black dark:text-white">
              Requirements
            </h2>
            <p>{job.requirements.content}</p>
            <ul className="list-outside list-disc pl-4">
              {job.requirements.items.map((item) => (
                <li key={item.id}>{item.item}</li>
              ))}
            </ul>
          </div>
          {/* duties */}
          <div className="space-y-8">
            <h2 className="text-md font-bold text-black dark:text-white">
              What You Will Do
            </h2>
            <p>{job.duties.content}</p>
            <ul className="list-outside">
              {job.duties.items.map((item, index) => (
                <li key={item.id} className="flex gap-5">
                  <span className="font-bold text-violet">{index + 1}</span>
                  <span>{item.item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      {/* spacer */}
      <div className="h-12" />
      {/* apply button at bottom (will have more info on bigger screens) */}
      <footer className="rounded-t-md bg-white p-6 text-white dark:bg-very-dark-blue">
        <Link href={job.applyUrl}>
          <button className="w-full rounded-md bg-violet px-5 py-4 font-bold text-white">
            Apply Now
          </button>
        </Link>
      </footer>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") {
    throw new Error("id is not a string");
  }

  await ssg.job.getJobById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SingleJobPage;
