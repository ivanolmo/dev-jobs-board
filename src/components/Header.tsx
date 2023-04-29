import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import FilterModal from "~/components/FilterModal";
import ThemeSwitch from "~/components/ThemeToggle";

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
          <Image
            src="/icons/logo.svg"
            width={116}
            height={32}
            alt="devjobs logo"
          />
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
          {/* search button with icon */}
          <button
            className="absolute right-10 top-4 flex h-12 items-center rounded-md bg-violet p-3"
            onClick={() => void handleSearch()}
          >
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.112 15.059h-1.088l-.377-.377a8.814 8.814 0 002.15-5.784A8.898 8.898 0 008.898 0 8.898 8.898 0 000 8.898a8.898 8.898 0 008.898 8.899c2.211 0 4.23-.808 5.784-2.143l.377.377v1.081l6.845 6.832 2.04-2.04-6.832-6.845zm-8.214 0A6.16 6.16 0 118.9 2.737a6.16 6.16 0 010 12.322z"
                fill="#fff"
                fillRule="nonzero"
              />
            </svg>
          </button>
          {/* filter button with icon */}
          <button
            className="absolute right-28 top-8 tablet:hidden"
            onClick={handleModalVisibility}
            ref={filterButtonRef}
          >
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.108 0H.86a.86.86 0 00-.764.455.833.833 0 00.068.884l6.685 9.202.007.01c.242.32.374.708.375 1.107v7.502a.825.825 0 00.248.594.865.865 0 00.942.18l3.756-1.4c.337-.1.56-.41.56-.784v-6.092c0-.399.132-.787.375-1.108l.007-.009 6.685-9.202c.19-.26.217-.6.068-.884A.86.86 0 0019.108 0z"
                fill={isChecked ? "#fff" : "#6E8098"}
              />
            </svg>
          </button>
          <div className="hidden tablet:flex">
            <input
              type="text"
              name="locationFilter"
              ref={locationInputRef}
              placeholder="Filter by location..."
              className="h-20 w-full rounded-md py-4 pl-6 pr-4 text-body text-black shadow-lg dark:bg-very-dark-blue dark:text-light-gray"
            />
            <label>
              <input
                type="checkbox"
                name="fullTimeFilter"
                ref={fullTimeInputRef}
              />
              Full Time
            </label>
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
