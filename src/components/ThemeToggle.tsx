import MoonIcon from "~/components/icons/MoonIcon";
import SunIcon from "~/components/icons/SunIcon";

type ThemeToggleProps = {
  checked: boolean;
  theme?: string | undefined;
  onChange: () => void;
};

const ThemeToggle = (props: ThemeToggleProps) => {
  return (
    <label
      className="swap swap-rotate"
      htmlFor="theme-toggle"
      data-testid="theme-toggle"
    >
      <input
        type="checkbox"
        id="theme-toggle"
        checked={props.checked}
        onChange={props.onChange}
      />
      {/* Sun icon */}
      <SunIcon
        aria-label="sun-icon"
        data-testid="sun-icon"
        className="swap-off h-8 w-8"
      />
      {/* Moon icon */}
      <MoonIcon
        aria-label="moon-icon"
        data-testid="moon-icon"
        className="swap-on h-8 w-8"
      />
    </label>
  );
};

export default ThemeToggle;
