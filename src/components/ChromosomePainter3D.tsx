import React, { useMemo, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

const CHROMOSOME_LENGTHS: Record<string, number> = {
  "1": 248956422, "2": 242193529, "3": 198295559, "4": 190214555, "5": 181538259, "6": 170805979, 
  "7": 159345973, "8": 145138636, "9": 138394717, "10": 133797422, "11": 135086622, "12": 133851895, 
  "13": 115169878, "14": 107349540, "15": 102520552, "16": 90354753, "17": 83257441, "18": 80373285, 
  "19": 59128983, "20": 63025520, "21": 48129895, "22": 51304566, "X": 156040895
};

const POP_COLORS: Record<string, string> = {
  EUR: '#3b82f6',
  AFR: '#10b981',
  EAS: '#ef4444',
  SAS: '#f59e0b',
  AMR: '#a855f7',
  OCE: '#06b6d4',
  MID: '#f97316'
};

const REGION_NAMES: Record<string, string> = {
  EUR: 'European',
  AFR: 'African',
  EAS: 'East Asian',
  SAS: 'South Asian',
  AMR: 'Indigenous American',
  OCE: 'Oceanian',
  MID: 'Middle Eastern'
};

interface Segment {
  continent: string;
  start: number;
  end: number;
  confidence: number;
}

interface ChromosomePainter3DProps {
  segments: Record<string, Segment[] | { strandA: Segment[]; strandB: Segment[] }>;
  onSegmentClick?: (chrom: string, strand: 'A' | 'B' | 'Both', segment: Segment, bp: number) => void;
  activeContinentFilter: string | null;
}

const SCALE = 10000000; // 10M bp = 1 unit

// Memoized materials for better performance
const materials = Object.entries(POP_COLORS).reduce((acc, [pop, color]) => {
  acc[pop] = new THREE.MeshPhysicalMaterial({ 
    color,
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    transmission: 0.2, // slight glass effect
    thickness: 0.5
  });
  return acc;
}, {} as Record<string, THREE.MeshPhysicalMaterial>);

const defaultMaterial = new THREE.MeshPhysicalMaterial({
  color: '#475569',
  roughness: 0.5,
  metalness: 0.1
});

const mutedMaterial = new THREE.MeshPhysicalMaterial({
  color: '#1e293b',
  roughness: 0.8,
  metalness: 0.1,
  transparent: true,
  opacity: 0.2
});

const StrandCylinder = ({ 
  segment, 
  yOffset, 
  length, 
  isMuted,
  onHover,
  onClick
}: { 
  segment: Segment, 
  yOffset: number, 
  length: number, 
  isMuted: boolean,
  onHover: (e: any, seg: Segment) => void,
  onClick: (seg: Segment) => void
}) => {
  const mat = isMuted ? mutedMaterial : (materials[segment.continent] || defaultMaterial);

  return (
    <mesh 
      position={[0, yOffset, 0]} 
      material={mat}
      onPointerOver={(e) => { e.stopPropagation(); onHover(e, segment); }}
      onPointerOut={() => onHover(null, null as any)}
      onClick={(e) => { e.stopPropagation(); onClick(segment); }}
    >
      <cylinderGeometry args={[0.3, 0.3, length, 16]} />
    </mesh>
  );
};

const ChromosomeGroup = ({ 
  chrom, 
  data, 
  index, 
  total,
  activeContinentFilter,
  onSegmentClick,
  setHoveredInfo
}: { 
  chrom: string, 
  data: any, 
  index: number, 
  total: number,
  activeContinentFilter: string | null,
  onSegmentClick?: (chrom: string, strand: 'A' | 'B' | 'Both', segment: Segment, bp: number) => void,
  setHoveredInfo: (info: any) => void
}) => {
  // Curved theater layout
  const radius = 40;
  const spread = Math.PI / 1.2; // 150 degrees
  const step = spread / (total - 1);
  const startAngle = -spread / 2;
  const theta = startAngle + index * step;
  
  const x = Math.sin(theta) * radius;
  const z = Math.cos(theta) * radius - radius;

  const chromLength = CHROMOSOME_LENGTHS[chrom];
  const totalUnits = chromLength / SCALE;
  const startY = totalUnits / 2; // So the top aligns roughly to y = +height/2

  const hasStrands = !Array.isArray(data) && data.strandA && data.strandB;
  const strandA: Segment[] = hasStrands ? data.strandA || [] : (Array.isArray(data) ? data : []);
  const strandB: Segment[] = hasStrands ? data.strandB || [] : [];

  const handleHover = (e: any, segment: Segment, strand: string) => {
    if (!segment) {
      setHoveredInfo(null);
      return;
    }
    // Convert 3D world position to screen coordinates approximately for simple tooltip
    setHoveredInfo({
      chrom,
      strand,
      segment,
      point: e.point
    });
  };

  const handleClick = (segment: Segment, strand: string) => {
    onSegmentClick?.(chrom, strand as any, segment, (segment.start + segment.end) / 2);
  };

  return (
    <group position={[x, 0, z]} rotation={[0, theta, 0]}>
      {/* Label */}
      <Text
        position={[0, startY + 2, 0]}
        fontSize={1.2}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        {chrom}
      </Text>

      {/* Strand A */}
      <group position={hasStrands ? [-0.5, 0, 0] : [0, 0, 0]}>
        {strandA.map((seg, i) => {
          const segUnits = (seg.end - seg.start) / SCALE;
          const yOff = startY - (seg.start / SCALE) - (segUnits / 2);
          const isMuted = activeContinentFilter !== null && activeContinentFilter !== seg.continent;
          return (
            <StrandCylinder 
              key={`A-${i}`} 
              segment={seg} 
              length={segUnits} 
              yOffset={yOff} 
              isMuted={isMuted} 
              onHover={(e, s) => handleHover(e, s, hasStrands ? 'A' : 'Both')}
              onClick={(s) => handleClick(s, hasStrands ? 'A' : 'Both')}
            />
          );
        })}
      </group>

      {/* Strand B */}
      {hasStrands && (
        <group position={[0.5, 0, 0]}>
          {strandB.map((seg, i) => {
            const segUnits = (seg.end - seg.start) / SCALE;
            const yOff = startY - (seg.start / SCALE) - (segUnits / 2);
            const isMuted = activeContinentFilter !== null && activeContinentFilter !== seg.continent;
            return (
              <StrandCylinder 
                key={`B-${i}`} 
                segment={seg} 
                length={segUnits} 
                yOffset={yOff} 
                isMuted={isMuted} 
                onHover={(e, s) => handleHover(e, s, 'B')}
                onClick={(s) => handleClick(s, 'B')}
              />
            );
          })}
        </group>
      )}
    </group>
  );
};

export const ChromosomePainter3D = ({ 
  segments = {}, 
  onSegmentClick,
  activeContinentFilter
}: ChromosomePainter3DProps) => {
  const [hoveredInfo, setHoveredInfo] = useState<any>(null);

  const sortedChroms = useMemo(() => {
    return Object.keys(CHROMOSOME_LENGTHS).sort((a, b) => {
      if (a === 'X') return 1;
      if (b === 'X') return -1;
      return parseInt(a, 10) - parseInt(b, 10);
    });
  }, []);

  return (
    <div className="w-full h-[600px] bg-[#020617] rounded-3xl overflow-hidden border border-white/5 relative shadow-2xl">
      <Canvas camera={{ position: [0, 0, 35], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        
        {/* Premium Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 15]} intensity={1.5} color="#ffffff" castShadow />
        <directionalLight position={[-10, -20, -15]} intensity={0.5} color="#4fd1c5" />
        <pointLight position={[0, 0, 0]} intensity={1} color="#6366f1" />

        <Environment preset="city" />

        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[0, -5, 0]}>
            {sortedChroms.map((chrom, idx) => (
              <ChromosomeGroup 
                key={chrom}
                chrom={chrom}
                data={segments[chrom] || []}
                index={idx}
                total={sortedChroms.length}
                activeContinentFilter={activeContinentFilter}
                onSegmentClick={onSegmentClick}
                setHoveredInfo={setHoveredInfo}
              />
            ))}
          </group>
        </Float>

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
          minDistance={10}
          maxDistance={100}
        />

        {/* 3D Tooltip equivalent */}
        {hoveredInfo && hoveredInfo.point && (
          <Html position={hoveredInfo.point} center style={{ pointerEvents: 'none' }}>
            <div className="bg-slate-900/95 border border-slate-700/80 text-white p-3 rounded-xl shadow-2xl backdrop-blur-md text-[10px] leading-relaxed w-48 transition-all">
              <div className="font-black text-teal-400 uppercase tracking-widest text-[9px] mb-1">
                Chromosome {hoveredInfo.chrom}
              </div>
              <div>
                <strong className="text-slate-400">Ancestry:</strong>{' '}
                <span className="font-extrabold" style={{ color: POP_COLORS[hoveredInfo.segment.continent] }}>
                  {REGION_NAMES[hoveredInfo.segment.continent] ?? hoveredInfo.segment.continent}
                </span>
              </div>
              {hoveredInfo.strand !== 'Both' && (
                <div>
                  <strong className="text-slate-400">Strand:</strong>{' '}
                  {hoveredInfo.strand === 'A' ? 'Strand A (Maternal)' : 'Strand B (Paternal)'}
                </div>
              )}
              <div>
                <strong className="text-slate-400">Range:</strong>{' '}
                {(hoveredInfo.segment.start / 1000000).toFixed(1)}M - {(hoveredInfo.segment.end / 1000000).toFixed(1)}M bp
              </div>
              <div>
                <strong className="text-slate-400">Confidence:</strong>{' '}
                {(hoveredInfo.segment.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </Html>
        )}
      </Canvas>
      
      {/* 3D Overlay Help Text */}
      <div className="absolute bottom-4 left-0 right-0 pointer-events-none flex justify-center">
        <div className="bg-slate-900/80 backdrop-blur text-slate-400 px-4 py-2 rounded-full text-xs font-bold border border-white/5 shadow-lg flex items-center gap-2 uppercase tracking-widest">
          <span>🖱️ Left Click to Rotate</span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span>📜 Scroll to Zoom</span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span>👆 Right Click to Pan</span>
        </div>
      </div>
    </div>
  );
};
