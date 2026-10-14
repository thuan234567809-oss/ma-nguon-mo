import * as THREE from 'three';
import { materials } from './materials';

export function buildRestaurantBase(scene: THREE.Scene): THREE.Group {
  const restaurant = new THREE.Group();

  // 1. Dining Parquet Floor (14x12m) with baseboard
  const floorGeo = new THREE.BoxGeometry(14, 0.2, 12);
  const floor = new THREE.Mesh(floorGeo, materials.parquetWoodFloor);
  floor.position.set(0, 0.1, -1);
  floor.receiveShadow = true;
  restaurant.add(floor);

  // 2. Kitchen Tile Floor (6x5m) slightly elevated
  const kitchenFloorGeo = new THREE.BoxGeometry(6, 0.22, 5);
  const kitchenFloor = new THREE.Mesh(kitchenFloorGeo, materials.kitchenTile);
  kitchenFloor.position.set(-3.8, 0.11, -4.3);
  kitchenFloor.receiveShadow = true;
  restaurant.add(kitchenFloor);

  // Kitchen divider strip in brass
  const dividerGeo = new THREE.BoxGeometry(6, 0.23, 0.08);
  const divider = new THREE.Mesh(dividerGeo, materials.polishedBrass);
  divider.position.set(-3.8, 0.12, -1.8);
  restaurant.add(divider);

  // 3. Back Wall (Dark slate bistro wall with picture frames & chalkboard)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 3.8, 0.35), materials.bistroWallDark);
  backWall.position.set(0, 2.0, -7);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  restaurant.add(backWall);

  // Bistro Chalkboard Menu on back wall
  const boardGeo = new THREE.BoxGeometry(4.2, 1.8, 0.06);
  const chalkboard = new THREE.Mesh(boardGeo, materials.chalkboard);
  chalkboard.position.set(2.5, 2.3, -6.8);
  restaurant.add(chalkboard);

  // Chalkboard wooden frame
  const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(4.35, 1.95, 0.04), materials.warmOak);
  boardFrame.position.set(2.5, 2.3, -6.82);
  restaurant.add(boardFrame);

  // Art photo frames on wall
  for (let i = 0; i < 3; i++) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.05), materials.darkWalnut);
    frame.position.set(-1.5 + i * 1.4, 2.5, -6.8);
    restaurant.add(frame);
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.05), materials.bistroWallCream);
    photo.position.set(-1.5 + i * 1.4, 2.5, -6.77);
    restaurant.add(photo);
  }

  // 4. Side Walls
  // Left Wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 12), materials.bistroWallDark);
  leftWall.position.set(-7, 2.0, -1);
  leftWall.castShadow = true;
  restaurant.add(leftWall);

  // Right Wall (with large panoramic glass windows)
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 12), materials.bistroWallDark);
  rightWall.position.set(7, 2.0, -1);
  rightWall.castShadow = true;
  restaurant.add(rightWall);

  // 5. Front Low Wall (Cut for isometric camera visibility)
  const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.1, 0.3), materials.bistroWallDark);
  frontWallLeft.position.set(-4.6, 0.65, 5);
  restaurant.add(frontWallLeft);

  const frontWallRight = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.1, 0.3), materials.bistroWallDark);
  frontWallRight.position.set(4.6, 0.65, 5);
  restaurant.add(frontWallRight);

  // Parisian Burgundy Canopy Awning
  const awning = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.22, 2.4), materials.awningBurgundy);
  awning.rotation.x = 0.16;
  awning.position.set(0, 3.5, 5.6);
  awning.castShadow = true;
  restaurant.add(awning);

  // 6. Deluxe Bar Counter & Espresso Station
  buildBarCounter(restaurant);

  // 7. Commercial Kitchen Equipment
  buildKitchenAppliances(restaurant);

  // 8. Warm Ambient & Chandelier Lighting
  setupRestaurantLights(restaurant);

  scene.add(restaurant);
  return restaurant;
}

function buildBarCounter(parent: THREE.Group) {
  const barGroup = new THREE.Group();

  // Marble Counter Top (5.2m x 1.1m x 1.15m height)
  const counterBase = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.05, 1.1), materials.darkWalnut);
  counterBase.position.set(0, 0.62, 0.5);
  counterBase.castShadow = true;
  counterBase.receiveShadow = true;
  barGroup.add(counterBase);

  // Carrara Marble Slab Top
  const marbleTop = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.1, 1.25), materials.carraraMarble);
  marbleTop.position.set(0, 1.18, 0.5);
  marbleTop.castShadow = true;
  barGroup.add(marbleTop);

  // Brass Footrail along the bottom
  const railGeo = new THREE.CylinderGeometry(0.04, 0.04, 5.0, 8);
  const rail = new THREE.Mesh(railGeo, materials.polishedBrass);
  rail.rotation.z = Math.PI / 2;
  rail.position.set(0, 0.2, 1.15);
  barGroup.add(rail);

  // POS Touch Screen Register with Card Terminal
  const posStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.35, 8), materials.darkSteel);
  posStand.position.set(-1.2, 1.35, 0.5);
  barGroup.add(posStand);

  const posScreen = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.05), materials.darkSteel);
  posScreen.rotation.x = -0.3;
  posScreen.position.set(-1.2, 1.5, 0.5);
  barGroup.add(posScreen);

  // High-End 2-Group Espresso Machine (Detailed Low-Poly)
  buildEspressoMachine(barGroup, 1.0, 1.23, 0.5);

  // Glass Pastry Showcase
  buildPastryShowcase(barGroup, -0.1, 1.23, 0.5);

  parent.add(barGroup);
}

function buildEspressoMachine(parent: THREE.Group, x: number, y: number, z: number) {
  const group = new THREE.Group();

  // Machine Red & Chrome Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.75, 0.75), materials.espressoRed);
  body.position.set(0, 0.38, 0);
  body.castShadow = true;
  group.add(body);

  // Stainless Top Warming Tray
  const tray = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.05, 0.7), materials.stainlessSteel);
  tray.position.set(0, 0.78, 0);
  group.add(tray);

  // Ceramic Cups on warming tray
  for (let c = 0; c < 4; c++) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.09, 8), materials.ceramicCupWhite);
    cup.position.set(-0.4 + c * 0.26, 0.85, (c % 2 === 0 ? 0.1 : -0.1));
    group.add(cup);
  }

  // 2 Dual Portafilter Group Heads
  for (let g = 0; g < 2; g++) {
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.15, 8), materials.stainlessSteel);
    head.position.set(-0.25 + g * 0.5, 0.35, 0.4);
    group.add(head);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 6), materials.darkSteel);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(-0.25 + g * 0.5, 0.32, 0.52);
    group.add(handle);
  }

  // Chrome Steam Wands
  const steamWand = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), materials.stainlessSteel);
  steamWand.rotation.z = -0.3;
  steamWand.position.set(0.55, 0.35, 0.4);
  group.add(steamWand);

  group.position.set(x, y, z);
  group.userData = { type: 'equipment', name: 'Dual Boiler Espresso Station' };
  parent.add(group);
}

function buildPastryShowcase(parent: THREE.Group, x: number, y: number, z: number) {
  const caseGroup = new THREE.Group();

  // Glass Enclosure
  const glassCase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 0.65), materials.glass);
  glassCase.position.set(0, 0.28, 0);
  caseGroup.add(glassCase);

  // Wooden Shelf Inside
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.55), materials.warmOak);
  shelf.position.set(0, 0.22, 0);
  caseGroup.add(shelf);

  // Golden Croissants on display
  for (let k = 0; k < 3; k++) {
    const croissant = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.035, 6, 8, Math.PI), materials.croissantGolden);
    croissant.rotation.x = Math.PI / 2;
    croissant.position.set(-0.25 + k * 0.25, 0.26, 0);
    caseGroup.add(croissant);
  }

  caseGroup.position.set(x, y, z);
  parent.add(caseGroup);
}

function buildKitchenAppliances(parent: THREE.Group) {
  const kitchen = new THREE.Group();

  // 1. Heavy Commercial 4-Burner Stove & Griddle
  const stoveBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.05, 1.0), materials.stainlessSteel);
  stoveBase.position.set(-4.5, 0.63, -5.5);
  stoveBase.castShadow = true;
  kitchen.add(stoveBase);

  // Red Burner Rings
  const burnerMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  for (let b = 0; b < 4; b++) {
    const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 12), burnerMat);
    burner.position.set(-5.2 + (b % 2) * 0.9, 1.17, -5.8 + Math.floor(b / 2) * 0.6);
    kitchen.add(burner);
  }

  // Commercial Exhaust Hood Above Stove
  const hood = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 1.2), materials.stainlessSteel);
  hood.position.set(-4.5, 2.7, -5.5);
  hood.castShadow = true;
  kitchen.add(hood);

  // 2. Commercial Double-Door Stainless Refrigerator
  const fridge = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.9), materials.stainlessSteel);
  fridge.position.set(-6.1, 1.3, -3.2);
  fridge.castShadow = true;
  kitchen.add(fridge);

  // Handles
  for (let d = 0; d < 2; d++) {
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), materials.darkSteel);
    handle.position.set(-5.6, 1.3, -3.5 + d * 0.6);
    kitchen.add(handle);
  }

  parent.add(kitchen);
}

function setupRestaurantLights(parent: THREE.Group) {
  // 3 Hanging Pendant Lamps above tables/counter
  const pendantPositions = [
    { x: -1.8, y: 3.2, z: 1.0 },
    { x: 1.8, y: 3.2, z: 1.0 },
    { x: 0, y: 3.4, z: -2.0 },
  ];

  pendantPositions.forEach((pos, idx) => {
    // Cord
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 6), materials.darkSteel);
    cord.position.set(pos.x, pos.y + 0.6, pos.z);
    parent.add(cord);

    // Copper Lamp Shade
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.25, 12, 1, true), materials.lampShadeCopper);
    shade.position.set(pos.x, pos.y, pos.z);
    parent.add(shade);

    // Glowing Bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), materials.warmLampGlow);
    bulb.position.set(pos.x, pos.y - 0.05, pos.z);
    parent.add(bulb);

    // Point Light with soft warm illumination
    const light = new THREE.PointLight(0xfff3c4, 0.8, 8);
    light.position.set(pos.x, pos.y - 0.2, pos.z);
    parent.add(light);
  });
}
