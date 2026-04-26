import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import CncMachine from './CncMachine';

// Nhận x, y, z từ App.jsx
export default function Machine3D({ x, y, z }, feedRate) {
  return (
    <Canvas shadows camera={{ position: [5, 4, 6], fov: 50 }}>
      {/* Sân khấu ảo giúp đổ bóng và đánh sáng tự động */}
      <Stage environment="city" intensity={0.5} adjustCamera={false}>
        {/* Truyền x,y,z vào con máy */}
      <CncMachine x={x} y={y} z={z} feedRate={feedRate} />
      </Stage>

      {/* OrbitControls giúp dùng chuột xoay góc nhìn */}
      <OrbitControls makeDefault />
    </Canvas>
  );
}