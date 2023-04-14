import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["getJobs"]["jobs"][number];
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
    backgroundColor: logoBgColor || "violet",
  };

  return (
    <div>
      <Link href={`/job/${id}`}>
        <div className="relative flex flex-col rounded-md bg-white px-6 pb-8 pt-12 shadow-sm">
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
      </Link>
    </div>
  );
};

export default JobCard;
