import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
   * 物理演算で実際に動いているThree.js meshのref
   */
  liveMeshRef: RefObject<THREE.Mesh | null>;
};

// ラベルのリスト
const labels = ["Asterisk", "Three", "Seven", "Two"];

// 同時に表示するオーバーレイrectの最大数
const MAX_RECTS = 4;

// ワールド座標をスクリーン座標に変換する
const toScreen = (
  worldPos: THREE.Vector3,
  camera: THREE.Camera,
  w: number,
  h: number,
) => {
  // NDC（正規化デバイス座標）に射影してからピクセル座標に変換
  const ndc = worldPos.clone().project(camera);

  return {
    x: (ndc.x * 0.5 + 0.5) * w,
    y: (-ndc.y * 0.5 + 0.5) * h,
  };
};

export const BlobTrackingAnimation = ({ mesh, index, liveMeshRef }: Props) => {
  const { camera, gl } = useThree();

  const divRefs = useRef<HTMLDivElement[]>([]);

  const state = useRef({
    positions: [] as THREE.Vector3[],
    frameCount: 0,
    nextUpdate: 0, // 次に頂点ペアを更新するフレーム番号
    pairs: [] as [number, number][], // 描画する頂点インデックスのペア
    count: 0, // 現在表示中のrect数
  });

  useEffect(() => {
    // メッシュの頂点座標を一度だけキャッシュ（毎フレームのアクセスを避けるため）
    const geo = (mesh as THREE.Mesh).geometry;
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;

    state.current.positions = Array.from({ length: attr.count }, (_, i) =>
      new THREE.Vector3().fromBufferAttribute(attr, i),
    );

    // オーバーレイdivをcanvasの親要素に生成
    const parent = gl.domElement.parentElement?.parentElement;

    if (!parent) return;

    divRefs.current = Array.from({ length: MAX_RECTS }, () => {
      const div = document.createElement("div");

      // 斜線背景＋ボーダー
      div.className =
        "absolute border-[0.5px] border-muted-foreground pointer-events-none hidden box-border";
      div.style.backgroundImage =
        "repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(180,180,180,0.2) 3px, rgba(180,180,180,0.2) 4px)";

      // 4隅に+マークを配置
      const corners: [string, string][] = [
        ["-translate-x-1/2 -translate-y-1/2", "left-0 top-0"],
        ["translate-x-1/2 -translate-y-1/2", "right-0 top-0"],
        ["-translate-x-1/2 translate-y-1/2", "left-0 bottom-0"],
        ["translate-x-1/2 translate-y-1/2", "right-0 bottom-0"],
      ];
      corners.forEach(([transform, pos]) => {
        const c = document.createElement("span");
        c.className = `absolute ${pos} ${transform} font-mono font-bold text-lg text-muted-foreground leading-none`;
        c.textContent = "+";
        div.appendChild(c);
      });

      // 座標ラベル（左下）
      const coord = document.createElement("span");
      coord.className =
        "absolute left-0 top-full font-mono text-xs text-primary whitespace-nowrap";

      div.appendChild(coord);

      // ラベル（右上）
      const label = document.createElement("span");
      label.className =
        "absolute right-0 bottom-full font-mono text-xs text-secondary whitespace-nowrap bg-primary";

      div.appendChild(label);

      parent.appendChild(div);

      return div;
    });

    // クリーンアップ時にdivを削除
    return () => {
      divRefs.current.forEach((d) => d.remove());
      divRefs.current = [];
    };
  }, [gl, mesh]);

  useFrame(() => {
    const liveMesh = liveMeshRef.current;
    const s = state.current;
    if (!liveMesh || s.positions.length < 2) return;

    s.frameCount++;

    // 一定フレームごとにランダムな頂点ペアを再抽選
    if (s.frameCount >= s.nextUpdate) {
      // 次の更新は100～110フレーム後に設定
      s.nextUpdate = s.frameCount + Math.floor(Math.random() * 10) + 1;

      s.count = Math.floor(Math.random() * MAX_RECTS) + 1;

      s.pairs = Array.from({ length: s.count }, () => {
        const idxA = Math.floor(Math.random() * s.positions.length);

        let idxB: number;
        // idxAと異なる頂点をidxBとして選ぶ
        do {
          idxB = Math.floor(Math.random() * s.positions.length);
        } while (idxB === idxA);

        return [idxA, idxB];
      });
    }

    const mw = liveMesh.matrixWorld;
    const w = gl.domElement.clientWidth;
    const h = gl.domElement.clientHeight;

    // 各rectを2頂点のスクリーン座標から計算したバウンディングボックスで配置
    divRefs.current.forEach((div, r) => {
      if (r >= s.count) {
        div.classList.add("hidden");
        return;
      }
      const [idxA, idxB] = s.pairs[r];
      // ローカル座標にmatrixWorldを適用してワールド座標に変換
      const sa = toScreen(
        s.positions[idxA].clone().applyMatrix4(mw),
        camera,
        w,
        h,
      );
      const sb = toScreen(
        s.positions[idxB].clone().applyMatrix4(mw),
        camera,
        w,
        h,
      );

      const left = Math.min(sa.x, sb.x);
      const top = Math.min(sa.y, sb.y);

      div.classList.remove("hidden");
      div.style.left = `${left}px`;
      div.style.top = `${top}px`;
      div.style.width = `${Math.abs(sb.x - sa.x)}px`;
      div.style.height = `${Math.abs(sb.y - sa.y)}px`;

      // ボックス左下に座標を表示（span[4]: 4隅の+の後）
      const coord = div.querySelectorAll("span")[4];
      if (coord) coord.textContent = `x:${left.toFixed(0)} y:${top.toFixed(0)}`;

      // ボックス右上にラベルを表示（span[5]）
      const label = div.querySelectorAll("span")[5];
      const hashed = idxA + idxB;
      if (label) label.textContent = `${labels[index]}:${hashed}`;
    });
  });

  return null;
};
