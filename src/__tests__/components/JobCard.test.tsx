import { render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import JobCard from "~/components/JobCard";
import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["getJobs"][number];
dayjs.extend(relativeTime);

// Example Job data for testing
const mockJob: Job = {
  id: "1",
  company: "Test Company",
  companyUrl: "https://test-company.com",
  applyUrl: "https://test-company.com/apply",
  logoUrl: "https://test-company.com/logo.svg",
  logoBgColor: "blue",
  jobTitle: "Software Engineer",
  jobType: "Full-time",
  location: "New York, NY",
  description: "Lorem ipsum dolor sit amet...",
  salary: "100000",
  requirementId: "1",
  dutyId: "1",
  createdAt: new Date("2023-04-01T00:00:00Z"),
};

describe("<JobCard />", () => {
  it("renders the job card with the provided data", () => {
    render(<JobCard {...mockJob} />);

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("New York, NY")).toBeInTheDocument();
  });
});
