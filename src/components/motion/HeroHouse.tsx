"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * HeroHouse — a real-time 3D exterior architectural visualization.
 *
 * This replaces the earlier layered-SVG approach entirely: the house, tree,
 * rain, and lightning are genuine Three.js objects rendered through
 * react-three-fiber, not flat illustrations with fake depth.
 *
 * NEW DEPENDENCIES REQUIRED — not previously in this project:
 *   npm install three @react-three/fiber @react-three/drei
 *   npm install -D @types/three
 *
 * Weather is a single continuously-interpolated state (see `sampleWeather`)
 * rather than three discrete scenes, so RAIN → STORM → SUNNY reads as one
 * unbroken 15s loop instead of three cuts. All per-frame scene mutation is
 * done imperatively via refs (no React state in the render loop) to keep
 * this cheap enough to run as a homepage hero.
 */

// ---------------------------------------------------------------------------
// Palette — Three.js materials can't consume this project's CSS custom
// properties at runtime, so these are the same desert/premium palette baked
// as plain hex. Worth reconciling with the design system's real token
// values once this is wired into the actual repo.
// ---------------------------------------------------------------------------
const CONCRETE = "#e7e0d2";
const CONCRETE_DARK = "#cfc4ae";
const WOOD = "#a9805a";
const WOOD_DARK = "#6f5138";
const METAL = "#2b2b30";
const METAL_DARK = "#161619";
const GLASS_TINT = "#b9c7cc";
const WARM_GLOW = "#e79a55";

// ---------------------------------------------------------------------------
// Weather model
// ---------------------------------------------------------------------------

type Weather = {
  rain: number; // 0–1 particle density
  wind: number; // 0–1 tree-sway amplitude
  dark: number; // 0 sunny .. 1 storm-dark, drives sky/fog/ambient
  sun: number; // 0–1 directional "sun" intensity
  fog: number; // 0–1 fog density factor
  wet: number; // 0–1 ground wetness (color + gloss)
  glow: number; // 0–1 interior window light
  warmth: number; // 0 cool overcast .. 1 golden-hour warm
};

type WeatherState = Weather & { lightning: number; t: number };
type WeatherRef = { current: WeatherState };

const CYCLE = 15; // seconds, per spec: 0–5 rain, 5–10 storm, 10–15 sunny, loop
const LIGHTNING_TIMES = [6.5, 8, 9.5];
const SUNNY_FREEZE_T = 12.5; // frame used when prefers-reduced-motion is on

// Keyframes the weather is continuously interpolated between (smoothstep, not
// linear) so RAIN → STORM feels like intensification and STORM → SUNNY feels
// like the storm clearing, rather than a jump cut.
const KEYFRAMES: { t: number; w: Weather }[] = [
  { t: 0, w: { rain: 0.32, wind: 0.22, dark: 0.42, sun: 0.5, fog: 0.16, wet: 0.4, glow: 0.42, warmth: 0.35 } },
  { t: 5, w: { rain: 0.68, wind: 0.55, dark: 0.66, sun: 0.32, fog: 0.26, wet: 0.58, glow: 0.55, warmth: 0.22 } },
  { t: 7.5, w: { rain: 0.92, wind: 0.9, dark: 0.88, sun: 0.16, fog: 0.34, wet: 0.75, glow: 0.68, warmth: 0.15 } },
  { t: 10, w: { rain: 0.4, wind: 0.42, dark: 0.5, sun: 0.5, fog: 0.2, wet: 0.55, glow: 0.5, warmth: 0.45 } },
  { t: 12.5, w: { rain: 0, wind: 0.08, dark: 0.04, sun: 1, fog: 0.04, wet: 0.12, glow: 0.22, warmth: 0.85 } },
  { t: 15, w: { rain: 0.32, wind: 0.22, dark: 0.42, sun: 0.5, fog: 0.16, wet: 0.4, glow: 0.42, warmth: 0.35 } },
];

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerpWeather(a: Weather, b: Weather, t: number): Weather {
  const s = smoothstep(0, 1, t);
  const L = (k: keyof Weather) => a[k] + (b[k] - a[k]) * s;
  return {
    rain: L("rain"),
    wind: L("wind"),
    dark: L("dark"),
    sun: L("sun"),
    fog: L("fog"),
    wet: L("wet"),
    glow: L("glow"),
    warmth: L("warmth"),
  };
}

function sampleWeather(t: number): Weather {
  const clamped = ((t % CYCLE) + CYCLE) % CYCLE;
  for (let i = 0; i < KEYFRAMES.length - 1; i += 1) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (clamped >= a.t && clamped <= b.t) {
      const local = (clamped - a.t) / (b.t - a.t);
      return lerpWeather(a.w, b.w, local);
    }
  }
  return KEYFRAMES[0].w;
}

// Unpredictable but scripted flashes, only ever active during the storm
// window (5–10s). Each flash is a fast attack / short exponential decay so
// it reads as lightning rather than a strobe.
function sampleLightning(t: number): number {
  const clamped = ((t % CYCLE) + CYCLE) % CYCLE;
  let peak = 0;
  for (const f of LIGHTNING_TIMES) {
    const dt = clamped - f;
    if (dt >= 0 && dt < 0.5) {
      const attack = dt < 0.045 ? dt / 0.045 : 1;
      const decay = Math.exp(-dt * 9);
      peak = Math.max(peak, attack * decay);
    }
  }
  return peak;
}

function WeatherClock({ weatherRef, reduceMotion }: { weatherRef: WeatherRef; reduceMotion: boolean }) {
  useFrame((state) => {
    const t = reduceMotion ? SUNNY_FREEZE_T : state.clock.elapsedTime % CYCLE;
    const w = sampleWeather(t);
    const lightning = reduceMotion ? 0 : sampleLightning(t);
    const ref = weatherRef.current;
    ref.t = t;
    ref.rain = w.rain;
    ref.wind = w.wind;
    ref.dark = w.dark;
    ref.sun = w.sun;
    ref.fog = w.fog;
    ref.wet = w.wet;
    ref.glow = w.glow;
    ref.warmth = w.warmth;
    ref.lightning = lightning;
  });
  return null;
}

// ---------------------------------------------------------------------------
// Lighting + fog — this is what makes the house/tree/mountains actually
// "react to weather": everything else just sits under physically-based
// materials and picks up whatever this casts.
// ---------------------------------------------------------------------------

function SceneLighting({ weatherRef }: { weatherRef: WeatherRef }) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const ambRef = useRef<THREE.AmbientLight>(null);
  const flashRef = useRef<THREE.PointLight>(null);
  const fogRef = useRef<THREE.FogExp2>(null);

  const skyCool = useMemo(() => new THREE.Color("#7c8797"), []);
  const skyWarm = useMemo(() => new THREE.Color("#f6c98d"), []);
  const sunCool = useMemo(() => new THREE.Color("#aab6c9"), []);
  const sunWarm = useMemo(() => new THREE.Color("#ffcf8f"), []);
  const fogCool = useMemo(() => new THREE.Color("#c7ccd4"), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const w = weatherRef.current;
    const sun = sunRef.current;
    const hemi = hemiRef.current;
    const amb = ambRef.current;
    const flash = flashRef.current;
    const fog = fogRef.current;

    if (!sun || !hemi || !amb || !flash || !fog) return;

    tmpColor.copy(sunCool).lerp(sunWarm, w.warmth);
    sun.color.copy(tmpColor);
    sun.intensity = 0.4 + w.sun * 2.4 + w.lightning * 3.2;
    sun.position.set(6 - w.warmth * 2, 7 + w.sun * 2, 4);

    tmpColor.copy(skyCool).lerp(skyWarm, w.warmth);
    hemi.color.copy(tmpColor);
    hemi.intensity = 0.35 + (1 - w.dark) * 0.5;

    amb.intensity = 0.15 + w.lightning * 1.3;
    flash.intensity = w.lightning * 6;

    fog.color.copy(tmpColor).lerp(fogCool, 0.3);
    fog.density = 0.008 + w.fog * 0.05;
  });

  return (
    <>
      <fogExp2 ref={fogRef} args={["#8a94a3", 0.02]} />

      <ambientLight ref={ambRef} intensity={0.2} />

      <hemisphereLight
        ref={hemiRef}
        args={["#8fa3bd", "#4a4438", 0.5]}
      />

      <directionalLight
        ref={sunRef}
        castShadow
        position={[6, 8, 4]}
        intensity={1.2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      <pointLight
        ref={flashRef}
        position={[-10, 14, -6]}
        intensity={0}
        color="#dbe6ff"
        distance={40}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Ground, driveway, walkway, distant ridge
// ---------------------------------------------------------------------------

function Ground({ weatherRef }: { weatherRef: WeatherRef }) {
  const groundMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const baseColor = useMemo(() => new THREE.Color("#cbb99f"), []);
  const wetColor = useMemo(() => new THREE.Color("#8f8574"), []);

  useFrame(() => {
    const w = weatherRef.current;
    const mat = groundMatRef.current;
    if (!mat) return;
    mat.color.copy(baseColor).lerp(wetColor, w.wet);
    mat.roughness = 0.95 - w.wet * 0.65;
  });

  return (
  <group>
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]}
      receiveShadow
    >
      <circleGeometry args={[6, 48]} />
      <meshStandardMaterial
        ref={groundMatRef}
        color="#cbb99f"
        roughness={0.95}
      />
    </mesh>


    {/* front walkway, leading to the entry */}
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[-0.5, 0.005, 4]}
    >
      <planeGeometry args={[1.1, 2]} />
      <meshStandardMaterial color="#c7bfae" roughness={0.85} />
    </mesh>
  </group>
);
}

// ---------------------------------------------------------------------------
// Windows — frame + glass + an independently-lit "interior glow" panel, so
// the house reads as inhabited without modeling an interior.
// ---------------------------------------------------------------------------

function GlassWindow({
  weatherRef,
  position,
  size,
  rotationY = 0,
}: {
  weatherRef: WeatherRef;
  position: [number, number, number];
  size: [number, number];
  rotationY?: number;
}) {
  const glowRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (glowRef.current) glowRef.current.emissiveIntensity = weatherRef.current.glow * 1.3;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[size[0] + 0.1, size[1] + 0.1, 0.06]} />
        <meshStandardMaterial color={METAL_DARK} roughness={0.4} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[size[0] - 0.06, size[1] - 0.06]} />
        <meshStandardMaterial ref={glowRef} color="#241a10" emissive={WARM_GLOW} emissiveIntensity={0.3} roughness={1} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[size[0] - 0.06, size[1] - 0.06, 0.02]} />
        <meshPhysicalMaterial color={GLASS_TINT} roughness={0.06} transmission={0.6} thickness={0.3} ior={1.45} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// House — a real 3D asymmetric massing (garage + glass-walled living volume
// + cantilevered second floor + terrace), built from actual volumes so it
// reads correctly from all 8 angles, not just the default camera position.
// ---------------------------------------------------------------------------

function House({ weatherRef }: { weatherRef: WeatherRef }) {
  return (
    <group position={[0, 0, 0]}>
      {/* GARAGE — single-story volume, left */}
      <mesh position={[-2.9, 1.45, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 2.9, 3.4]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.85} />
      </mesh>
      <mesh position={[-2.9, 1.25, 1.83]}>
        <boxGeometry args={[2.7, 2.3, 0.06]} />
        <meshStandardMaterial color={METAL} roughness={0.55} metalness={0.25} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-2.9, 0.3 + i * 0.46, 1.87]}>
          <boxGeometry args={[2.6, 0.03, 0.01]} />
          <meshStandardMaterial color={METAL_DARK} />
        </mesh>
      ))}
      <GlassWindow weatherRef={weatherRef} position={[-4.62, 2.0, 0.6]} size={[0.7, 0.9]} rotationY={Math.PI / 2} />
      <mesh position={[-2.9, 2.96, 0.1]} receiveShadow>
        <boxGeometry args={[3.5, 0.12, 3.5]} />
        <meshStandardMaterial color={CONCRETE_DARK} roughness={0.8} />
      </mesh>

      {/* GROUND FLOOR — glass-walled living volume, right, deeper than the garage */}
      <mesh position={[1.1, 1.45, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 2.9, 4.2]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.85} />
      </mesh>
      <GlassWindow weatherRef={weatherRef} position={[0.4, 1.5, 2.21]} size={[2.4, 2.4]} />
      <GlassWindow weatherRef={weatherRef} position={[2.5, 1.5, 2.21]} size={[1.2, 2.4]} />
      <mesh position={[3.35, 1.45, 0.1]}>
        <boxGeometry args={[0.35, 2.9, 4.2]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>
      <GlassWindow weatherRef={weatherRef} position={[1.6, 1.6, -2.01]} size={[1.6, 1.4]} rotationY={Math.PI} />

      {/* COVERED ENTRY — sits in the notch between the garage and the living volume */}
      <mesh position={[-1.21, 1.05, 1.55]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.05, 2.1, 0.06]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0.15, 1.45, 1.95]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 2.9, 10]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[-0.5, 0.05, 2.15]} receiveShadow>
        <boxGeometry args={[1.4, 0.1, 0.5]} />
        <meshStandardMaterial color={CONCRETE_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[-0.5, -0.02, 2.5]} receiveShadow>
        <boxGeometry args={[1.4, 0.1, 0.5]} />
        <meshStandardMaterial color={CONCRETE_DARK} roughness={0.9} />
      </mesh>

      {/* SECOND FLOOR — cantilevered, offset wider/forward than the garage below it */}
      <mesh position={[-2.15, 4.3, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[5.5, 2.7, 3.4]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.8} />
      </mesh>
      <GlassWindow weatherRef={weatherRef} position={[-3.6, 4.3, 2.01]} size={[1.5, 2.1]} />
      <GlassWindow weatherRef={weatherRef} position={[-1.6, 4.3, 2.01]} size={[2.6, 2.1]} />
      <GlassWindow weatherRef={weatherRef} position={[-4.7, 4.3, 0.3]} size={[1.2, 1.9]} rotationY={Math.PI / 2} />
      <GlassWindow weatherRef={weatherRef} position={[-2.15, 4.3, -1.41]} size={[3.4, 1.9]} rotationY={Math.PI} />
      <mesh position={[-2.15, 2.97, 0.3]}>
        <boxGeometry args={[5.55, 0.08, 3.45]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* BALCONY / terrace over the ground-floor roof */}
      <mesh position={[1.1, 2.98, 1.6]} receiveShadow>
        <boxGeometry args={[3.2, 0.1, 1.6]} />
        <meshStandardMaterial color={CONCRETE_DARK} roughness={0.75} />
      </mesh>
      <mesh position={[1.1, 3.5, 2.4]}>
        <boxGeometry args={[3.2, 1.0, 0.03]} />
        <meshPhysicalMaterial color={GLASS_TINT} transmission={0.75} roughness={0.08} thickness={0.2} ior={1.4} />
      </mesh>
      <mesh position={[2.68, 3.5, 1.6]}>
        <boxGeometry args={[0.03, 1.0, 1.6]} />
        <meshPhysicalMaterial color={GLASS_TINT} transmission={0.75} roughness={0.08} thickness={0.2} ior={1.4} />
      </mesh>
      <mesh position={[1.1, 3.02, 2.4]}>
        <boxGeometry args={[3.24, 0.06, 0.06]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.4} />
      </mesh>

      {/* ROOF — flat slab with real thickness and a visible overhang */}
      <mesh position={[-2.15, 5.78, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 0.25, 3.9]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[-2.15, 5.64, 0.3]}>
        <boxGeometry args={[6.05, 0.04, 3.95]} />
        <meshStandardMaterial color={METAL_DARK} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Tree — procedural trunk + branches + foliage. No physics: each branch and
// foliage cluster just gets its own frequency/phase offset so the sway never
// looks synchronized, scaled by the current wind strength.
// ---------------------------------------------------------------------------

function Tree({ weatherRef, position }: { weatherRef: WeatherRef; position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const branchRefs = useRef<(THREE.Group | null)[]>([]);
  const foliageRefs = useRef<(THREE.Mesh | null)[]>([]);

  const branches = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        angle: (i / 6) * Math.PI * 2, 
        length: 1.1 + (i % 3) * 0.2,
        tilt: 0.5 + (i % 2) * 0.15,
        freq: 0.6 + (i % 4) * 0.12,
        phase: i * 1.047,
      })),
    [],
  );

  useFrame((state) => {
    const w = weatherRef.current;
    const time = state.clock.elapsedTime;
    const amp = w.wind;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.02 * amp;
    }
    branches.forEach((b, i) => {
      const branch = branchRefs.current[i];
      if (branch) {
        branch.rotation.z = Math.sin(time * b.freq + b.phase) * 0.18 * amp;
        branch.rotation.x = Math.cos(time * b.freq * 0.7 + b.phase) * 0.1 * amp;
      }
      const foliage = foliageRefs.current[i];
      if (foliage) {
        const flutter = Math.sin(time * b.freq * 2.4 + b.phase * 1.7) * 0.04 * amp;
        foliage.scale.setScalar(1 + flutter);
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.16, 2.2, 8]} />
        <meshStandardMaterial color="#5b4632" roughness={0.9} />
      </mesh>
      {branches.map((b, i) => (
        <group
          key={b.id}
          ref={(el) => {
            branchRefs.current[i] = el;
          }}
          position={[0, 1.9, 0]}
          rotation={[0, b.angle, b.tilt]}
        >
          <mesh position={[0, b.length / 2, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.06, b.length, 6]} />
            <meshStandardMaterial color="#5b4632" roughness={0.9} />
          </mesh>
          <mesh
            ref={(el) => {
              foliageRefs.current[i] = el;
            }}
            position={[0, b.length + 0.35, 0]}
            castShadow
          >
            <icosahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial color="#5f6e46" roughness={0.85} flatShading />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.6, 0]} castShadow>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color="#566a42" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Rain — one instanced mesh. Density is controlled by shrinking/growing
// `mesh.count` each frame rather than toggling per-instance visibility, so
// there's no per-instance branching cost.
// ---------------------------------------------------------------------------

const RAIN_COUNT = 260;
const RAIN_BOUNDS = { x: 9, y: 8, z: 9 };

function Rain({ weatherRef }: { weatherRef: WeatherRef }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(
    () =>
      Array.from({ length: RAIN_COUNT }, (_, i) => {
        const a = i * 0.61803398875;
        const b = i * 0.75487766625;
        const c = i * 0.56984029099;

        return {
          x: ((a % 1) - 0.5) * RAIN_BOUNDS.x * 2,
          z: ((b % 1) - 0.5) * RAIN_BOUNDS.z * 2,
          y0: (c % 1) * RAIN_BOUNDS.y,
          speed: 6 + (i % 7) * 0.45,
        };
      }),
    [],
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    const w = weatherRef.current;
    if (!mesh) return;
    const visible = Math.round(RAIN_COUNT * w.rain);
    mesh.count = visible;
    if (visible === 0) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < visible; i += 1) {
      const s = seeds[i];
      const y = (((s.y0 - t * s.speed) % RAIN_BOUNDS.y) + RAIN_BOUNDS.y) % RAIN_BOUNDS.y;
      dummy.position.set(s.x, y, s.z);
      dummy.rotation.set(0, 0, 0.12 * (0.6 + w.wind));
      dummy.scale.set(1, 1 + w.wind * 0.4, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RAIN_COUNT]} frustumCulled={false}>
      <cylinderGeometry args={[0.008, 0.008, 0.32, 4]} />
      <meshBasicMaterial color="#cdd9e6" transparent opacity={0.55} />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------------------
// Scene + camera rig
// ---------------------------------------------------------------------------

function Scene({ weatherRef, reduceMotion }: { weatherRef: WeatherRef; reduceMotion: boolean }) {
  return (
    <>
      <WeatherClock weatherRef={weatherRef} reduceMotion={reduceMotion} />
      <SceneLighting weatherRef={weatherRef} />

      <group scale={0.55}>
        <Ground weatherRef={weatherRef} />
        <House weatherRef={weatherRef} />
        <Tree weatherRef={weatherRef} position={[-5.1, 0, 2.4]} />

        {!reduceMotion && (
          <group position={[-1, 3.2, 0.4]}>
            <Rain weatherRef={weatherRef} />
          </group>
        )}
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.49}
        target={[-1, 2.1, 0.3]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function HeroHouse({ className = "" }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Mutated in place every frame by WeatherClock — never via setState, so
  // the weather cycle never triggers a React re-render.
  const weatherRef = useRef<WeatherState>({
    t: 0,
    rain: 0,
    wind: 0,
    dark: 0,
    sun: 1,
    fog: 0,
    wet: 0,
    glow: 0.3,
    warmth: 0.6,
    lightning: 0,
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || reduceMotion) return undefined;
    const onEnter = () => gsap.to(wrapper, { scale: 1.012, duration: 0.5, ease: "power2.out" });
    const onLeave = () => gsap.to(wrapper, { scale: 1, duration: 0.6, ease: "power2.out" });
    wrapper.addEventListener("pointerenter", onEnter);
    wrapper.addEventListener("pointerleave", onLeave);
    return () => {
      wrapper.removeEventListener("pointerenter", onEnter);
      wrapper.removeEventListener("pointerleave", onLeave);
    };
  }, [ reduceMotion]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`relative aspect-square overflow-hidden ${className}`}
      style={{ cursor: reduceMotion ? "default" : "grab", touchAction: "pan-y" }}
      onPointerDown={(event) => {
        if (!reduceMotion) (event.currentTarget as HTMLElement).style.cursor = "grabbing";
      }}
      onPointerUp={(event) => {
        if (!reduceMotion) (event.currentTarget as HTMLElement).style.cursor = "grab";
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [9.5, 5.2, 11.5], fov: 34 }}
      >
        <Scene weatherRef={weatherRef} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}