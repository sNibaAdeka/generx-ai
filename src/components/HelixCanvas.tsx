'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function HelixModel() {
  const group = useRef<THREE.Group>(null);
  const pairs = Array.from({ length: 44 }, (_, i) => i);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.getElapsedTime() * 0.16;
    group.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.48) * 0.07 - 0.1;
  });

  return (
    <group ref={group} rotation={[0, 0.2, -0.16]}>
      {pairs.map((i) => {
        const angle = i * 0.52;
        const y = (i - 22) * 0.14;
        const radius = 1.18;
        const left = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        const right = new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
        const midpoint = left.clone().add(right).multiplyScalar(0.5);
        const direction = right.clone().sub(left);
        const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        return (
          <group key={i}>
            <mesh position={left}>
              <sphereGeometry args={[0.105, 16, 16]} />
              <meshStandardMaterial color="#2AF0EA" emissive="#0F9E9B" emissiveIntensity={1.4} metalness={0.68} roughness={0.18} />
            </mesh>
            <mesh position={right}>
              <sphereGeometry args={[0.105, 16, 16]} />
              <meshStandardMaterial color={i % 3 === 0 ? '#E8B857' : '#2AF0EA'} emissive={i % 3 === 0 ? '#7D5515' : '#0F9E9B'} emissiveIntensity={1.1} metalness={0.7} roughness={0.18} />
            </mesh>
            <mesh position={midpoint} quaternion={rotation}>
              <cylinderGeometry args={[0.024, 0.024, direction.length(), 8]} />
              <meshStandardMaterial color="#AABED0" transparent opacity={0.38} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function HelixCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 7.2], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} aria-hidden="true">
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 5, 3]} color="#e5fcff" intensity={2.2} />
      <pointLight position={[-3, 0, 2]} color="#2AF0EA" intensity={12} distance={12} />
      <pointLight position={[3, -2, 1]} color="#E8B857" intensity={4} distance={9} />
      <HelixModel />
    </Canvas>
  );
}
