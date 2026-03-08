import { DotScreen, EffectComposer } from "@react-three/postprocessing";

export const PostProcess = () => {
  return (
    <EffectComposer multisampling={0}>
      <DotScreen angle={Math.PI * 0.5} scale={2.5} />
    </EffectComposer>
  );
};
