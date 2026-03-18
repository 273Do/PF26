import { memo, useRef, useState } from "react";
import type { RefObject } from "react";

import { RigidBody } from "@react-three/rapier";
import type * as THREE from "three";
import { useWebHaptics } from "web-haptics/react";

import { BlobTrackingAnimation } from "./BlobTrackingAnimation";
import { Material } from "./Material";

import { PAGE_LINKS } from "@/consts";

type Props = {
  /**
   * モデルのメッシュ
   */
  mesh: THREE.Object3D;
  /**
   * ルーティング配列の番号
   */
  index: number;
  /**
   * フレーム数を保持するRef
   */
  frameRef: RefObject<number>;
};

const SplitModelInner = ({ mesh, index, frameRef }: Props) => {
  const { href, title } = PAGE_LINKS[PAGE_LINKS.length - index - 1];

  const [hovered, setHovered] = useState<boolean>(false);

  const { trigger, isSupported } = useWebHaptics();
  // 物理演算で動く実際のmeshオブジェクトのref
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <RigidBody
      colliders="hull"
      ccd
      friction={1}
      restitution={0.9}
      onCollisionEnter={() =>
        frameRef.current <= 1500 && isSupported && trigger()
      }
    >
      <mesh
        ref={meshRef}
        geometry={(mesh as THREE.Mesh).geometry}
        castShadow
        receiveShadow
        onClick={() =>
          import("astro:transitions/client").then(({ navigate }) =>
            navigate(href),
          )
        }
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
          setHovered(false);
        }}
      >
        <Material />
        {/* meshRefが確定した後に動くmeshを渡す */}
        <BlobTrackingAnimation
          mesh={mesh}
          hovered={hovered}
          liveMeshRef={meshRef}
          linkTitle={title}
        />
      </mesh>
      {/* <RoutingBox geometry={(mesh as THREE.Mesh).geometry} /> */}
    </RigidBody>
  );
};

export const SplitModel = memo(SplitModelInner);
