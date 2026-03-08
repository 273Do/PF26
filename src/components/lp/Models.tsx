import { useRef, useState } from "react";

import { useGLTF } from "@react-three/drei";
import type { RootState } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, Physics } from "@react-three/rapier";
import type * as THREE from "three";

import { SplitModel } from "./SplitModel";

const easeOutCirc = (x: number) => {
  return Math.sqrt(1 - Math.pow(x - 1, 4));
};

export const Models = () => {
  const { nodes } = useGLTF("glb/logo.glb");

  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef(0);
  const [isPhysicsPaused, setIsPhysicsPaused] = useState(true);

  useFrame((state: RootState, delta: number) => {
    const meshGroup = meshRef.current;

    if (meshGroup) {
      // 最初の200フレームで回転アニメーション
      if (frameRef.current <= 200) {
        const frame = frameRef.current;
        const rotSpeed = easeOutCirc(frame / 240) * Math.PI * 10;

        // z軸中心に時計回りに回転
        meshGroup.rotation.z = rotSpeed;

        // y軸方向（上下）にsin波で揺れる
        meshGroup.position.y = Number(Math.sin(state.clock.elapsedTime)) * 0.2;
      } else {
        meshGroup.rotation.z += delta * 0.2;

        // 回転アニメーション終了後、物理演算を有効にする
        if (isPhysicsPaused) {
          setIsPhysicsPaused(false);
        }
      }

      frameRef.current += 1;
    }
  });

  return (
    <Physics paused={isPhysicsPaused}>
      <group scale={30} rotation={[Math.PI / 2, 0, 0]} ref={meshRef}>
        {Object.entries(nodes)
          .filter(([_, obj]) => obj.type === "Mesh")
          .map(([key, mesh], i) => {
            return <SplitModel key={key} mesh={mesh} index={i} frameRef={frameRef} />;
          })}
      </group>
      <CuboidCollider
        position={[0, -1.7, 0]}
        args={[10, 0.75, 10]}
        restitution={0.9}
      />
    </Physics>
  );
};
