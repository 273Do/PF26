import { memo } from "react";
import type { RefObject } from "react";

import { RigidBody } from "@react-three/rapier";
import type * as THREE from "three";

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

  console.log(href, title);

  return (
    <RigidBody
      colliders="hull"
      ccd
      friction={1}
      restitution={0.9}
      onCollisionExit={() =>
        frameRef.current <= 1000 && console.log("collision")
      }
    >
      <mesh
        geometry={(mesh as THREE.Mesh).geometry}
        castShadow
        receiveShadow
        // onClick={() => {
        //   setArrowTitle(null);
        //   // redirect(href === "/contact" ? href : `/${DEFAULT_LOCALE}${href}`);
        // }}
        // onPointerOver={(e) => {
        //   e.stopPropagation();
        //   document.body.style.cursor = "pointer";
        //   setArrowTitle(title);
        // }}
        // onPointerOut={(e) => {
        //   e.stopPropagation();
        //   document.body.style.cursor = "auto";
        //   setArrowTitle(null);
        // }}
      >
        <Material />
      </mesh>
      {/* <RoutingBox geometry={(mesh as THREE.Mesh).geometry} /> */}
    </RigidBody>
  );
};

export const SplitModel = memo(SplitModelInner);
