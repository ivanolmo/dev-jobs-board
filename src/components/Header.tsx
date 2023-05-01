import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

import Button from "~/components/Button";
import FilterModal from "~/components/FilterModal";
import ThemeSwitch from "~/components/ThemeToggle";
import FilterIcon from "~/components/icons/FilterIcon";
import Logo from "~/components/icons/Logo";
import SearchIcon from "~/components/icons/SearchIcon";

type HeaderProps = {
  onSearch?: (
    fullTimeFilter: boolean,
    jobTitleFilter: string,
    locationFilter: string
  ) => Promise<void>;
  withSearchBar?: boolean;
};

const Header = (props: HeaderProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const fullTimeInputRef = useRef<HTMLInputElement>(null);
  const jobTitleInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const handleThemeChange = () => {
    setIsChecked((prevChecked) => {
      setTheme(prevChecked ? "light" : "dark");
      return !prevChecked;
    });
  };

  const handleSearch = async () => {
    if (props.onSearch) {
      await props.onSearch(
        fullTimeInputRef.current?.checked ?? false,
        jobTitleInputRef.current?.value ?? "",
        locationInputRef.current?.value ?? ""
      );
      setIsModalOpen(false);
    }
  };

  const handleModalVisibility = () => {
    setIsModalOpen(!isModalOpen);
  };

  // checks if the component is mounted before applying theme to avoid hydration mismatch error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (resolvedTheme) {
      setIsChecked(resolvedTheme === "dark");
    }
  }, [resolvedTheme]);

  if (!isMounted) {
    return null;
  }

  return (
    <header className="relative bg-violet bg-header-mobile bg-cover bg-center pb-20 pt-8">
      <div className="flex items-center justify-between px-6">
        <Link href="/">
          <Logo />
        </Link>
        <ThemeSwitch
          theme={resolvedTheme}
          onChange={handleThemeChange}
          checked={isChecked}
        />
      </div>
      {props.withSearchBar && (
        <div className="absolute -bottom-10 flex w-full px-6">
          <input
            type="text"
            name="titleFilter"
            ref={jobTitleInputRef}
            placeholder="Filter by title..."
            className="relative h-20 w-full rounded-md py-4 pl-6 pr-4 text-body text-black shadow-lg dark:bg-very-dark-blue dark:text-light-gray"
          />
          <Button
            className="absolute right-10 top-4 tablet:hidden"
            onClick={() => void handleSearch()}
            data-testid="search-button"
          >
            <SearchIcon />
          </Button>
          <Button
            className="absolute right-24 top-4 tablet:hidden"
            onClick={handleModalVisibility}
            ref={filterButtonRef}
            transparent
            data-testid="filter-button"
          >
            <FilterIcon fill={isChecked ? "#fff" : "#6E8098"} />
          </Button>
          {/* additional filter fields on tablet+ screens */}
          <div className="hidden tablet:flex">
            <input
              type="text"
              name="locationFilter"
              ref={locationInputRef}
              placeholder="Filter by location..."
              className="h-20 w-full rounded-md py-4 pl-6 pr-4 text-body text-black shadow-lg dark:bg-very-dark-blue dark:text-light-gray"
            />
            <label htmlFor="fullTime" className="flex gap-4">
              <input
                type="checkbox"
                name="fullTimeFilter"
                ref={fullTimeInputRef}
                className="checkbox"
                id="fullTime"
              />
              <span className="">Full Time</span>
            </label>
            {/* search button with icon on tablet and desktop */}
            <Button
              className="p-4"
              onClick={() => void handleSearch()}
              data-testid="search-button"
            >
              Search
            </Button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <FilterModal
          closeModal={handleModalVisibility}
          filterButtonRef={filterButtonRef}
          onSearch={props.onSearch}
          jobTitleInputRef={jobTitleInputRef}
        />
      )}
    </header>
  );
};

export default Header;
