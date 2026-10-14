import * as THREE from 'three';
import { materials } from './materials';

export class CityBuildingsManager {
  public group = new THREE.Group();
  private neonMaterials: THREE.MeshStandardMaterial[] = [];
  private windowMaterials: THREE.MeshStandardMaterial[] = [];

  constructor() {
    this.buildFinTechTower();
    this.buildResidentialTowers();
    this.buildGourmetMart();
    this.buildCompetitorRoastery();
  }

  /**
   * 1. Metro FinTech Tower (Tòa Tháp Tài Chính & Công Nghệ Hiện Đại)
   */
  private buildFinTechTower() {
    const root = new THREE.Group();
    root.position.set(20, 0, -8);

    // Main Skyscraper Body
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.6,
    });
    const tower = new THREE.Mesh(new THREE.BoxGeometry(14, 24, 14), towerMat);
    tower.position.y = 12;
    tower.castShadow = true;
    tower.receiveShadow = true;
    root.add(tower);

    // Glowing Cyan Grid Windows
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
    });
    this.windowMaterials.push(winMat);

    for (let floor = 2; floor <= 9; floor++) {
      for (let c = -2; c <= 2; c++) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), winMat);
        win.position.set(c * 2.3, floor * 2.3, 7.05);
        root.add(win);
      }
    }

    // Modern Entrance Glass Canopy (Mái Che Kính Sảnh Đón)
    const canopyFrame = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.15, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 })
    );
    canopyFrame.position.set(0, 3.5, 8.2);
    root.add(canopyFrame);

    // Chrome Pillars supporting Canopy
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    [-2.8, 2.8].forEach((px) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5, 8), pillarMat);
      p.position.set(px, 1.75, 9.6);
      root.add(p);
    });

    // Giant High-Tech LED Digital Billboard (Biển LED Kỹ Thuật Số)
    const ledNeonMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    this.neonMaterials.push(ledNeonMat);

    const billboard = new THREE.Mesh(new THREE.PlaneGeometry(8, 2.2), ledNeonMat);
    billboard.position.set(0, 7.2, 7.06);
    root.add(billboard);

    // Rooftop Communications Mast & HVAC
    const hvac = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 4), materials.darkSteel);
    hvac.position.set(-2, 24.75, 0);
    root.add(hvac);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 5, 8), materials.polishedBrass);
    mast.position.set(2, 26.5, 0);
    root.add(mast);

    root.userData = {
      type: 'district_building',
      label: 'Tòa Tháp Tài Chính FinTech Tower',
      subtitle: 'Khu văn phòng cao cấp với hơn 3.000 nhân viên tiềm năng',
      stats: [
        { label: 'Quy mô', value: '32 tầng văn phòng hạng A' },
        { label: 'Lượng khách', value: '+35% đơn hàng giờ trưa (11:30 - 13:30)' },
      ],
    };
    this.group.add(root);
  }

  /**
   * 2. Metropolitan Luxury Residence (Khu Căn Hộ Phức Hợp)
   */
  private buildResidentialTowers() {
    const root = new THREE.Group();
    root.position.set(-20, 0, -8);

    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6,
      metalness: 0.2,
    });
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(12, 18, 12), towerMat);
    bMesh.position.y = 9;
    bMesh.castShadow = true;
    bMesh.receiveShadow = true;
    root.add(bMesh);

    // Balconies with Railings
    const balconyMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4 });
    for (let floor = 1; floor <= 4; floor++) {
      const balc = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, 1.2), balconyMat);
      balc.position.set(0, floor * 3.4 + 1.2, 6.4);
      root.add(balc);

      const glassRail = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.7, 0.05), materials.glass);
      glassRail.position.set(0, floor * 3.4 + 1.7, 6.95);
      root.add(glassRail);
    }

    // Warm Neon Residence Signboard (Biển hiệu LED Căn Hộ)
    const neonSignMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 0.85,
      roughness: 0.25,
    });
    this.neonMaterials.push(neonSignMat);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(6, 1.1, 0.15), neonSignMat);
    sign.position.set(0, 16.5, 6.1);
    root.add(sign);

    // Ground Floor Awning (Mái Che Đón Khách)
    const awning = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.2, 2.2), materials.awningBurgundy);
    awning.position.set(0, 3.2, 6.8);
    awning.rotation.x = 0.1;
    root.add(awning);

    root.userData = {
      type: 'district_building',
      label: 'Khu Căn Hộ Cao Cấp Metropolitan',
      subtitle: 'Khu dân cư hiện đại đối diện đại lộ, nguồn khách gia đình',
      stats: [
        { label: 'Cư dân', value: '850 hộ gia đình trẻ' },
        { label: 'Thói quen', value: 'Thích cà phê sáng & món tráng miệng' },
      ],
    };
    this.group.add(root);
  }

  /**
   * 3. Central Gourmet Mart (Siêu Thị Thực Phẩm & Mua Sắm)
   */
  private buildGourmetMart() {
    const root = new THREE.Group();
    root.position.set(-11, 0, 19);

    const martMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(16, 7.5, 9), martMat);
    bMesh.position.y = 3.75;
    bMesh.castShadow = true;
    bMesh.receiveShadow = true;
    root.add(bMesh);

    // Entrance Canopy Arch (Mái Vòm Che Hiện Đại)
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.5 });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, 2.8), canopyMat);
    canopy.position.set(0, 3.8, -4.8);
    root.add(canopy);

    // Glowing Amber LED Brand Sign (Biển Hiệu LED Siêu Thị)
    const martNeonMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.95,
      roughness: 0.2,
    });
    this.neonMaterials.push(martNeonMat);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(9.5, 1.4, 0.15), martNeonMat);
    sign.position.set(0, 5.8, -4.55);
    root.add(sign);

    root.userData = {
      type: 'district_building',
      label: 'Đại Siêu Thị Gourmet Mart',
      subtitle: 'Trung tâm mua sắm sầm uất phía đối diện đại lộ',
      stats: [
        { label: 'Khách vãng lai', value: '4.500 lượt ghé thăm mỗi ngày' },
        { label: 'Hợp tác tiếp tế', value: 'Giảm 15% chi phí bơ sữa cao cấp' },
      ],
    };
    this.group.add(root);
  }

  /**
   * 4. Artisan Roastery Competitor (Quán Cà Phê Đối Thủ)
   */
  private buildCompetitorRoastery() {
    const root = new THREE.Group();
    root.position.set(11, 0, 19);

    const shopMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 });
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(13, 6.5, 9), shopMat);
    bMesh.position.y = 3.25;
    bMesh.castShadow = true;
    bMesh.receiveShadow = true;
    root.add(bMesh);

    // Striped European Awning Canopy (Mái Hiên Bạt Phong Cách Bistro)
    const awningMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.4 });
    const awning = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 2.4), awningMat);
    awning.position.set(0, 3.4, -4.8);
    awning.rotation.x = -0.15;
    root.add(awning);

    // Glowing Ruby/Amber Neon Logo (Biển Hiệu Neon Đối Thủ)
    const rivalNeonMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    this.neonMaterials.push(rivalNeonMat);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.2, 0.15), rivalNeonMat);
    sign.position.set(0, 4.9, -4.55);
    root.add(sign);

    // Outdoor Sidewalk Tables and Chairs
    const tableMat = materials.darkWalnut;
    [-2.2, 2.2].forEach((tx) => {
      const table = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.65, 12), tableMat);
      table.position.set(tx, 0.32, -6.0);
      root.add(table);
    });

    root.userData = {
      type: 'competitor',
      label: 'Artisan Roastery Competitor',
      subtitle: 'Quán cà phê đối thủ cạnh tranh thị phần trực tiếp',
      stats: [
        { label: 'Thị phần', value: 'Chiếm 28% khách hàng khu vực' },
        { label: 'Chiến lược cạnh tranh', value: 'Nâng cao chất lượng để kéo khách' },
      ],
    };
    this.group.add(root);
  }

  public updateLighting(isNight: boolean) {
    const neonIntensity = isNight ? 1.4 : 0.45;
    this.neonMaterials.forEach((m) => {
      m.emissiveIntensity = neonIntensity;
    });

    const winIntensity = isNight ? 0.8 : 0.2;
    this.windowMaterials.forEach((m) => {
      m.emissiveIntensity = winIntensity;
    });
  }
}
