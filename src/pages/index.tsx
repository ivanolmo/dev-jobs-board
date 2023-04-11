import Head from "next/head";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { NextPage } from "next";

import Header from "~/components/Header";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["getJobs"][number];
dayjs.extend(relativeTime);

// job card that takes props
const JobCard = (props: Job) => {
  // destructure props
  const {
    jobTitle,
    company,
    location,
    jobType,
    createdAt,
    logoUrl,
    logoBgColor,
  } = props;

  const timeFromNow = dayjs(createdAt).fromNow();

  const bgColorStyle = {
    backgroundColor: logoBgColor || "violet",
  };

  return (
    // wrap in Link once we have a job detail page
    <div className="relative flex flex-col rounded-md bg-white px-6 pb-8 pt-12 shadow-sm">
      <div
        className="absolute -top-7 left-8 flex h-14 w-14 place-items-center rounded-2xl px-2.5"
        style={bgColorStyle}
      >
        {/* needs a default logo */}
        <Image src={logoUrl ?? ""} width={64} height={64} alt="logo" />
      </div>
      <div className="flex flex-col gap-4 text-gray">
        <div className="flex items-center gap-2">
          <span>{timeFromNow}</span>•<span>{jobType}</span>
        </div>
        <span className="text-md font-bold text-black">{jobTitle}</span>
        <span>{company}</span>
      </div>
      <div className="mt-11">
        <span className="text-sm font-bold text-violet">{location}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading, isError } = api.job.getJobs.useQuery();

  return (
    <>
      <Head>
        <title>Developer Jobs Board</title>
        <meta
          name="description"
          content="A job board for software developer jobs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex min-h-screen flex-col items-center bg-light-gray pt-24">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error</p>}
        <div className="space-y-14">
          {data?.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
