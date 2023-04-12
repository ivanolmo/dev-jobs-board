import Head from "next/head";
import type { NextPage } from "next";

import Header from "~/components/Header";
import JobCard from "~/components/JobCard";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["getJobs"][number];

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
          {data?.map((job: Job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
