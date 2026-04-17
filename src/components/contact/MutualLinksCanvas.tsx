import { Suspense, useMemo } from "react";

import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";

const CAMERA_Z = 8;
const BANNER_W = 2.1;
const BANNER_H = 0.42;

const BANNERS = [
  `<a href=""><img src="/imgs/banner.png" width="200" height="40" /></a>`,
  `<a href=""><img src="/imgs/banner.png" width="200" height="40" /></a>`,
  `<a href=""><img src="/imgs/banner.png" width="200" height="40" /></a>`,
  `<a href=""><img src="/imgs/banner.png" width="200" height="40" /></a>`,
  `<a href=""><img src="/imgs/banner.png" width="200" height="40" /></a>`,
];

const Banner = ({
  html,
  position,
}: {
  html: string;
  position: [number, number, number];
}) => (
  <RigidBody position={position} colliders={false}>
    <CuboidCollider
      args={[BANNER_W, BANNER_H, 0.9]}
      friction={0.5}
      restitution={0.4}
    />
    <mesh visible={true}>
      <boxGeometry args={[BANNER_W, BANNER_H, 0.05]} />
      <meshBasicMaterial />
    </mesh>
    <Html transform distanceFactor={CAMERA_Z}>
      <div
        className="h-10 w-50 [&_a]:cursor-alias"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Html>
  </RigidBody>
);

const Boundaries = () => (
  <>
    {/* 床 */}
    <CuboidCollider args={[10, 0.05, 5.5]} position={[0, -3.5, 0]} />
    {/* 左壁 */}
    <CuboidCollider args={[0.05, 10, 0.5]} position={[-3.5, 0, 0]} />
    {/* 右壁 */}
    <CuboidCollider args={[0.05, 10, 0.5]} position={[3.5, 0, 0]} />
  </>
);

export const MutualLinksCanvas = () => {
  const positions = useMemo<[number, number, number][]>(
    // eslint-disable-next-line react-hooks/purity
    () => BANNERS.map((_, i) => [(Math.random() - 0.5) * 3, 1.5 + i * 1.5, 0]),
    [],
  );

  return (
    <Canvas
      className="size-full"
      gl={{ alpha: true }}
      camera={{ position: [0, 0, CAMERA_Z], fov: 50 }}
    >
      {/* <gridHelper />
      <axesHelper args={[5]} />
      <OrbitControls /> */}
      <Suspense fallback={null}>
        <Physics>
          {BANNERS.map((html, i) => (
            <Banner key={i} html={html} position={positions[i]} />
          ))}
          <Boundaries />
        </Physics>
      </Suspense>
    </Canvas>
  );
};
