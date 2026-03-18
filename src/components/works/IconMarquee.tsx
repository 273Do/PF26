import type { ComponentType } from "react";

import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import * as Icons from "@icons-pack/react-simple-icons";

import { cn } from "@/lib/utils";

type Props = {
  /**
   * アイコン名のリスト
   */
  iconNameList: string[];
  /**
   * className
   */
  className?: string;
};

export const IconMarquee = ({ iconNameList, className }: Props) => {
  return (
    <Marquee
      className={cn(
        className,
        "mt-3 items-center text-foreground [--duration:12s]",
      )}
      fade={true}
      direction="left"
      numberOfCopies={10}
    >
      {iconNameList.map((icon) => {
        const iconKey = `Si${icon}` as keyof typeof Icons;
        const IconComponent = Icons[iconKey] as ComponentType<{
          className?: string;
        }>;

        return (
          <div key={icon} className="px-4">
            <div className="mb-3 flex h-9 w-full">
              {IconComponent ? (
                <IconComponent className="size-9" />
              ) : (
                <p className="pointer-events-none pt-2 text-center text-xs sm:text-base">
                  {icon}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </Marquee>
  );
};
