import { render, screen } from "@testing-library/react";
import Header from "~/components/Header";

describe("<Header withSearchBar />", () => {
  it("renders the header with the logo, theme toggle, and filter input", () => {
    render(<Header withSearchBar />);

    // Assert that the logo is present
    const logo = screen.getByAltText("devjobs logo");
    expect(logo).toBeInTheDocument();

    // Assert that the theme toggle is present
    const toggleElement = screen.getByRole("checkbox");
    expect(toggleElement).toBeInTheDocument();

    // Assert that the filter input is present
    const filterInput = screen.getByPlaceholderText("Filter by title...");
    expect(filterInput).toBeInTheDocument();
  });
});

describe("<Header />", () => {
  it("renders the header with the logo, theme toggle, and no filter input", () => {
    render(<Header />);

    // Assert that the logo is present
    const logo = screen.getByAltText("devjobs logo");
    expect(logo).toBeInTheDocument();

    // Assert that the theme toggle is present
    const toggleElement = screen.getByRole("checkbox");
    expect(toggleElement).toBeInTheDocument();

    // Assert that the filter input is NOT present
    const filterInput = screen.queryByText("Filter by title...");
    expect(filterInput).not.toBeInTheDocument();
  });
});
