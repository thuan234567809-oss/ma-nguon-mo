import * as THREE from 'three';
import { DiningTable } from '../types/game';
import { materials } from './materials';

export function createTableMesh(table: DiningTable): THREE.Group {
  const group = new THREE.Group();

  const isRound = table.type === 'table_2p';

  // 1. Table Top (Warm Oak with subtle bevel)
  if (isRound) {
    const topGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.08, 20);
    const top = new THREE.Mesh(topGeo, materials.warmOak);
    top.position.y = 0.8;
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    // Brass edge rim
    const rimGeo = new THREE.TorusGeometry(0.72, 0.015, 6, 20);
    const rim = new THREE.Mesh(rimGeo, materials.polishedBrass);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.8;
    group.add(rim);

    // Cast iron / Brass central pedestal leg
    const legGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.76, 8);
    const leg = new THREE.Mesh(legGeo, materials.darkSteel);
    leg.position.y = 0.42;
    leg.castShadow = true;
    group.add(leg);

    // Pedestal weighted base
    const baseGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.04, 16);
    const base = new THREE.Mesh(baseGeo, materials.darkSteel);
    base.position.y = 0.04;
    group.add(base);
  } else {
    // 4-Person Rectangular Table
    const topGeo = new THREE.BoxGeometry(1.65, 0.08, 1.05);
    const top = new THREE.Mesh(topGeo, materials.warmOak);
    top.position.y = 0.8;
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    // 4 Splayed wooden legs
    const legOffsets = [
      { x: -0.7, z: -0.4 },
      { x: 0.7, z: -0.4 },
      { x: -0.7, z: 0.4 },
      { x: 0.7, z: 0.4 },
    ];
    legOffsets.forEach(pos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.76, 8), materials.darkWalnut);
      leg.position.set(pos.x, 0.42, pos.z);
      leg.castShadow = true;
      group.add(leg);
    });
  }

  // 2. Tabletop Accessories: Ceramic Cup & Flower Bud Vase
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.08, 8), materials.ceramicCupWhite);
  mug.position.set(0.2, 0.88, 0.15);
  group.add(mug);

  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.14, 8), materials.carraraMarble);
  vase.position.set(-0.1, 0.91, -0.1);
  group.add(vase);

  const flowerBud = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), materials.cushionBurgundy);
  flowerBud.position.set(-0.1, 1.0, -0.1);
  group.add(flowerBud);

  // 3. Bistro Chairs with Cushions
  const chairOffset = isRound ? 0.82 : 0.95;
  const cushionColors = [materials.cushionTeal, materials.cushionBurgundy, materials.cushionNavy];

  for (let i = 0; i < table.seats; i++) {
    const angle = (i / table.seats) * Math.PI * 2;
    const chair = new THREE.Group();

    // Wooden Chair Base
    const seatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 12), materials.darkWalnut);
    seatBase.position.y = 0.44;
    chair.add(seatBase);

    // Soft Colorful Fabric Cushion
    const cushion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.21, 0.05, 12),
      cushionColors[i % cushionColors.length]
    );
    cushion.position.y = 0.48;
    chair.add(cushion);

    // Curved Backrest
    const backrestPole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6), materials.darkWalnut);
    backrestPole1.position.set(-0.12, 0.66, -0.15);
    chair.add(backrestPole1);

    const backrestPole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6), materials.darkWalnut);
    backrestPole2.position.set(0.12, 0.66, -0.15);
    chair.add(backrestPole2);

    const backrestTop = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.04), materials.warmOak);
    backrestTop.position.set(0, 0.84, -0.15);
    chair.add(backrestTop);

    // 4 Chair Legs
    const chairLegPositions = [
      { x: -0.12, z: -0.12 },
      { x: 0.12, z: -0.12 },
      { x: -0.12, z: 0.12 },
      { x: 0.12, z: 0.12 },
    ];
    chairLegPositions.forEach(legPos => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.44, 6), materials.darkSteel);
      leg.position.set(legPos.x, 0.22, legPos.z);
      leg.castShadow = true;
      chair.add(leg);
    });

    chair.position.set(Math.cos(angle) * chairOffset, 0, Math.sin(angle) * chairOffset);
    chair.rotation.y = -angle - Math.PI / 2;
    group.add(chair);
  }

  group.position.set(table.x, 0.1, table.z);
  group.userData = { type: 'table', tableId: table.id };
  return group;
}

export function createPottedPlantMesh(x: number, z: number): THREE.Group {
  const group = new THREE.Group();

  // Terracotta Pot
  const potGeo = new THREE.CylinderGeometry(0.28, 0.2, 0.48, 12);
  const pot = new THREE.Mesh(potGeo, materials.terracottaPot);
  pot.position.y = 0.24;
  pot.castShadow = true;
  group.add(pot);

  // Pot rim
  const rimGeo = new THREE.TorusGeometry(0.28, 0.03, 6, 12);
  const rim = new THREE.Mesh(rimGeo, materials.terracottaPot);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.48;
  group.add(rim);

  // Dark soil
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 12), materials.darkWalnut);
  soil.position.y = 0.44;
  group.add(soil);

  // Monstera Foliage Fan
  const leafCount = 5;
  for (let i = 0; i < leafCount; i++) {
    const angle = (i / leafCount) * Math.PI * 2;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6), materials.foliageDeep);
    stem.rotation.z = 0.35;
    stem.rotation.y = angle;
    stem.position.set(Math.cos(angle) * 0.1, 0.6, Math.sin(angle) * 0.1);
    group.add(stem);

    const leafMat = i % 2 === 0 ? materials.foliageDeep : materials.foliageBright;
    const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22), leafMat);
    leaf.scale.set(1.4, 0.2, 1.0);
    leaf.position.set(Math.cos(angle) * 0.3, 0.85, Math.sin(angle) * 0.3);
    leaf.rotation.y = angle;
    leaf.castShadow = true;
    group.add(leaf);
  }

  group.position.set(x, 0.1, z);
  return group;
}
