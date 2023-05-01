import { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";

import Button from "~/components/Button";
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
      <main className="grid min-h-screen justify-items-center px-6 pt-24">
        {/* TODO - improve loading/error states */}
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error</p>}
        <div className="grid w-full items-start gap-14 tablet:grid-cols-2 tablet:gap-x-3 tablet:gap-y-16">
          {jobs?.map((job: Job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
        {/* TODO - improve text when loading/end of list */}
        <Button
          className="my-12 w-32 text-light-gray"
          onClick={() => void fetchNextPage()}
          disabled={!hasNextPage || isFetching}
        >
          {isFetching ? "Loading..." : !hasNextPage ? "End" : "Load More"}
        </Button>
      </main>
    </>
  );
};

export default Home;
