import Image from "next/image";

const Header = () => {
  return (
    <header className="sticky h-[8.5rem] bg-violet bg-header-mobile bg-left-top">
      <div className="flex items-center justify-between px-6 py-8">
        <Image
          src="/icons/logo.svg"
          width={116}
          height={32}
          alt="devjobs logo"
        />
        <div className="flex items-center gap-4">
          <Image
            src="/icons/icon-sun.svg"
            width={20}
            height={20}
            alt="Light mode icon"
          />
          <span>-SLIDER-</span> {/* temp */}
          <Image
            src="/icons/icon-moon.svg"
            width={16}
            height={16}
            alt="Dark mode icon"
          />
        </div>
      </div>
      <div className="px-6">
        <input
          type="text"
          placeholder="Filter by title..."
          className="h-20 w-full rounded-md py-4 pl-6 pr-4 text-body text-black shadow-lg"
        />
      </div>
    </header>
  );
};

export default Header;
