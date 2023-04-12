import { render, screen } from "@testing-library/react";
import Header from "~/components/Header";

describe("<Header withSearchBar />", () => {
  it("renders the header with the logo, theme switch, and search bar", () => {
    render(<Header withSearchBar />);

    const logo = screen.getByAltText("devjobs logo");
    expect(logo).toBeInTheDocument();

    const lightModeIcon = screen.getByAltText("Light mode icon");
    expect(lightModeIcon).toBeInTheDocument();

    const darkModeIcon = screen.getByAltText("Dark mode icon");
    expect(darkModeIcon).toBeInTheDocument();

    const switchElement = screen.getByRole("checkbox");
    expect(switchElement).toBeInTheDocument();

    const filterInput = screen.getByPlaceholderText("Filter by title...");
    expect(filterInput).toBeInTheDocument();
  });
});

describe("<Header />", () => {
  it("renders the header with the logo, theme switch, and no search bar", () => {
    render(<Header />);

    const logo = screen.getByAltText("devjobs logo");
    expect(logo).toBeInTheDocument();

    const lightModeIcon = screen.getByAltText("Light mode icon");
    expect(lightModeIcon).toBeInTheDocument();

    const darkModeIcon = screen.getByAltText("Dark mode icon");
    expect(darkModeIcon).toBeInTheDocument();

    const switchElement = screen.getByRole("checkbox");
    expect(switchElement).toBeInTheDocument();

    const filterInput = screen.queryByText("Filter by title...");
    expect(filterInput).not.toBeInTheDocument();
  });
});
