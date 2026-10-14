import * as THREE from 'three';
import { materials } from './materials';
import { CityBuildingsManager } from './cityBuildings';
import { CityTrafficManager } from './cityVehicles';

export interface CityEnvironmentResult {
  group: THREE.Group;
  buildingsManager: CityBuildingsManager;
  trafficManager: CityTrafficManager;
}

export function buildEnvironmentMeshes(scene: THREE.Scene): CityEnvironmentResult {
  const group = new THREE.Group();

  // 1. Lush Green Ground District
  const groundGeo = new THREE.PlaneGeometry(70, 70);
  const ground = new THREE.Mesh(groundGeo, materials.grass);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // 2. Main Street Asphalt (Z from 5 to 11)
  const streetGeo = new THREE.PlaneGeometry(70, 6.4);
  const street = new THREE.Mesh(streetGeo, materials.streetAsphalt);
  street.rotation.x = -Math.PI / 2;
  street.position.set(0, 0.02, 8);
  street.receiveShadow = true;
  group.add(street);

  // Double Yellow Center Line
  for (let x = -32; x <= 32; x += 4) {
    const dash1 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.15), materials.streetYellow);
    dash1.rotation.x = -Math.PI / 2;
    dash1.position.set(x, 0.03, 7.85);
    group.add(dash1);

    const dash2 = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.15), materials.streetYellow);
    dash2.rotation.x = -Math.PI / 2;
    dash2.position.set(x, 0.03, 8.15);
    group.add(dash2);
  }

  // Pedestrian Zebra Crossing in front of bistro (x from -3 to 3)
  for (let zOffset = 5.2; zOffset <= 10.8; zOffset += 0.8) {
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.45), materials.zebraWhite);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, 0.035, zOffset);
    group.add(stripe);
  }

  // 3. Sidewalks with Curbs
  const sidewalkGeo = new THREE.BoxGeometry(70, 0.22, 3.2);
  const sidewalkNear = new THREE.Mesh(sidewalkGeo, materials.sidewalk);
  sidewalkNear.position.set(0, 0.11, 3.2);
  sidewalkNear.receiveShadow = true;
  group.add(sidewalkNear);

  const sidewalkFar = new THREE.Mesh(sidewalkGeo, materials.sidewalk);
  sidewalkFar.position.set(0, 0.11, 12.8);
  sidewalkFar.receiveShadow = true;
  group.add(sidewalkFar);

  // 4. Stylized Low-Poly Street Trees & Warm Modern Lamps
  for (let x = -28; x <= 28; x += 9.5) {
    if (Math.abs(x) < 4.5) continue; // Leave entrance clear

    // Stylized Tree
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 2.4, 6), materials.treeBark);
    trunk.position.y = 1.2;
    trunk.castShadow = true;
    tree.add(trunk);

    // Dodecahedron Multi-Tier Foliage
    const fol1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3), materials.foliageDeep);
    fol1.position.y = 2.8;
    fol1.castShadow = true;
    tree.add(fol1);

    const fol2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95), materials.foliageBright);
    fol2.position.set(0.3, 3.6, 0.2);
    fol2.castShadow = true;
    tree.add(fol2);

    tree.position.set(x, 0.1, 4.0);
    group.add(tree);

    // Modern Street Lamp
    const lamp = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4.2, 8), materials.darkSteel);
    pole.position.y = 2.1;
    lamp.add(pole);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.15), materials.darkSteel);
    arm.position.set(0.3, 4.1, 0);
    lamp.add(arm);

    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.18, 8), materials.darkSteel);
    shade.position.set(0.65, 4.0, 0);
    lamp.add(shade);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), materials.warmLampGlow);
    bulb.position.set(0.65, 3.92, 0);
    lamp.add(bulb);

    lamp.position.set(x + 2.5, 0.1, 2.0);
    group.add(lamp);
  }

  // 5. Modern Surrounding Skyline Architecture with Canopies & LED Neon
  const buildingsManager = new CityBuildingsManager();
  group.add(buildingsManager.group);

  // 6. Dynamic Traffic & Curbside Parked Vehicles
  const trafficManager = new CityTrafficManager();
  group.add(trafficManager.group);

  scene.add(group);
  return { group, buildingsManager, trafficManager };
}

export function createDeliveryScooterMesh(): THREE.Group {
  const group = new THREE.Group();

  // Scooter Chassis (Teal / Emerald)
  const chassisMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.35, metalness: 0.2 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

  // 1. Front and Rear Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.12, 16);
  const frontWheel = new THREE.Mesh(wheelGeo, wheelMat);
  frontWheel.rotation.z = Math.PI / 2;
  frontWheel.position.set(0.7, 0.24, 0);
  frontWheel.castShadow = true;
  group.add(frontWheel);

  const rearWheel = new THREE.Mesh(wheelGeo, wheelMat);
  rearWheel.rotation.z = Math.PI / 2;
  rearWheel.position.set(-0.7, 0.24, 0);
  rearWheel.castShadow = true;
  group.add(rearWheel);

  // 2. Body Frame & Footboard
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.28, 0.42), chassisMat);
  body.position.set(0, 0.38, 0);
  body.castShadow = true;
  group.add(body);

  // 3. Seat
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.8 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.34), seatMat);
  seat.position.set(-0.15, 0.56, 0);
  group.add(seat);

  // 4. Handlebar Column & Mirrors
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8), materials.darkSteel);
  column.rotation.z = -0.2;
  column.position.set(0.5, 0.68, 0);
  group.add(column);

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.65, 8), materials.darkSteel);
  handle.position.set(0.44, 0.95, 0);
  group.add(handle);

  // LED Headlight
  const headlight = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), materials.warmLampGlow);
  headlight.position.set(0.62, 0.82, 0);
  group.add(headlight);

  // 5. Thermal Food Delivery Insulated Box
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
  const deliveryBox = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.48, 0.48), boxMat);
  deliveryBox.position.set(-0.5, 0.72, 0);
  deliveryBox.castShadow = true;
  group.add(deliveryBox);

  group.position.set(5.5, 0.1, 3.8);
  group.userData = { type: 'delivery_fleet', label: 'Đội xe giao hàng siêu tốc' };
  return group;
}
