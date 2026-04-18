import { Html } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { CAMERA_Z } from "./MutualLinksCanvas";

import { BlOB_TRACKING_ClASS, CORNER_POSITIONS } from "@/consts";
import { cn } from "@/lib/utils";

const PANEL_W = 2.1;
const PANEL_H = 0.9;

const CodePanelContent = ({ code }: { code: string }) => {
  const { border, label, coord, plus } = BlOB_TRACKING_ClASS;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const codeEl = e.currentTarget.querySelector("code");
    navigator.clipboard.writeText(codeEl?.textContent ?? "");
    const labelEl = e.currentTarget.querySelector(
      "[data-label]",
    ) as HTMLElement | null;
    if (labelEl) {
      labelEl.textContent = "copied!";
      setTimeout(() => {
        labelEl.textContent = "click to copy";
      }, 2000);
    }
  };
  return (
    <div
      className={cn(border, "pointer-events-auto cursor-copy")}
      onClick={handleClick}
    >
      <pre className="p-1 font-mono text-xs wrap-anywhere whitespace-pre-wrap sm:text-[4px]">
        <code>{code}</code>
      </pre>
      {CORNER_POSITIONS.map(([transform, pos], i) => (
        <span
          key={i}
          className={cn(plus, pos, transform, "text-xs sm:text-[8px]")}
        >
          +
        </span>
      ))}
      <span className={cn(label, "text-xs sm:text-[5px]")} data-label>
        click to copy
      </span>
      <span className={cn(coord, "text-xs sm:text-[5px]")}>
        Feel free to link or contact me.
      </span>
    </div>
  );
};

type Props = {
  /**
   * htmlコード
   */
  code: string;
  /**
   * 3D空間上の座標、未定義の場合は通常のDOMとして描画
   */
  position?: [number, number, number];
};

export const HtmlCodePanel = ({ code, position }: Props) => {
  if (!position) return <CodePanelContent code={code} />;

  return (
    <RigidBody
      position={position}
      colliders={false}
      enabledTranslations={[true, true, false]}
      enabledRotations={[false, false, true]}
    >
      <CuboidCollider args={[PANEL_W, PANEL_H / 2, 0.9]} />
      <Html transform distanceFactor={CAMERA_Z}>
        <CodePanelContent code={code} />
      </Html>
    </RigidBody>
  );
};
