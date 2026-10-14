import * as THREE from 'three';
import { Customer, StaffMember } from '../types/game';
import { materials } from './materials';

export function createCustomerMesh(cust: Customer): THREE.Group {
  const group = new THREE.Group();

  // Color schemes by demographic
  const demoOutfits = {
    student: { body: 0x3b82f6, pants: 0x1e293b, hair: 0x1c1917, accessory: 0xf59e0b },
    office_worker: { body: 0x1e3a8a, pants: 0x0f172a, hair: 0x292524, accessory: 0x94a3b8 },
    family: { body: 0x059669, pants: 0x334155, hair: 0x451a03, accessory: 0xfbbf24 },
    foodie: { body: 0xbe123c, pants: 0x18181b, hair: 0x78350f, accessory: 0x10b981 },
    retiree: { body: 0x7c3aed, pants: 0x475569, hair: 0xe2e8f0, accessory: 0xf97316 },
  };

  const outfit = demoOutfits[cust.demographic] || demoOutfits.student;
  const bodyMat = new THREE.MeshStandardMaterial({ color: outfit.body, roughness: 0.6 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: outfit.pants, roughness: 0.7 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.5 });
  const hairMat = new THREE.MeshStandardMaterial({ color: outfit.hair, roughness: 0.8 });

  // 1. Torso / Shirt
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.24), bodyMat);
  torso.position.y = 0.82;
  torso.castShadow = true;
  group.add(torso);

  // 2. Collar / Hoodie detail
  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.22), bodyMat);
  collar.position.y = 1.08;
  group.add(collar);

  // 3. Head & Hair
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), skinMat);
  head.position.y = 1.25;
  head.castShadow = true;
  group.add(head);

  // Stylized Hair Cap
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 10, 0, Math.PI * 2, 0, Math.PI / 1.7), hairMat);
  hair.position.y = 1.28;
  group.add(hair);

  // 4. Arms
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.38, 0.1), bodyMat);
  armL.position.set(-0.25, 0.76, 0);
  armL.castShadow = true;
  group.add(armL);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.38, 0.1), bodyMat);
  armR.position.set(0.25, 0.76, 0);
  armR.castShadow = true;
  group.add(armR);

  // 5. Legs & Shoes
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.52, 0.14), pantsMat);
  legL.position.set(-0.1, 0.32, 0);
  legL.castShadow = true;
  group.add(legL);

  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.52, 0.14), pantsMat);
  legR.position.set(0.1, 0.32, 0);
  legR.castShadow = true;
  group.add(legR);

  // Shoes
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x09090b });
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.2), shoeMat);
  shoeL.position.set(-0.1, 0.05, 0.03);
  group.add(shoeL);

  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.2), shoeMat);
  shoeR.position.set(0.1, 0.05, 0.03);
  group.add(shoeR);

  // 6. Foodie / Student Accessory (Backpack or Satchel)
  if (cust.demographic === 'student' || cust.demographic === 'foodie') {
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.34, 0.12), new THREE.MeshStandardMaterial({ color: outfit.accessory }));
    bag.position.set(0, 0.8, -0.16);
    group.add(bag);
  }

  // 7. Status Halo (Green = Satisfied, Amber = Waiting, Red = Angry)
  const haloColor = cust.state === 'leaving_angry' ? 0xef4444 : cust.state === 'waiting_food' ? 0xf59e0b : 0x10b981;
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.03, 8, 16),
    new THREE.MeshStandardMaterial({ color: haloColor, emissive: haloColor, emissiveIntensity: 0.6 })
  );
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 1.55;
  group.add(halo);

  group.position.set(cust.x, 0.1, cust.z);
  group.userData = {
    type: 'customer',
    customerId: cust.id,
    animPhase: Math.random() * Math.PI * 2,
    baseY: 0.1,
    legL,
    legR,
    armL,
    armR,
    shoeL,
    shoeR,
    halo,
  };
  return group;
}

export function updateCustomerHalo(group: THREE.Group, state: Customer['state']) {
  const halo = group.userData.halo as THREE.Mesh | undefined;
  if (!halo) return;
  const color = state === 'leaving_angry' ? 0xef4444 : state === 'waiting_food' ? 0xf59e0b : 0x10b981;
  const mat = halo.material as THREE.MeshStandardMaterial;
  if (mat) {
    mat.color.setHex(color);
    mat.emissive.setHex(color);
  }
}

export function updateCustomerPose(
  group: THREE.Group,
  isSeated: boolean,
  isWalking: boolean,
  walkTime: number
) {
  const { legL, legR, armL, armR, shoeL, shoeR } = group.userData;
  if (!legL || !legR || !armL || !armR) return;

  if (isSeated) {
    // Seated pose on chair cushion: bent thighs resting forward, arms on tabletop
    legL.rotation.x = Math.PI / 2.2;
    legL.position.set(-0.1, 0.42, 0.18);
    legR.rotation.x = Math.PI / 2.2;
    legR.position.set(0.1, 0.42, 0.18);

    if (shoeL && shoeR) {
      shoeL.position.set(-0.1, 0.16, 0.36);
      shoeR.position.set(0.1, 0.16, 0.36);
      shoeL.rotation.x = 0;
      shoeR.rotation.x = 0;
    }

    armL.rotation.x = -Math.PI / 5;
    armR.rotation.x = -Math.PI / 5;
    group.position.y = 0.18; // Match chair cushion height comfortably
  } else if (isWalking) {
    // Walking cycle with swinging arms and legs
    const cycle = Math.sin(walkTime * 8);
    legL.rotation.x = cycle * 0.45;
    legL.position.set(-0.1, 0.32, 0);
    legR.rotation.x = -cycle * 0.45;
    legR.position.set(0.1, 0.32, 0);

    if (shoeL && shoeR) {
      shoeL.position.set(-0.1, 0.05, 0.03 + cycle * 0.08);
      shoeR.position.set(0.1, 0.05, 0.03 - cycle * 0.08);
    }

    armL.rotation.x = -cycle * 0.4;
    armR.rotation.x = cycle * 0.4;
    group.position.y = 0.1 + Math.abs(Math.sin(walkTime * 8)) * 0.08;
  } else {
    // Natural standing idle in queue or waiting
    legL.rotation.x = 0;
    legL.position.set(-0.1, 0.32, 0);
    legR.rotation.x = 0;
    legR.position.set(0.1, 0.32, 0);

    if (shoeL && shoeR) {
      shoeL.position.set(-0.1, 0.05, 0.03);
      shoeR.position.set(0.1, 0.05, 0.03);
      shoeL.rotation.x = 0;
      shoeR.rotation.x = 0;
    }

    armL.rotation.x = 0;
    armR.rotation.x = 0;
    group.position.y = 0.1;
  }
}

export function createStaffMesh(staff: StaffMember): THREE.Group {
  const group = new THREE.Group();

  const isChef = staff.role.includes('chef') || staff.role.includes('cook');
  const isBarista = staff.role === 'barista';

  // Uniform Materials
  const chefWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const baristaApron = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.5 });
  const leatherStrap = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });

  // 1. Torso
  const torsoMat = isChef ? chefWhite : baristaApron;
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.25), torsoMat);
  torso.position.y = 0.84;
  torso.castShadow = true;
  group.add(torso);

  // Apron leather straps for barista
  if (isBarista) {
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.27), leatherStrap);
    strapL.position.set(-0.12, 0.85, 0);
    group.add(strapL);

    const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.27), leatherStrap);
    strapR.position.set(0.12, 0.85, 0);
    group.add(strapR);

    // Holding Stainless Milk Pitcher
    const pitcher = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.14, 8), materials.stainlessSteel);
    pitcher.position.set(0.3, 0.72, 0.18);
    group.add(pitcher);
  }

  // Double-breasted buttons for chef
  if (isChef) {
    for (let r = 0; r < 3; r++) {
      const btnL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), materials.darkSteel);
      btnL.position.set(-0.08, 0.72 + r * 0.1, 0.13);
      group.add(btnL);

      const btnR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), materials.darkSteel);
      btnR.position.set(0.08, 0.72 + r * 0.1, 0.13);
      group.add(btnR);
    }
  }

  // 2. Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), skinMat);
  head.position.y = 1.28;
  head.castShadow = true;
  group.add(head);

  // 3. Chef Toque Blanche Hat or Barista Flat Cap
  if (isChef) {
    // Tall Pleated Chef Hat
    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 12), chefWhite);
    hatBase.position.y = 1.44;
    group.add(hatBase);

    const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.28, 12), chefWhite);
    hatTop.position.y = 1.62;
    hatTop.castShadow = true;
    group.add(hatTop);

    // Red neckerchief
    const neckerchief = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.22), materials.espressoRed);
    neckerchief.position.y = 1.12;
    group.add(neckerchief);
  } else {
    // Barista Cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 12), baristaApron);
    cap.position.y = 1.42;
    group.add(cap);
  }

  // 4. Arms
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.38, 0.1), torsoMat);
  armL.position.set(-0.27, 0.76, 0);
  armL.castShadow = true;
  group.add(armL);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.38, 0.1), torsoMat);
  armR.position.set(0.27, 0.76, 0);
  armR.castShadow = true;
  group.add(armR);

  // 5. Legs
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.52, 0.14), pantsMat);
  legL.position.set(-0.11, 0.32, 0);
  legL.castShadow = true;
  group.add(legL);

  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.52, 0.14), pantsMat);
  legR.position.set(0.11, 0.32, 0);
  legR.castShadow = true;
  group.add(legR);

  // Work Glow Ring
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.26, 0.34, 16),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.04;
  group.add(ring);

  // Position by role
  const x = isChef ? -3.5 : isBarista ? 0.8 : -1.2;
  const z = isChef ? -4.2 : -0.2;
  group.position.set(x, 0.1, z);
  group.userData = {
    type: 'staff',
    staffId: staff.id,
    animPhase: Math.random() * Math.PI * 2,
    baseY: 0.1,
  };
  return group;
}
