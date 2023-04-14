import { render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import JobCard from "~/components/JobCard";
import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["getJobs"]["jobs"][number];
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
  jobType: "Full Time",
  location: "New York, NY",
  description: "Lorem ipsum dolor sit amet...",
  salary: "100000",
  requirementId: "1",
  dutyId: "1",
  createdAt: new Date("2023-04-01T00:00:00Z"),
};

const getRelativeTime = (createdAt: Date) => {
  return dayjs(createdAt).fromNow();
};

const expectedTimeFromNow = mockJob.createdAt
  ? getRelativeTime(mockJob.createdAt)
  : "";

const decodedURLMatches = (
  received: string | null,
  expected: string
): boolean => {
  const decodedURL = decodeURIComponent(received || "");
  return decodedURL.includes(expected);
};

describe("<JobCard />", () => {
  it("renders the job card with the provided data", () => {
    render(<JobCard {...mockJob} />);

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("New York, NY")).toBeInTheDocument();
    expect(screen.getByText("Full Time")).toBeInTheDocument();
    expect(screen.getByText(expectedTimeFromNow)).toBeInTheDocument();
    expect(screen.getByAltText("Test Company's logo")).toBeInTheDocument();
    expect(
      screen.getByRole("link").querySelector(".absolute.-top-7")
    ).toHaveStyle({
      backgroundColor: "blue",
    });
  });
});

it("navigates to the correct job page when clicked", () => {
  render(<JobCard {...mockJob} />);
  const linkElement = screen.getByRole("link");
  expect(linkElement.getAttribute("href")).toBe(`/job/${mockJob.id}`);
});

it("renders the default logo when logoUrl is null", () => {
  const jobWithNullLogo = { ...mockJob, logoUrl: null };
  render(<JobCard {...jobWithNullLogo} />);
  const imageElement = screen.getByAltText("Test Company's logo");
  expect(
    decodedURLMatches(
      imageElement.getAttribute("src"),
      "https://placehold.co/100"
    )
  ).toBeTruthy();
});
