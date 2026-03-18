import { Environment, Lightformer } from "@react-three/drei";

export const EnvironmentLight = () => {
  return (
    <Environment preset="night">
      <Lightformer
        intensity={7.5}
        position={[1, 6, 3.6]}
        scale={[10, 50, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        onUpdate={(self: {
          lookAt: (arg0: number, arg1: number, arg2: number) => void;
        }) => self.lookAt(0, 0, 0)}
      />
    </Environment>
  );
};
