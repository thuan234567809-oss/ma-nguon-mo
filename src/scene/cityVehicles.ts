import * as THREE from 'three';
import { materials } from './materials';

export interface TrafficVehicle {
  group: THREE.Group;
  speed: number;
  lane: 'east' | 'west';
  wheels: THREE.Mesh[];
  headlights: THREE.Mesh[];
  taillights: THREE.Mesh[];
}

export class CityTrafficManager {
  public group = new THREE.Group();
  private movingVehicles: TrafficVehicle[] = [];
  private allHeadlights: THREE.Mesh[] = [];
  private allTaillights: THREE.Mesh[] = [];

  constructor() {
    this.initParkedVehicles();
    this.initMovingVehicles();
  }

  private initParkedVehicles() {
    // Curbside parking bays on the near side (Z = 4.2) and far side (Z = 11.8)
    const parkedConfigs = [
      { type: 'sedan', color: 0x2563eb, x: -16, z: 4.5, rot: 0, label: 'Xe sedan công sở cao cấp' },
      { type: 'hatchback', color: 0x059669, x: -11, z: 4.5, rot: 0, label: 'Xe điện đô thị thông minh' },
      { type: 'van', color: 0xd97706, x: 14, z: 4.5, rot: 0, label: 'Xe bán tải vận chuyển nguyên liệu' },
      { type: 'sedan', color: 0x475569, x: 20, z: 4.5, rot: 0, label: 'Xe ô tô văn phòng đỗ ven đường' },
      { type: 'hatchback', color: 0xdc2626, x: -18, z: 11.5, rot: Math.PI, label: 'Xe hatchback của khách mua sắm' },
      { type: 'sedan', color: 0x7c3aed, x: 17, z: 11.5, rot: Math.PI, label: 'Xe sedan đối tác nhà hàng' },
    ];

    parkedConfigs.forEach((cfg) => {
      const v = this.buildVehicleMesh(cfg.type, cfg.color, cfg.label, true);
      v.mesh.position.set(cfg.x, 0.15, cfg.z);
      v.mesh.rotation.y = cfg.rot;
      this.group.add(v.mesh);
    });
  }

  private initMovingVehicles() {
    // Eastbound Lane (Z = 6.6, moving towards +X)
    const eastConfigs = [
      { type: 'sedan', color: 0x3b82f6, x: -28, speed: 5.5, label: 'Xe sedan lưu thông hướng Đông' },
      { type: 'hatchback', color: 0x10b981, x: -9, speed: 4.8, label: 'Xe điện lưu thông phố ẩm thực' },
      { type: 'van', color: 0xf97316, x: 12, speed: 4.2, label: 'Xe tải giao hàng chặng ngắn' },
    ];

    // Westbound Lane (Z = 9.4, moving towards -X)
    const westConfigs = [
      { type: 'sedan', color: 0xef4444, x: 26, speed: -5.2, label: 'Taxi công nghệ đón khách' },
      { type: 'hatchback', color: 0x8b5cf6, x: 7, speed: -4.6, label: 'Xe cá nhân lưu thông hướng Tây' },
      { type: 'sedan', color: 0x0284c7, x: -15, speed: -5.0, label: 'Xe gia đình dạo phố ẩm thực' },
    ];

    eastConfigs.forEach((c) => {
      const v = this.buildVehicleMesh(c.type, c.color, c.label, false);
      v.mesh.position.set(c.x, 0.15, 6.6);
      v.mesh.rotation.y = 0; // Facing +X
      this.group.add(v.mesh);
      this.movingVehicles.push({
        group: v.mesh,
        speed: c.speed,
        lane: 'east',
        wheels: v.wheels,
        headlights: v.headlights,
        taillights: v.taillights,
      });
      this.allHeadlights.push(...v.headlights);
      this.allTaillights.push(...v.taillights);
    });

    westConfigs.forEach((c) => {
      const v = this.buildVehicleMesh(c.type, c.color, c.label, false);
      v.mesh.position.set(c.x, 0.15, 9.4);
      v.mesh.rotation.y = Math.PI; // Facing -X
      this.group.add(v.mesh);
      this.movingVehicles.push({
        group: v.mesh,
        speed: c.speed,
        lane: 'west',
        wheels: v.wheels,
        headlights: v.headlights,
        taillights: v.taillights,
      });
      this.allHeadlights.push(...v.headlights);
      this.allTaillights.push(...v.taillights);
    });
  }

  private buildVehicleMesh(
    type: string,
    colorHex: number,
    label: string,
    isParked: boolean
  ): { mesh: THREE.Group; wheels: THREE.Mesh[]; headlights: THREE.Mesh[]; taillights: THREE.Mesh[] } {
    const root = new THREE.Group();
    const wheels: THREE.Mesh[] = [];
    const headlights: THREE.Mesh[] = [];
    const taillights: THREE.Mesh[] = [];

    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.3,
      metalness: 0.45,
    });
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.8,
    });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });

    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfef08a,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const tailMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      emissive: 0xef4444,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    if (type === 'van') {
      // Commercial Van / Cargo Pickup
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 1.45), bodyMat);
      chassis.position.y = 0.45;
      chassis.castShadow = true;
      root.add(chassis);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.75, 1.4), cabinMat);
      cabin.position.set(0.65, 0.95, 0);
      cabin.castShadow = true;
      root.add(cabin);

      const cargoBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.05, 1.42),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 })
      );
      cargoBox.position.set(-0.65, 1.05, 0);
      cargoBox.castShadow = true;
      root.add(cargoBox);
    } else if (type === 'hatchback') {
      // Modern EV Compact Hatchback
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.42, 1.35), bodyMat);
      chassis.position.y = 0.42;
      chassis.castShadow = true;
      root.add(chassis);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.58, 1.25), cabinMat);
      cabin.position.set(-0.15, 0.82, 0);
      cabin.castShadow = true;
      root.add(cabin);
    } else {
      // Modern Luxury Sedan
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.4, 1.4), bodyMat);
      chassis.position.y = 0.4;
      chassis.castShadow = true;
      root.add(chassis);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 1.28), cabinMat);
      cabin.position.set(-0.1, 0.8, 0);
      cabin.castShadow = true;
      root.add(cabin);

      // Hood slope
      const hood = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.2, 1.36), bodyMat);
      hood.position.set(0.95, 0.52, 0);
      hood.rotation.z = -0.12;
      root.add(hood);
    }

    // Wheels (4 units with rims)
    const wheelPositions = [
      [0.85, 0.26, 0.74],
      [0.85, 0.26, -0.74],
      [-0.85, 0.26, 0.74],
      [-0.85, 0.26, -0.74],
    ];

    const wheelGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.18, 14);
    const rimGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.19, 8);

    wheelPositions.forEach(([wx, wy, wz]) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(wx, wy, wz);

      const tire = new THREE.Mesh(wheelGeo, wheelMat);
      tire.rotation.x = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      wGroup.add(rim);

      root.add(wGroup);
      wheels.push(tire);
    });

    // Headlights (Front: +X direction)
    const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.22), headMat);
    hl1.position.set(1.44, 0.46, 0.48);
    root.add(hl1);
    headlights.push(hl1);

    const hl2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.22), headMat);
    hl2.position.set(1.44, 0.46, -0.48);
    root.add(hl2);
    headlights.push(hl2);

    // Taillights (Rear: -X direction)
    const tl1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.26), tailMat);
    tl1.position.set(-1.44, 0.5, 0.46);
    root.add(tl1);
    taillights.push(tl1);

    const tl2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.26), tailMat);
    tl2.position.set(-1.44, 0.5, -0.46);
    root.add(tl2);
    taillights.push(tl2);

    root.userData = {
      type: 'city_vehicle',
      id: 'veh_' + Math.random().toString(36).substring(2, 7),
      title: label,
      subtitle: isParked ? 'Đang đậu ven lề đường phố ẩm thực' : 'Đang di chuyển trên đại lộ chính',
      stats: [
        { label: 'Loại phương tiện', value: type === 'van' ? 'Xe bán tải / Van' : type === 'hatchback' ? 'Xe điện đô thị' : 'Xe Sedan hiện đại' },
        { label: 'Trạng thái', value: isParked ? 'Đỗ quy chuẩn ven đường' : 'Lưu thông bình thường' },
        { label: 'Tác động', value: '+12% lưu lượng khách ghé quán' },
      ],
    };

    return { mesh: root, wheels, headlights, taillights };
  }

  public update(deltaSec: number) {
    const dt = Math.min(deltaSec, 0.1);
    const BOUND = 35;

    for (const v of this.movingVehicles) {
      v.group.position.x += v.speed * dt;

      // Spin wheels based on travel distance
      const spin = (v.speed / 0.26) * dt;
      for (const w of v.wheels) {
        w.rotation.z += spin;
      }

      // Wrap around bounds
      if (v.speed > 0 && v.group.position.x > BOUND) {
        v.group.position.x = -BOUND;
      } else if (v.speed < 0 && v.group.position.x < -BOUND) {
        v.group.position.x = BOUND;
      }
    }
  }

  public setNightMode(isNight: boolean) {
    const intensity = isNight ? 1.4 : 0.35;
    this.allHeadlights.forEach((h) => {
      const mat = h.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = intensity;
    });
    this.allTaillights.forEach((t) => {
      const mat = t.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isNight ? 1.1 : 0.4;
    });
  }
}
