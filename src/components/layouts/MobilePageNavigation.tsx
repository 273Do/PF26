import { useState } from "react";

import { MenuIcon, X } from "lucide-react";

import { ThemeToggle } from "../ThemeToggle";
import Copyright from "./Copyright";
import { Button } from "../ui/button";

import { PAGE_LINKS } from "@/consts";
import { cn } from "@/lib/utils";

const showcaseCount = 1;

type Props = {
  /**
   * 現在のパス
   */
  currentPath: string;
  /**
   * ｗorksのデータ数
   */
  worksCount: number;
};

export const MobilePageNavigation = ({ currentPath, worksCount }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const counts: Record<string, number> = {
    works: worksCount,
    showcase: showcaseCount,
  };

  return (
    <div className="block sm:hidden">
      <Button
        variant="ghost"
        size="icon-sm"
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X /> : <MenuIcon />}
      </Button>
      <div
        className={cn(
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
          `
            fixed left-0 z-200 flex h-[calc(100dvh-36px)] w-full flex-col justify-between bg-background px-3
            transition-all duration-300
          `,
        )}
      >
        <ul className="mt-[3vh] flex flex-col gap-2 font-mono text-3xl text-muted-foreground">
          {open &&
            PAGE_LINKS.filter((link) => link.href !== "").map(
              ({ href, title }, i) => {
                const count = counts[href];
                const isActive = currentPath === href;

                return (
                  <li className={cn(isActive && "text-foreground")} key={i}>
                    <a
                      href={`/${href}`}
                      onClick={() => setOpen(false)}
                      className="flex"
                    >
                      <p className="hover:underline">{title}</p>
                      {Boolean(count) && <p className="text-sm">({count})</p>}
                    </a>
                  </li>
                );
              },
            )}
        </ul>
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Copyright />
        </div>
      </div>
    </div>
  );
};
