import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ==========================================================
// VẬT LIỆU CHUẨN CÔNG NGHIỆP
// ==========================================================
const materials = {
  structure: { color: "#27272a", metalness: 0.7, roughness: 0.4 },
  aluminum: { color: "#a1a1aa", metalness: 0.9, roughness: 0.1 },
  rail: { color: "#e4e4e7", metalness: 1.0, roughness: 0.05 },
  motor: { color: "#18181b", metalness: 0.8, roughness: 0.2 },
  tool: { color: "#f59e0b", metalness: 1.0, roughness: 0.1 },
  cable: { color: "#09090b", metalness: 0.2, roughness: 0.8 },
  wood: { color: "#8b5e3c", metalness: 0, roughness: 1.0 },
};

export default function CncMachine({ x = 0, y = 0, z = 0, feedRate = 100 }) {
  const gantryRef = useRef();   // Trục Y
  const carriageRef = useRef(); // Trục X
  const spindleRef = useRef();  // Trục Z

  // 1. MAPPING TỌA ĐỘ PLC (mm) -> 3D (Units)
  const targets = useMemo(() => {
    const safeX = Math.max(0, Math.min(x, 1300));
    const safeY = Math.max(0, Math.min(y, 2500));
    const safeZ = Math.max(-200, Math.min(z, 0));

    return {
      x: -2.2 + (safeX / 1300) * 20,
      y: -3.5 + (safeY / 2500) * 25.5,
      z: (safeZ / -400) * -1.2,
    };
  }, [x, y, z]);

  // 2. LOGIC DI CHUYỂN TỐC ĐỘ CAO (LERP)
  useFrame(() => {
    // smoothing: 0.1 (mượt/chậm) -> 1.0 (tức thời/khớp tuyệt đối)
    // Với dữ liệu PLC 20ms, mức 0.4 là lý tưởng để UI bám sát PLC mà không trễ.
    const smoothing = 0.4;

    if (gantryRef.current) {
      gantryRef.current.position.z = THREE.MathUtils.lerp(
        gantryRef.current.position.z,
        targets.y,
        smoothing
      );
    }

    if (carriageRef.current) {
      carriageRef.current.position.x = THREE.MathUtils.lerp(
        carriageRef.current.position.x,
        targets.x,
        smoothing
      );
    }

    if (spindleRef.current) {
      spindleRef.current.position.y = THREE.MathUtils.lerp(
        spindleRef.current.position.y,
        targets.z,
        smoothing
      );
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* 1. BASE STATIC */}
      <group name="STATIC_BASE">
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[6, 0.2, 8]} />
          <meshStandardMaterial {...materials.structure} />
        </mesh>

        {/* Chân máy */}
        {[-2.8, 2.8].map((px) =>
          [-3.8, 3.8].map((pz) => (
            <mesh key={`${px}-${pz}`} position={[px, -0.2, pz]}>
              <boxGeometry args={[0.3, 0.4, 0.3]} />
              <meshStandardMaterial {...materials.structure} />
            </mesh>
          ))
        )}

        {/* Bàn máy T-Slot & Phôi */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[5.6, 0.1, 7.6]} />
          <meshStandardMaterial {...materials.aluminum} />
        </mesh>

        {/* Ray trục Y */}
        <mesh position={[-2.9, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 8]} />
          <meshStandardMaterial {...materials.rail} />
        </mesh>
        <mesh position={[2.9, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 8]} />
          <meshStandardMaterial {...materials.rail} />
        </mesh>
      </group>

      {/* 2. TRỤC Y (GANTRY) */}
      <group ref={gantryRef} position={[0, 0.35, -3.5]}>
        {[-2.9, 2.9].map((px, i) => (
          <group key={i} position={[px, 0.8, 0]}>
            <mesh>
              <boxGeometry args={[0.3, 1.5, 0.8]} />
              <meshStandardMaterial {...materials.aluminum} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshStandardMaterial {...materials.motor} />
            </mesh>
          </group>
        ))}

        {/* Dầm ngang & Ray X */}
        <mesh position={[0, 1.6, -0.2]}>
          <boxGeometry args={[6.1, 0.8, 0.3]} />
          <meshStandardMaterial {...materials.structure} />
        </mesh>
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 5.8]} />
          <meshStandardMaterial {...materials.rail} />
        </mesh>
        <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 5.8]} />
          <meshStandardMaterial {...materials.rail} />
        </mesh>

        {/* 3. TRỤC X (CARRIAGE) */}
        <group ref={carriageRef} position={[-2.2, 1.6, 0.15]}>
          <mesh>
            <boxGeometry args={[1, 1.2, 0.1]} />
            <meshStandardMaterial {...materials.aluminum} />
          </mesh>

          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial {...materials.motor} />
          </mesh>

          <mesh position={[-0.35, 0, 0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 1]} />
            <meshStandardMaterial {...materials.rail} />
          </mesh>
          <mesh position={[0.35, 0, 0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 1]} />
            <meshStandardMaterial {...materials.rail} />
          </mesh>

          {/* 4. TRỤC Z (SPINDLE) */}
          <group ref={spindleRef} position={[0, 0, 0.2]}>
            <mesh>
              <boxGeometry args={[0.8, 0.8, 0.1]} />
              <meshStandardMaterial {...materials.structure} />
            </mesh>

            <group position={[0, -0.2, 0.2]}>
              <mesh>
                <cylinderGeometry args={[0.18, 0.18, 0.8, 32]} />
                <meshStandardMaterial {...materials.rail} />
              </mesh>

              {[-0.1, 0, 0.1].map((oy, i) => (
                <mesh key={i} position={[0, oy + 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.19, 0.01, 8, 32]} />
                  <meshStandardMaterial color="black" />
                </mesh>
              ))}
              <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.4]} />
                <meshStandardMaterial {...materials.tool} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}