import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["getJobs"]["jobs"][number];
type JobTypes = {
  [key: string]: string;
  f: string;
  p: string;
  c: string;
};

dayjs.extend(relativeTime);

const JobCard = (props: Job) => {
  const {
    id,
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
    backgroundColor: logoBgColor ?? "violet",
  };

  const jobTypes: JobTypes = {
    f: "Full Time",
    p: "Part Time",
    c: "Contract",
  };

  return (
    <div data-testid="job-card">
      <Link href={`/job/${id}`}>
        <div className="relative flex flex-col rounded-md bg-white px-6 pb-8 pt-12 shadow-sm dark:bg-very-dark-blue">
          <div
            className="absolute -top-7 left-8 flex h-14 w-14 place-items-center rounded-2xl px-2.5"
            style={bgColorStyle}
          >
            {/* TODO: needs a default logo */}
            <Image
              src={logoUrl ?? "https://placehold.co/100"}
              width={64}
              height={64}
              alt={`${company}'s logo`}
            />
          </div>
          <div className="flex flex-col gap-4 text-dark-gray dark:text-gray">
            <div className="flex items-center gap-2">
              <span>{timeFromNow}</span>•<span>{jobTypes[jobType]}</span>
            </div>
            <span className="line-clamp-1 text-md font-bold text-black dark:text-white">
              {jobTitle}
            </span>
            <span className="line-clamp-1">{company}</span>
          </div>
          <div className="mt-11">
            <span className="line-clamp-1 text-sm font-bold text-violet dark:text-light-violet">
              {location}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;
