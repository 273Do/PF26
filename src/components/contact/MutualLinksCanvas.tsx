/* eslint-disable react-hooks/purity */
import { Suspense, useMemo } from "react";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";

import { HtmlCodePanel } from "./HtmlCodePanel";

export const CAMERA_Z = 8;
const BANNER_W = 1;
const BANNER_H = 0.2;

const IS_DEBUG = false;

const Banner = ({
  html,
  position,
}: {
  html: string;
  position: [number, number, number];
}) => (
  <RigidBody
    position={position}
    colliders={false}
    enabledTranslations={[true, true, false]}
    enabledRotations={[false, false, true]}
  >
    <CuboidCollider args={[BANNER_W, BANNER_H, 0.9]} />
    <mesh visible={true}>
      <boxGeometry args={[BANNER_W, BANNER_H, 0.05]} />
      <meshBasicMaterial />
    </mesh>
    <Html transform distanceFactor={CAMERA_Z}>
      <div
        className="h-5 w-25 [&_a]:cursor-alias"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Html>
  </RigidBody>
);

const Boundaries = () => (
  <>
    {/* 床 */}
    <CuboidCollider args={[10, 0.05, 5.5]} position={[0, -3.8, 0]} />
    {/* 左壁 */}
    <CuboidCollider args={[0.05, 10, 0.5]} position={[-3, 0, 0]} />
    {/* 右壁 */}
    <CuboidCollider args={[0.05, 10, 0.5]} position={[3, 0, 0]} />
  </>
);

type Props = {
  banners: string[];
  bannerCode: string;
};
export const MutualLinksCanvas = ({ banners, bannerCode }: Props) => {
  const positions = useMemo<[number, number, number][]>(
    () => banners.map((_, i) => [(Math.random() - 0.5) * 3.5, 3 + i * 2, 0]),
    [],
  );
  const panelPosition = useMemo<[number, number, number]>(
    () => [(Math.random() - 0.5) * 1.5, 2.0, 0],
    [],
  );

  return (
    <Canvas
      className="size-full"
      gl={{ alpha: true }}
      camera={{ position: [0, 0, CAMERA_Z], fov: 50 }}
    >
      {IS_DEBUG && (
        <>
          <gridHelper />
          <axesHelper args={[5]} />
          <OrbitControls />
        </>
      )}
      <Suspense fallback={null}>
        <Physics debug={IS_DEBUG}>
          {banners.map((html, i) => (
            <Banner key={i} html={html} position={positions[i]} />
          ))}
          {bannerCode && (
            <HtmlCodePanel code={bannerCode} position={panelPosition} />
          )}
          <Boundaries />
        </Physics>
      </Suspense>
    </Canvas>
  );
};
