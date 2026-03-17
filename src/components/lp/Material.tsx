import { MeshTransmissionMaterial, Outlines } from "@react-three/drei";

export const Material = () => {
  return (
    <>
      <Outlines thickness={1.5} color="#ffffff" />
      <MeshTransmissionMaterial
        roughness={0.4}
        backside
        backsideThickness={15}
        thickness={10}
        distortion={20}
        temporalDistortion={0.01}
        resolution={768}
        samples={15}
      />
      {/* <meshNormalMaterial /> */}
      {/* <meshStandardMaterial color={"#000"} /> */}
    </>
  );
};
