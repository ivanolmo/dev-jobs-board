import { render, screen } from "@testing-library/react";
import Header from "~/components/Header";

describe("<Header />", () => {
  it("renders the header with the logo and theme switch", () => {
    render(<Header />);

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
