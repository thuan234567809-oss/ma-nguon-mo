import * as THREE from 'three';

// Material Cache for optimal Three.js rendering performance with PBR properties
export const materials = {
  // Architectural Surfaces
  streetAsphalt: new THREE.MeshStandardMaterial({ color: 0x1e242d, roughness: 0.85, metalness: 0.1 }),
  sidewalk: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.65, metalness: 0.05 }),
  curb: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.55 }),
  grass: new THREE.MeshStandardMaterial({ color: 0x1f543d, roughness: 0.88 }),
  zebraWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }),
  streetYellow: new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4 }),
  
  // Restaurant Flooring & Walls
  parquetWoodFloor: new THREE.MeshStandardMaterial({ color: 0xa07147, roughness: 0.45, metalness: 0.05 }),
  kitchenTile: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.08 }),
  bistroWallDark: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }),
  bistroWallCream: new THREE.MeshStandardMaterial({ color: 0xf8f5f0, roughness: 0.7 }),
  brickWall: new THREE.MeshStandardMaterial({ color: 0x884a39, roughness: 0.8 }),
  chalkboard: new THREE.MeshStandardMaterial({ color: 0x182026, roughness: 0.85 }),

  // Woods & Luxury Finishes
  warmOak: new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.5 }),
  darkWalnut: new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.4 }),
  carraraMarble: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1 }),
  polishedBrass: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.85 }),
  stainlessSteel: new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.88, roughness: 0.22 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.35 }),
  espressoRed: new THREE.MeshStandardMaterial({ color: 0xbe123c, metalness: 0.35, roughness: 0.25 }),

  // Glass & Emissive Lighting
  glass: new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.4,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.6,
    ior: 1.5,
  }),
  warmLampGlow: new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.8,
    roughness: 0.3,
  }),
  lampShadeCopper: new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.75, roughness: 0.3 }),

  // Fabrics & Cushions
  cushionTeal: new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.7 }),
  cushionBurgundy: new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.7 }),
  cushionNavy: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.7 }),

  // Botanicals
  foliageDeep: new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 }),
  foliageBright: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75 }),
  terracottaPot: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.7 }),
  treeBark: new THREE.MeshStandardMaterial({ color: 0x543d2b, roughness: 0.9 }),

  // Bakery & Food Details
  croissantGolden: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }),
  ceramicCupWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }),
  coffeeLiquid: new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.1 }),

  // Building Skyline Materials
  buildingOffice: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.4 }),
  buildingConcrete: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 }),
  awningBurgundy: new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.5 }),
};
