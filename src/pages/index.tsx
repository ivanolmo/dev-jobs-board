import { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";

import Header from "~/components/Header";
import JobCard from "~/components/JobCard";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["getJobs"]["jobs"][number];

const Home: NextPage = () => {
  const [searchParams, setSearchParams] = useState({
    fullTime: false,
    jobTitle: "",
    location: "",
  });

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetching,
    refetch,
  } = api.job.getJobs.useInfiniteQuery(
    {
      ...searchParams,
      limit: 10,
    },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const jobs = data?.pages.flatMap((page) => page.jobs);

  const handleSearch = async (
    fullTimeFilter: boolean,
    jobTitleFilter: string,
    locationFilter: string
  ) => {
    setSearchParams({
      fullTime: fullTimeFilter,
      jobTitle: jobTitleFilter,
      location: locationFilter,
    });
    await refetch();
  };

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
      <Header withSearchBar onSearch={handleSearch} />
      <main className="flex min-h-screen flex-col items-center px-6 pt-24">
        {/* TODO - improve loading/error states */}
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error</p>}
        <div className="w-full space-y-14">
          {jobs?.map((job: Job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
        {/* TODO - improve text when loading/end of list */}
        <button
          className="my-12 w-32 rounded-md bg-violet px-5 py-4 font-bold text-light-gray"
          onClick={() => void fetchNextPage()}
          disabled={!hasNextPage || isFetching}
        >
          {isFetching ? "Loading..." : !hasNextPage ? "End" : "Load More"}
        </button>
      </main>
    </>
  );
};

export default Home;
