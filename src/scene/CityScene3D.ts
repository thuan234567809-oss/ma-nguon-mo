import * as THREE from 'three';
import { GameState, InspectableEntity } from '../types/game';
import {
  buildEnvironmentMeshes,
  buildRestaurantBase,
  createCustomerMesh,
  createStaffMesh,
  createTableMesh,
  createDeliveryScooterMesh,
  createPottedPlantMesh,
  updateCustomerPose,
  updateCustomerHalo,
  CityBuildingsManager,
  CityTrafficManager,
} from './meshBuilders';
import { CameraControls } from './cameraControls';
import { generateWaypointPath } from './navigation';

export class CityScene3D {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private onSelectEntity: (entity: InspectableEntity) => void;
  private controls: CameraControls;

  // Lights
  private sunLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;

  // Weather particles
  private rainParticles: THREE.Points | null = null;

  // Dynamic mesh maps
  private customerMeshes: Map<string, THREE.Group> = new Map();
  private staffMeshes: Map<string, THREE.Group> = new Map();
  private tableMeshes: Map<string, THREE.Group> = new Map();
  private buildingsManager: CityBuildingsManager;
  private trafficManager: CityTrafficManager;

  // Raycasting
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mousePos: THREE.Vector2 = new THREE.Vector2();

  constructor(container: HTMLElement, onSelectEntity: (entity: InspectableEntity) => void) {
    this.container = container;
    this.onSelectEntity = onSelectEntity;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.012);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 200);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Camera Controls
    this.controls = new CameraControls(this.camera, this.renderer.domElement);

    // 5. Lights
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    this.sunLight.position.set(20, 35, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.scene.add(this.sunLight);

    // 6. Build Environment & Meshes
    const env = buildEnvironmentMeshes(this.scene);
    this.buildingsManager = env.buildingsManager;
    this.trafficManager = env.trafficManager;

    buildRestaurantBase(this.scene);
    this.scene.add(createDeliveryScooterMesh());
    this.scene.add(createPottedPlantMesh(-6.2, 4.2));
    this.scene.add(createPottedPlantMesh(6.2, 4.2));
    this.scene.add(createPottedPlantMesh(2.8, 0.5));
    this.setupRainParticles();

    // 7. Click & Resize Listeners
    this.setupEventListeners();
    this.startLoop();
  }

  private setupRainParticles() {
    const count = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.15,
      transparent: true,
      opacity: 0.7,
    });
    this.rainParticles = new THREE.Points(geometry, material);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  private setupEventListeners() {
    const dom = this.renderer.domElement;

    dom.addEventListener('click', (e) => {
      const rect = dom.getBoundingClientRect();
      this.mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.handleClickSelect();
    });

    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public setCameraPreset(preset: 'overview' | 'interior' | 'street') {
    this.controls.setPreset(preset);
  }

  private handleClickSelect() {
    this.raycaster.setFromCamera(this.mousePos, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    for (let hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && !obj.userData?.type) {
        obj = obj.parent;
      }
      if (obj && obj.userData?.type) {
        const type = obj.userData.type;
        if (type === 'customer') {
          this.onSelectEntity({
            type: 'customer',
            id: obj.userData.customerId,
            title: 'Customer Visitor',
            subtitle: 'Dine-in / Takeaway Patron',
            stats: [{ label: 'Status', value: 'Active' }],
          });
          return;
        } else if (type === 'staff') {
          this.onSelectEntity({
            type: 'staff',
            id: obj.userData.staffId,
            title: 'Team Member',
            subtitle: 'On Shift Operation',
            stats: [{ label: 'Status', value: 'Working' }],
          });
          return;
        } else if (type === 'table') {
          this.onSelectEntity({
            type: 'table',
            id: obj.userData.tableId,
            title: 'Dining Table',
            subtitle: 'Interior Seating Space',
            stats: [{ label: 'Type', value: 'Standard Dining' }],
          });
          return;
        } else if (type === 'district_building') {
          const isComp = obj.userData.label?.includes('Competitor');
          this.onSelectEntity({
            type: isComp ? 'competitor' : 'district_building',
            id: 'building_' + obj.userData.label,
            title: obj.userData.label,
            subtitle: isComp ? 'Rival Food Outlet Across Street' : 'City Neighborhood Landmark',
            stats: [
              { label: 'Role', value: isComp ? 'Local Market Share Rival' : 'Traffic Generator' },
              { label: 'Proximity', value: 'Metropolitan Commercial Zone' },
            ],
          });
          return;
        } else if (type === 'delivery_fleet') {
          this.onSelectEntity({
            type: 'equipment',
            id: 'delivery_fleet',
            title: 'Express Delivery Courier Fleet',
            subtitle: 'Curbside Takeout & Online Dispatch Station',
            stats: [
              { label: 'Role', value: 'Instant Delivery Dispatch' },
              { label: 'Weather Advantage', value: 'Rain Storm Revenue Surge (+140%)' },
            ],
          });
          return;
        } else if (type === 'city_vehicle') {
          this.onSelectEntity({
            type: 'equipment',
            id: obj.userData.id,
            title: obj.userData.title,
            subtitle: obj.userData.subtitle,
            stats: obj.userData.stats,
          });
          return;
        }
      }
    }
  }

  public updateState(state: GameState, deltaSec: number) {
    // 1. Day / Night Lighting Transitions
    const hour = state.timeHour;
    const angle = ((hour - 6) / 24) * Math.PI * 2;
    this.sunLight.position.set(Math.cos(angle) * 35, Math.sin(angle) * 35, 20);

    const isNight = hour < 5.5 || hour > 19.5;
    const isDawnDusk = (hour >= 5.5 && hour <= 7.0) || (hour >= 17.5 && hour <= 19.5);

    let skyColor = new THREE.Color(0x38bdf8);
    if (isNight) {
      skyColor = new THREE.Color(0x090d16);
      this.ambientLight.intensity = 0.25;
      this.sunLight.intensity = 0.1;
    } else if (isDawnDusk) {
      skyColor = new THREE.Color(0xf59e0b);
      this.ambientLight.intensity = 0.55;
      this.sunLight.intensity = 0.8;
    } else {
      this.ambientLight.intensity = 0.7;
      this.sunLight.intensity = 1.3;
    }
    this.scene.background = skyColor;
    if (this.scene.fog) {
      (this.scene.fog as THREE.FogExp2).color = skyColor;
      (this.scene.fog as THREE.FogExp2).density = state.weather === 'heavy_rain' ? 0.025 : 0.01;
    }

    this.trafficManager.setNightMode(isNight);
    this.buildingsManager.updateLighting(isNight);

    // 2. Weather Rain Particles
    if (this.rainParticles) {
      const isRaining = state.weather === 'rain' || state.weather === 'heavy_rain';
      this.rainParticles.visible = isRaining;
      if (isRaining) {
        const pos = this.rainParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < pos.length; i += 3) {
          pos[i] -= deltaSec * 35;
          if (pos[i] < 0) pos[i] = 25;
        }
        this.rainParticles.geometry.attributes.position.needsUpdate = true;
      }
    }

    // 3. Dynamic Street Traffic Simulation
    this.trafficManager.update(deltaSec);

    // 4. Tables Sync
    state.tables.forEach(table => {
      if (!this.tableMeshes.has(table.id)) {
        const mesh = createTableMesh(table);
        this.scene.add(mesh);
        this.tableMeshes.set(table.id, mesh);
      }
    });

    // 5. Staff Sync
    state.staff.forEach(s => {
      let staffMesh = this.staffMeshes.get(s.id);
      if (!staffMesh) {
        staffMesh = createStaffMesh(s);
        this.scene.add(staffMesh);
        this.staffMeshes.set(s.id, staffMesh);
      }
      if (s.isWorking) {
        staffMesh.position.y = 0.1 + Math.sin(Date.now() * 0.006) * 0.04;
      }
    });

    // 6. Customers Sync & Smooth Walk Interpolation
    const activeCustIds = new Set(state.customers.map(c => c.id));
    this.customerMeshes.forEach((mesh, id) => {
      if (!activeCustIds.has(id)) {
        this.scene.remove(mesh);
        this.customerMeshes.delete(id);
      }
    });

    const nowSec = performance.now() * 0.001;
    state.customers.forEach(c => {
      let custMesh = this.customerMeshes.get(c.id);
      if (!custMesh) {
        custMesh = createCustomerMesh(c);
        this.scene.add(custMesh);
        this.customerMeshes.set(c.id, custMesh);
      }

      const uData = custMesh.userData;
      const isLeaving = c.state === 'leaving_happy' || c.state === 'leaving_angry';
      const isSeated = c.state === 'seated' || c.state === 'waiting_food' || c.state === 'eating';

      // Check if path waypoints need generation or destination changed
      if (
        !uData.waypoints ||
        uData.targetX !== c.targetX ||
        uData.targetZ !== c.targetZ
      ) {
        uData.targetX = c.targetX;
        uData.targetZ = c.targetZ;
        uData.waypoints = generateWaypointPath(
          custMesh.position.x,
          custMesh.position.z,
          c.targetX,
          c.targetZ,
          isLeaving
        );
        uData.wpIndex = 0;
      }

      const waypoints = uData.waypoints as { x: number; z: number }[];
      let wpIndex = (uData.wpIndex as number) || 0;

      if (wpIndex < waypoints.length) {
        const wp = waypoints[wpIndex];
        const dx = wp.x - custMesh.position.x;
        const dz = wp.z - custMesh.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.15) {
          const moveDist = Math.min(dist, c.speed * 2.6 * deltaSec);
          custMesh.position.x += (dx / dist) * moveDist;
          custMesh.position.z += (dz / dist) * moveDist;
          custMesh.rotation.y = Math.atan2(dx, dz);
          updateCustomerPose(custMesh, false, true, nowSec);
        } else {
          uData.wpIndex = wpIndex + 1;
        }
      } else {
        // At final destination
        if (isSeated) {
          custMesh.position.x = c.targetX;
          custMesh.position.z = c.targetZ;
          if (c.rotationY !== undefined) {
            custMesh.rotation.y = c.rotationY;
          }
          updateCustomerPose(custMesh, true, false, nowSec);
        } else {
          if (c.rotationY !== undefined) {
            custMesh.rotation.y = c.rotationY;
          }
          updateCustomerPose(custMesh, false, false, nowSec);
        }
      }

      updateCustomerHalo(custMesh, c.state);
      c.x = custMesh.position.x;
      c.z = custMesh.position.z;
    });
  }

  private startLoop() {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const deltaSec = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      this.renderer.render(this.scene, this.camera);
      this.animFrameId = requestAnimationFrame(animate);
    };
    this.animFrameId = requestAnimationFrame(animate);
  }

  public destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
