import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "~/pages/index";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Job = RouterOutputs["job"]["getJobs"]["jobs"][number];

const queryClient = new QueryClient();

jest.mock("~/utils/api", () => ({
  api: {
    job: {
      getJobs: {
        useInfiniteQuery: jest.fn(),
      },
    },
  },
}));

// Mock the API response
const getJobsMock = jest.fn();
(api.job.getJobs.useInfiniteQuery as jest.Mock) = getJobsMock;

// Mocked job data
const mockJobs: Job[] = [
  {
    id: "1",
    company: "Test Company 1",
    companyUrl: "https://test-company1.com",
    applyUrl: "https://test-company1.com/apply",
    logoUrl: "https://test-company1.com/logo.svg",
    logoBgColor: "blue",
    jobTitle: "Software Engineer I",
    jobType: "f",
    location: "New York, NY",
    description: "Lorem ipsum dolor sit amet...",
    salary: "100000",
    requirementId: "1",
    dutyId: "1",
    createdAt: new Date("2023-04-01T00:00:00Z"),
  },
  {
    id: "2",
    company: "Test Company 2",
    companyUrl: "https://test-company2.com",
    applyUrl: "https://test-company2.com/apply",
    logoUrl: "https://test-company2.com/logo.svg",
    logoBgColor: "red",
    jobTitle: "Software Engineer II",
    jobType: "p",
    location: "Chicago, IL",
    description: "Lorem ipsum dolor sit amet...",
    salary: "120000",
    requirementId: "2",
    dutyId: "2",
    createdAt: new Date("2023-04-02T00:00:00Z"),
  },
  {
    id: "3",
    company: "Test Company 3",
    companyUrl: "https://test-company3.com",
    applyUrl: "https://test-company3.com/apply",
    logoUrl: "https://test-company3.com/logo.svg",
    logoBgColor: "yellow",
    jobTitle: "Software Engineer III",
    jobType: "c",
    location: "San Francisco, CA",
    description: "Lorem ipsum dolor sit amet...",
    salary: "150000",
    requirementId: "3",
    dutyId: "3",
    createdAt: new Date("2023-04-03T00:00:00Z"),
  },
];

describe("Home", () => {
  beforeEach(() => {
    getJobsMock.mockReset();
  });

  it("renders a list of jobs", () => {
    (api.job.getJobs.useInfiniteQuery as jest.Mock).mockImplementation(() => ({
      data: {
        pages: [{ jobs: mockJobs }],
      },
      isLoading: false,
      isError: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetching: false,
      refetch: () => Promise.resolve(),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // Add assertions for the job list rendering
    const jobCardElements = screen.getAllByTestId("job-card");
    expect(jobCardElements.length).toEqual(mockJobs.length);
  });

  it("renders a loading state", () => {
    (api.job.getJobs.useInfiniteQuery as jest.Mock).mockImplementation(() => ({
      isLoading: true,
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // Add assertions for the loading state
    expect(screen.queryByText(/loading/i)).toBeInTheDocument();
  });

  it("renders an error state", () => {
    (api.job.getJobs.useInfiniteQuery as jest.Mock).mockImplementation(() => ({
      isError: true,
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // Add assertions for the error state
    expect(screen.queryByText(/error/i)).toBeInTheDocument();
  });

  it("updates the job list based on search parameters", async () => {
    getJobsMock
      .mockImplementationOnce(() => ({
        data: {
          pages: [{ jobs: mockJobs }],
        },
        isLoading: false,
        isError: false,
        hasNextPage: false,
        fetchNextPage: jest.fn(),
        isFetching: false,
        refetch: () => Promise.resolve(),
      }))
      .mockImplementationOnce(() => ({
        data: {
          pages: [
            {
              jobs: mockJobs.filter(
                (job) => job.jobTitle === "Software Engineer I"
              ),
            },
          ],
        },
        isLoading: false,
        isError: false,
        hasNextPage: false,
        fetchNextPage: jest.fn(),
        isFetching: false,
        refetch: () => Promise.resolve(),
      }));

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // Interact with the search bar and trigger a search
    const searchInput = screen.getByPlaceholderText("Filter by title...");
    fireEvent.change(searchInput, { target: { value: "Software Engineer I" } });

    // Click the search button
    const searchButton = screen.getByTestId("search-button");
    fireEvent.click(searchButton);

    // Wait for the search to finish
    await waitFor(() => expect(getJobsMock).toHaveBeenCalledTimes(2), {
      timeout: 1000,
    });

    // Add assertions for the updated job list based on the search parameters
    const jobCardElements = screen.getAllByTestId("job-card");
    expect(jobCardElements.length).toEqual(1); // Only one job should match the search query

    // Check that the search parameters were updated
    expect(searchInput).toHaveValue("Software Engineer I");
    expect(getJobsMock).toHaveBeenCalledWith(
      {
        jobTitle: "Software Engineer I",
        location: "",
        fullTime: false,
        limit: 10,
      },
      expect.any(Object)
    );
  });

  it("loads more jobs when the 'Load More' button is clicked", async () => {
    const fetchNextPageMock = jest.fn();

    getJobsMock
      .mockImplementationOnce(() => ({
        data: {
          pages: [{ jobs: mockJobs }],
        },
        isLoading: false,
        isError: false,
        hasNextPage: true,
        fetchNextPage: fetchNextPageMock,
        isFetching: false,
        refetch: () => Promise.resolve(),
      }))
      .mockImplementationOnce(() => ({
        data: {
          pages: [{ jobs: mockJobs }],
        },
        isLoading: false,
        isError: false,
        hasNextPage: false,
        fetchNextPage: fetchNextPageMock,
        isFetching: false,
        refetch: () => Promise.resolve(),
      }));

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );

    // Click the 'Load More' button
    const loadMoreButton = screen.getByText("Load More");
    fireEvent.click(loadMoreButton);

    // // Wait for the new jobs to load
    await waitFor(() => expect(fetchNextPageMock).toHaveBeenCalledTimes(1), {
      timeout: 1000,
    });

    // Add assertions for the new job list
    const jobCardElements = screen.getAllByTestId("job-card");
    expect(jobCardElements.length).toEqual(mockJobs.length); // All 3 mock jobs should be displayed now

    // const updatedLoadMoreButton = screen.getByText("End");
    // expect(updatedLoadMoreButton).toBeInTheDocument();
    // expect(loadMoreButton).not.toBeInTheDocument();
    // expect(loadMoreButton).toHaveTextContent("End"); // The button should change to "End"
  });
});
