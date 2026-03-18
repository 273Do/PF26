import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { BlOB_TRACKING_ClASS, CORNER_POSITIONS, MAX_RECTS } from "@/consts";
import { cn } from "@/lib/utils";

type Props = {
  /**
   * モデルのメッシュ
   */
  mesh: THREE.Object3D;
  /**
   * ホバーしているかどうか
   */
  hovered: boolean;
  /**
   * 物理演算で実際に動いているThree.js meshのref
   */
  liveMeshRef: RefObject<THREE.Mesh | null>;
  /**
   * 遷移リンクタイトル
   */
  linkTitle: string;
};

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

type OverlayDiv = {
  /**
   * オーバーレイdiv要素
   */
  el: HTMLDivElement;
  /**
   * 座標表示用span要素
   */
  coord: HTMLSpanElement;
  /**
   * ラベル表示用span要素
   */
  label: HTMLSpanElement;
};

const createOverlayDiv = (border: string, diagonalLine: string): OverlayDiv => {
  const el = document.createElement("div");
  el.className = border;
  el.style.backgroundImage = diagonalLine;

  const { label: labelStyle, coord: coordStyle, plus } = BlOB_TRACKING_ClASS;

  // 4隅の+記号を生成
  CORNER_POSITIONS.forEach(([transform, pos]) => {
    const c = document.createElement("span");
    c.className = cn(plus, pos, transform);
    c.textContent = "+";
    el.appendChild(c);
  });

  const coord = document.createElement("span");
  coord.className = coordStyle;
  el.appendChild(coord);

  // ラベルはオプション（bounding box用divには表示しない）
  const label = document.createElement("span");
  label.className = labelStyle;
  el.appendChild(label);

  return { el, coord, label };
};

export const BlobTrackingAnimation = ({
  mesh,
  hovered,
  liveMeshRef,
  linkTitle,
}: Props) => {
  const { camera, gl } = useThree();

  const { border, diagonalLine } = BlOB_TRACKING_ClASS;

  // divRefs: el + coord + label の参照をキャッシュ
  const divRefs = useRef<OverlayDiv[]>([]);
  const bboxRef = useRef<OverlayDiv | null>(null);

  // box同士を繋ぐSVG line要素
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lineRefs = useRef<SVGLineElement[]>([]);

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

    // BlobTracking表示用div
    divRefs.current = Array.from({ length: MAX_RECTS }, () => {
      const overlay = createOverlayDiv(border, diagonalLine);
      parent.appendChild(overlay.el);
      return overlay;
    });

    // BoundingBox表示用div
    const bbox = createOverlayDiv(border, diagonalLine);
    parent.appendChild(bbox.el);
    bboxRef.current = bbox;

    // box同士を繋ぐSVG（MAX_RECTS - 1本の線）
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute(
      "class",
      "absolute inset-0 w-full h-full pointer-events-none overflow-visible",
    );
    parent.appendChild(svg);
    svgRef.current = svg;

    lineRefs.current = Array.from({ length: MAX_RECTS - 1 }, () => {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("stroke", "currentColor");
      line.setAttribute("stroke-width", "0.5");
      line.setAttribute("stroke-dasharray", "4 4");
      line.setAttribute("class", "text-muted-foreground hidden");
      svg.appendChild(line);
      return line;
    });

    // クリーンアップ時に削除
    return () => {
      divRefs.current.forEach((o) => o.el.remove());
      divRefs.current = [];
      bbox.el.remove();
      bboxRef.current = null;
      svg.remove();
      svgRef.current = null;
      lineRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, mesh]);

  useFrame(() => {
    const liveMesh = liveMeshRef.current;
    const s = state.current;
    if (!liveMesh || s.positions.length < 2) return;

    s.frameCount++;

    // BlobTracking表示用の頂点ペアを一定フレームごとにランダムに更新
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

    // BlobTracking：各rectを2頂点のスクリーン座標から計算したバウンディングボックスで配置
    divRefs.current.forEach((overlay, r) => {
      if (r >= s.count) {
        overlay.el.classList.add("hidden");
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

      overlay.el.classList.remove("hidden");
      overlay.el.style.left = `${left}px`;
      overlay.el.style.top = `${top}px`;
      overlay.el.style.width = `${Math.abs(sb.x - sa.x)}px`;
      overlay.el.style.height = `${Math.abs(sb.y - sa.y)}px`;

      overlay.coord.textContent = `x:${left.toFixed(0)} y:${top.toFixed(0)}`;

      const hashed = idxA + idxB;
      const text = linkTitle[0].toUpperCase() + linkTitle.slice(1);
      overlay.label.textContent = `${text}:${hashed}`;
    });

    // 表示中のbox同士を中央座標で線で繋ぐ
    lineRefs.current.forEach((line, i) => {
      if (i >= s.count - 1) {
        line.classList.add("hidden");
        return;
      }
      const a = divRefs.current[i];
      const b = divRefs.current[i + 1];
      if (!a || !b) return;

      const ax = parseFloat(a.el.style.left) + parseFloat(a.el.style.width) / 2;
      const ay = parseFloat(a.el.style.top) + parseFloat(a.el.style.height) / 2;
      const bx = parseFloat(b.el.style.left) + parseFloat(b.el.style.width) / 2;
      const by = parseFloat(b.el.style.top) + parseFloat(b.el.style.height) / 2;

      line.classList.remove("hidden");
      line.setAttribute("x1", `${ax}`);
      line.setAttribute("y1", `${ay}`);
      line.setAttribute("x2", `${bx}`);
      line.setAttribute("y2", `${by}`);
    });

    // ホバー時にBoundingBboxをスクリーン座標で表示
    const bbox = bboxRef.current;
    if (bbox) {
      if (hovered) {
        // geometry の全頂点をワールド座標に変換してスクリーン座標に投影し、1パスでmin/maxを計算
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;

        s.positions.forEach((p) => {
          const sp = toScreen(p.clone().applyMatrix4(mw), camera, w, h);
          if (sp.x < minX) minX = sp.x;
          if (sp.y < minY) minY = sp.y;
          if (sp.x > maxX) maxX = sp.x;
          if (sp.y > maxY) maxY = sp.y;
        });

        bbox.el.classList.remove("hidden");
        bbox.el.style.left = `${minX}px`;
        bbox.el.style.top = `${minY}px`;
        bbox.el.style.width = `${maxX - minX}px`;
        bbox.el.style.height = `${maxY - minY}px`;

        bbox.coord.textContent = `x:${minX.toFixed(0)} y:${minY.toFixed(0)}`;

        const text = linkTitle[0].toUpperCase() + linkTitle.slice(1);
        bbox.label.textContent = text;
      } else {
        bbox.el.classList.add("hidden");
      }
    }
  });

  return null;
};
