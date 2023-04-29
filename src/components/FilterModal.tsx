import { useEffect, useRef } from "react";
import Image from "next/image";

type FilterModalProps = {
  closeModal: () => void;
  filterButtonRef: React.RefObject<HTMLButtonElement>;
  jobTitleInputRef: React.RefObject<HTMLInputElement>;
  onSearch?: (
    fullTimeFilter: boolean,
    jobTitleFilter: string,
    locationFilter: string
  ) => Promise<void>;
};

const FilterModal = (props: FilterModalProps) => {
  const { closeModal } = props;

  const filterModalRef = useRef<HTMLDivElement>(null);
  const fullTimeInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (props.onSearch) {
      await props.onSearch(
        fullTimeInputRef.current?.checked ?? false,
        props.jobTitleInputRef.current?.value ?? "",
        locationInputRef.current?.value ?? ""
      );
      closeModal();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterModalRef.current &&
        props.filterButtonRef.current &&
        !filterModalRef.current.contains(e.target as Node) &&
        !props.filterButtonRef?.current?.contains(e.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal, props.filterButtonRef]);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black opacity-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="mx-6 w-full rounded-md bg-white text-body font-bold text-black dark:bg-very-dark-blue dark:text-white"
          ref={filterModalRef}
        >
          <div className="flex h-20 items-center gap-4 border-b border-dark-gray/20 p-6">
            <Image
              src="/icons/icon-location.svg"
              width={24}
              height={24}
              alt="Search Icon"
            />
            <input
              type="text"
              name="locationFilter"
              ref={locationInputRef}
              className="w-full bg-transparent placeholder:font-normal"
              placeholder="Filter by location..."
            />
          </div>
          <div className="flex flex-col gap-6 p-6">
            <label htmlFor="fullTime" className="flex gap-4">
              <input
                type="checkbox"
                name="fullTimeFilter"
                ref={fullTimeInputRef}
                className="checkbox"
                id="fullTime"
              />
              <span className="">Full Time Only</span>
            </label>
            <button
              className="w-full rounded-md bg-violet py-4 text-white"
              onClick={() => void handleSearch()}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
