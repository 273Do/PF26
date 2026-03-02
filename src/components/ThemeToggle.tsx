import { useEffect, useState } from "react";

import { Contrast } from "lucide-react";

import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const [theme, setThemeState] = useState<"theme-light" | "dark">("dark");

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(isDarkMode ? "dark" : "theme-light");
  }, []);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() =>
        setThemeState(`${theme === "dark" ? "theme-light" : "dark"}`)
      }
      className="cursor-pointer"
    >
      <Contrast className="size-4" />
    </Button>
  );
};
