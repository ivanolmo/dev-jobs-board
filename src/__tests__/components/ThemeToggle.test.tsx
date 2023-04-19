import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "~/components/ThemeToggle";

describe("<ThemeToggle />", () => {
  it("renders the correct icons based on the theme and toggles the checkbox", async () => {
    const onChangeMock = jest.fn();

    const { rerender } = render(
      <ThemeToggle checked={false} theme="light" onChange={onChangeMock} />
    );

    // Assert the correct icons are rendered
    const sunIcon = screen.getByTestId("sun-icon");
    expect(sunIcon).toBeInTheDocument();

    const moonIcon = screen.getByTestId("moon-icon");
    expect(moonIcon).toBeInTheDocument();

    // Assert the checkbox is initially unchecked
    const switchElement = screen.getByRole("checkbox");
    expect(switchElement).not.toBeChecked();

    // Simulate theme switch to dark mode
    await userEvent.click(switchElement);

    // check that the onChange handler was called
    expect(onChangeMock).toHaveBeenCalledTimes(1);

    // re-render the component with the updated props
    rerender(
      <ThemeToggle checked={true} theme="dark" onChange={onChangeMock} />
    );

    // The icons should still be in the document
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();

    // Assert the checkbox is checked after the click event
    expect(switchElement).toBeChecked();

    // simulate another theme switch back to light mode
    await userEvent.click(switchElement);

    // check that the onChange handler was called again
    expect(onChangeMock).toHaveBeenCalledTimes(2);

    // re-render the component once more with the updated props
    rerender(
      <ThemeToggle checked={false} theme="light" onChange={onChangeMock} />
    );

    // The icons should still be in the document
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();

    // Assert the checkbox is checked after the click event
    expect(switchElement).not.toBeChecked();
  });
});
