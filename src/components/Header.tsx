import { useEffect, useState } from "react";
import Image from "next/image";
import Switch from "@mui/material/Switch";
import { useTheme } from "next-themes";

type HeaderWithProps = {
  withSearchBar?: boolean;
};

const Header = (props: HeaderWithProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleChange = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
      setTheme(newChecked ? "dark" : "light");
      return newChecked;
    });
  };

  // checks if the component is mounted before applying theme
  // if this isn't done there will be a hydration mismatch error
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resolvedTheme) {
      setChecked(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <header className="relative bg-violet bg-header-mobile bg-cover bg-center pb-20 pt-8">
      <div className="flex items-center justify-between px-6">
        <Image
          src="/icons/logo.svg"
          width={116}
          height={32}
          alt="devjobs logo"
        />
        <div className="flex items-center gap-2">
          <Image
            src="/icons/icon-sun.svg"
            width={20}
            height={20}
            alt="Light mode icon"
          />
          <Switch size="medium" onChange={handleChange} checked={checked} />
          <Image
            src="/icons/icon-moon.svg"
            width={16}
            height={16}
            alt="Dark mode icon"
          />
        </div>
      </div>
      {props.withSearchBar && (
        <div className="absolute -bottom-10 w-full px-6">
          <input
            type="text"
            placeholder="Filter by title..."
            className="h-20 w-full rounded-md py-4 pl-6 pr-4 text-body text-black shadow-lg dark:bg-very-dark-blue dark:text-light-gray"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
