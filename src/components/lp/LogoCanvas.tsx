import { Suspense } from "react";

import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { EnvironmentLight } from "./EnvironmentLight";
import { Models } from "./Models";
import { PostProcess } from "./PostProcess";

export const LogoCanvas = () => {
  return (
    <div className="fixed top-0 left-0 z-50 hidden h-screen w-screen sm:block">
      <Canvas
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          stencil: false,
          depth: true,
          alpha: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ fov: 30, near: 0.1, far: 1000, position: [0, 2.25, 5] }}
      >
        {/* <gridHelper />
        <axesHelper args={[5]} /> */}
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} enablePan={false} />
          {/* <OrbitControls /> */}
          <Models />
          <EnvironmentLight />
          <PostProcess />
        </Suspense>
      </Canvas>
      <Loader
        containerStyles={{
          background: "transparent",
          transition: "opacity 600ms ease",
        }}
        innerStyles={{
          width: 200,
          height: 1,
          background: "var(--border)",
        }}
        barStyles={{
          height: 1,
          background: "var(--foreground)",
          transition: "transform 200ms ease",
        }}
        dataStyles={{
          color: "transparent",
        }}
      />
    </div>
  );
};
