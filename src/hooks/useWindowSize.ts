import { useState, useEffect } from "react";

interface WindowSize {
  screenWidth: number | undefined;
  screenHeight: number | undefined;
}

const useWindowSize = (): WindowSize => {
  const getWindowSize = (): WindowSize => {
    if (typeof window === "undefined") {
      return { screenWidth: undefined, screenHeight: undefined };
    }

    return { screenWidth: window.innerWidth, screenHeight: window.innerHeight };
  };

  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize());

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    // Check if window is available in the current environment
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
};

export default useWindowSize;
