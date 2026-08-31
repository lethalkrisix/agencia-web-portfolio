"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";

const GRID_SIZE = 46;
const SPACING = 0.15;

const SOURCES = [
  { x: -1.1, z: -0.6, freq: 2.6, speed: 1.2, amp: 0.22 },
  { x: 1.3, z: 0.4, freq: 2.1, speed: -1.0, amp: 0.2 },
  { x: -0.2, z: 1.6, freq: 3.0, speed: 1.6, amp: 0.14 },
];

function buildGrid() {
  const positions = new Float32Array(GRID_SIZE * GRID_SIZE * 3);
  const colors = new Float32Array(GRID_SIZE * GRID_SIZE * 3);
  let i = 0;
  let c = 0;
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let z = 0; z < GRID_SIZE; z++) {
      positions[i++] = (x - GRID_SIZE / 2) * SPACING;
      positions[i++] = 0;
      positions[i++] = (z - GRID_SIZE / 2) * SPACING;
      colors[c++] = 0.96;
      colors[c++] = 0.77;
      colors[c++] = 0.39;
    }
  }
  return { positions, colors };
}

function InterferenceField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions: basePositions, colors: baseColors } = useMemo(() => buildGrid(), []);
  const livePositionsRef = useRef<Float32Array | null>(null);
  const liveColorsRef = useRef<Float32Array | null>(null);
  if (livePositionsRef.current === null) {
    livePositionsRef.current = basePositions.slice();
    liveColorsRef.current = baseColors.slice();
  }

  useFrame((state: RootState) => {
    const points = pointsRef.current;
    const livePositions = livePositionsRef.current;
    const liveColors = liveColorsRef.current;
    if (!points || !livePositions || !liveColors) return;

    const t = state.clock.elapsedTime;
    const posAttr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colorAttr = points.geometry.getAttribute("color") as THREE.BufferAttribute;

    for (let i = 0, ci = 0; i < livePositions.length; i += 3, ci += 3) {
      const x = basePositions[i];
      const z = basePositions[i + 2];
      let y = 0;
      for (const s of SOURCES) {
        const dist = Math.sqrt((x - s.x) ** 2 + (z - s.z) ** 2);
        y += Math.sin(dist * s.freq - t * s.speed) * s.amp * Math.exp(-dist * 0.22);
      }
      livePositions[i + 1] = y;

      const glow = THREE.MathUtils.clamp(0.45 + y * 1.6, 0.15, 1);
      liveColors[ci] = 0.96 * glow + 0.1;
      liveColors[ci + 1] = 0.77 * glow + 0.05;
      liveColors[ci + 2] = 0.39 * glow * 0.6;
    }

    posAttr.set(livePositions);
    posAttr.needsUpdate = true;
    colorAttr.set(liveColors);
    colorAttr.needsUpdate = true;

    points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, state.pointer.x * 0.18, 0.03);
  });

  return (
    <points ref={pointsRef} rotation={[-0.6, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[basePositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[baseColors, 3]} />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.038} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Starts visible: the Hero is the first thing on screen, so the field
  // should animate immediately, before the observer has reported anything.
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 1.9, 4.6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        // Stop driving the interference field's rAF loop while the Hero is
        // scrolled out of view — a GPU/battery guard for an invisible
        // section, never a motion-preference toggle: the field always
        // renders and animates in full whenever it is on screen.
        frameloop={isVisible ? "always" : "never"}
      >
        <fog attach="fog" args={["#0a0a0f", 3, 6.8]} />
        <ambientLight intensity={0.5} />
        <InterferenceField />
      </Canvas>
    </div>
  );
}
