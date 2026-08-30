"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";

function fibonacciSphere(samples: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  return points;
}

function buildNetworkGeometry(nodeCount: number, radius: number, maxLinkDistance: number) {
  const nodes = fibonacciSphere(nodeCount, radius);
  const linePositions: number[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < maxLinkDistance) {
        linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }
  }

  const nodePositions = new Float32Array(nodes.length * 3);
  nodes.forEach((point, index) => point.toArray(nodePositions, index * 3));

  return {
    nodePositions,
    linePositions: new Float32Array(linePositions),
  };
}

function NetworkCore() {
  const groupRef = useRef<THREE.Group>(null);
  const { nodePositions, linePositions } = useMemo(() => buildNetworkGeometry(56, 1.8, 0.85), []);

  useFrame((state: RootState, delta: number) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y += delta * 0.09;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, state.pointer.y * 0.2, 0.03);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, -state.pointer.x * 0.15, 0.03);
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#f5a623" transparent opacity={0.22} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#f5c463" size={0.05} sizeAttenuation transparent opacity={0.95} />
      </points>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={["#0a0a0f", 4, 8.5]} />
      <ambientLight intensity={0.5} />
      <NetworkCore />
    </Canvas>
  );
}
