import { Html } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { CAMERA_Z } from "./MutualLinksCanvas";

import { CORNER_POSITIONS } from "@/consts";

const PANEL_W = 2.1;
const PANEL_H = 0.9;

export const HtmlCodePanel = ({
  code,
  position,
}: {
  code: string;
  position: [number, number, number];
}) => {
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
    <RigidBody position={position} colliders={false} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}>
      <CuboidCollider args={[PANEL_W, PANEL_H / 2, 0.9]} />
      <Html transform distanceFactor={CAMERA_Z}>
        <div
          className="group relative cursor-copy border-[0.5px] border-dashed border-muted-foreground p-1"
          onClick={handleClick}
        >
          <pre className="font-mono text-[5px] wrap-anywhere whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
          {CORNER_POSITIONS.map(([transform, pos], i) => (
            <span
              key={i}
              className={`absolute font-mono text-[8px] leading-none font-bold text-muted-foreground ${pos} ${transform}`}
            >
              +
            </span>
          ))}
          <span
            className="
              absolute right-0 bottom-full bg-foreground font-mono text-xs text-[5px] whitespace-nowrap text-background
            "
            data-label
          >
            click to copy
          </span>
        </div>
      </Html>
    </RigidBody>
  );
};
