import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Header from "~/components/Header";

describe("<Header withSearchBar />", () => {
  it("renders the header with the logo, theme toggle, and filter input", () => {
    render(<Header withSearchBar />);

    // Assert that the logo is present
    const logo = screen.getByAltText("devjobs logo");
    expect(logo).toBeInTheDocument();

    // Assert that the theme toggle is present
    const toggleElement = screen.getByTestId("theme-toggle");
    expect(toggleElement).toBeInTheDocument();

    // Assert that the filter input is present
    const filterInput = screen.getByPlaceholderText("Filter by title...");
    expect(filterInput).toBeInTheDocument();
  });

  it("opens and closes the filter modal", async () => {
    render(<Header withSearchBar />);

    // Open the filter modal
    const filterButton = screen.getByTestId("filter-button");
    fireEvent.click(filterButton);

    // Assert that the filter modal is open
    const filterModal = screen.getByTestId("filter-modal");
    expect(filterModal).toBeInTheDocument();

    // Close the filter modal by clicking outside of it
    fireEvent.mouseDown(document, { clientX: 0, clientY: 0 });

    // Assert that the filter modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId("filter-modal")).not.toBeInTheDocument();
    });
  });
});

describe("<Header />", () => {
  it("renders the header with the logo, theme toggle, and no filter input", () => {
    render(<Header />);

    // Assert that the logo is present
    const logo = screen.getByAltText("devjobs logo");
    expect(logo).toBeInTheDocument();

    // Assert that the theme toggle is present
    const toggleElement = screen.getByTestId("theme-toggle");
    expect(toggleElement).toBeInTheDocument();

    // Assert that the filter input is NOT present
    const filterInput = screen.queryByText("Filter by title...");
    expect(filterInput).not.toBeInTheDocument();
  });
});
