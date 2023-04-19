import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import ThemeSwitch from "~/components/ThemeToggle";

type HeaderProps = {
  withSearchBar?: boolean;
};

const Header = (props: HeaderProps) => {
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const handleChange = () => {
    setChecked((prevChecked) => {
      setTheme(prevChecked ? "light" : "dark");
      return !prevChecked;
    });
  };

  // checks if the component is mounted before applying theme to avoid hydration mismatch error
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
        <Link href="/">
          <Image
            src="/icons/logo.svg"
            width={116}
            height={32}
            alt="devjobs logo"
          />
        </Link>
        <ThemeSwitch
          theme={resolvedTheme}
          onChange={handleChange}
          checked={checked}
        />
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
