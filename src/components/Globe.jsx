import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const R = 2;
const SEGMENTS = 64;

function latLngToPos(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Earth() {
  const [texture, setTexture] = useState(null);
  const [error, setError] = useState(false);
  const url = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let disposed = false;
    loader.load(
      url,
      (tex) => { if (!disposed) setTexture(tex); },
      undefined,
      () => { if (!disposed) setError(true); }
    );
    return () => { disposed = true; };
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[R, SEGMENTS, SEGMENTS]} />
      <meshPhongMaterial
        map={texture}
        color={error ? "#1a3a5c" : "#ffffff"}
        transparent={!texture && !error}
        opacity={texture || error ? 1 : 0.4}
      />
    </mesh>
  );
}

function Scene({ teams, selectedGroup, groupColors, onSelectTeam, onTooltip }) {
  const groupRef = useRef();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0.15, y: 0 });

  const filtered = useMemo(
    () => (selectedGroup ? teams.filter((t) => t.group === selectedGroup) : teams),
    [teams, selectedGroup]
  );

  useFrame(() => {
    if (!groupRef.current) return;
    current.current.x += (target.current.x - current.current.x) * 0.04;
    current.current.y += (target.current.y - current.current.y) * 0.04;
    groupRef.current.rotation.x = current.current.x;
    groupRef.current.rotation.y = current.current.y;
  });

  useEffect(() => {
    const handler = (e) => {
      target.current.x = -(e.clientY / window.innerHeight - 0.5) * 1.2;
      target.current.y = (e.clientX / window.innerWidth - 0.5) * 1.2;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <directionalLight position={[-3, -1, -2]} intensity={0.3} />
      <Earth />
      {filtered.map((team) => {
        const pos = latLngToPos(team.coords[1], team.coords[0], R + 0.04);
        return (
          <Html key={team.id} position={pos} center distanceFactor={8}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: groupColors[team.group],
                border: "2px solid rgba(255,255,255,0.9)",
                cursor: "pointer",
                boxShadow: `0 0 8px ${groupColors[team.group]}`,
                transition: "transform 0.15s",
              }}
              onClick={() => onSelectTeam(team)}
              onMouseEnter={() => onTooltip(team)}
              onMouseLeave={() => onTooltip(null)}
            />
          </Html>
        );
      })}
    </group>
  );
}

export default function Globe({ teams, selectedGroup, groupColors, onSelectTeam, onTooltip }) {
  return (
    <div className="globe-container">
      <Canvas camera={{ position: [0, 0.3, 5.5], fov: 40 }}>
        <Scene
          teams={teams}
          selectedGroup={selectedGroup}
          groupColors={groupColors}
          onSelectTeam={onSelectTeam}
          onTooltip={onTooltip}
        />
      </Canvas>
    </div>
  );
}
