import { Html } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { CAMERA_Z } from "./MutualLinksCanvas";

import { BlOB_TRACKING_ClASS, CORNER_POSITIONS } from "@/consts";
import { cn } from "@/lib/utils";

const PANEL_W = 2.1;
const PANEL_H = 0.9;

export const HtmlCodePanel = ({
  code,
  position,
}: {
  code: string;
  position: [number, number, number];
}) => {
  const { border, label, coord, plus } = BlOB_TRACKING_ClASS;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const codeEl = e.currentTarget.querySelector("code");
    navigator.clipboard.writeText(codeEl?.textContent ?? "");
    const label = e.currentTarget.querySelector(
      "[data-label]",
    ) as HTMLElement | null;
    if (label) {
      label.textContent = "copied!";
      setTimeout(() => {
        label.textContent = "click to copy";
      }, 2000);
    }
  };

  return (
    <RigidBody
      position={position}
      colliders={false}
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, false, true]}
    >
      <CuboidCollider args={[PANEL_W, PANEL_H / 2, 0.9]} />
      <Html transform distanceFactor={CAMERA_Z}>
        <div
          className={cn(border, "pointer-events-auto cursor-copy")}
          onClick={handleClick}
        >
          <pre className="p-1 font-mono text-[5px] wrap-anywhere whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
          {CORNER_POSITIONS.map(([transform, pos], i) => (
            <span key={i} className={cn(plus, pos, transform, "text-[8px]")}>
              +
            </span>
          ))}
          <span className={cn(label, "text-[5px]")} data-label>
            click to copy
          </span>
          <span className={cn(coord, "text-[5px]")}>
            Feel free to link or contact me.
          </span>
        </div>
      </Html>
    </RigidBody>
  );
};
