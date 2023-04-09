import Head from "next/head";
import type { NextPage } from "next";

import Header from "~/components/Header";

const Home: NextPage = () => {
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
      <main className="flex min-h-screen items-center bg-light-gray"></main>
    </>
  );
};

export default Home;
