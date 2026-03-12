declare module "*.css";

declare module "*.glsl" {
  const content: string;
  export default content;
}

declare module "*.vert" {
  const content: string;
  export default content;
}

declare module "*.frag" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "react-fitty" {
  import type React from "react";

  export const ReactFitty: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
      minSize?: number | undefined;
      maxSize?: number | undefined;
      wrapText?: boolean | undefined;
    } & React.RefAttributes<HTMLElement>
  >;
}
