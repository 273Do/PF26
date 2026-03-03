import { Contrast } from "lucide-react";

import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      className="cursor-pointer"
    >
      <Contrast className="size-4" />
    </Button>
  );
};
