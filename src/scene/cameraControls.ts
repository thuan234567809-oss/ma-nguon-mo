import * as THREE from 'three';

export class CameraControls {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private isPointerDown: boolean = false;
  private pointerButton: number = 0;
  private lastPointerX: number = 0;
  private lastPointerY: number = 0;

  public cameraTheta: number = Math.PI * 0.25; // 45 deg isometric
  public cameraPhi: number = Math.PI * 0.28; // elevation
  public cameraRadius: number = 24;
  public cameraTarget: THREE.Vector3 = new THREE.Vector3(0, 1.5, 0);

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.setupListeners();
    this.update();
  }

  private setupListeners() {
    this.domElement.addEventListener('mousedown', (e) => {
      this.isPointerDown = true;
      this.pointerButton = e.button;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isPointerDown = false;
    });

    this.domElement.addEventListener('mousemove', (e) => {
      if (!this.isPointerDown) return;
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      if (this.pointerButton === 0) {
        // Left button: Orbit rotation
        this.cameraTheta -= dx * 0.008;
        this.cameraPhi = Math.max(0.15, Math.min(Math.PI / 2.15, this.cameraPhi + dy * 0.008));
      } else if (this.pointerButton === 2 || this.pointerButton === 1) {
        // Right/Middle button: Pan
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        this.cameraTarget.addScaledVector(right, -dx * 0.03);
        this.cameraTarget.addScaledVector(forward, dy * 0.03);
      }
      this.update();
    });

    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

    this.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraRadius = Math.max(8, Math.min(48, this.cameraRadius + e.deltaY * 0.02));
      this.update();
    }, { passive: false });
  }

  public update() {
    const x = this.cameraTarget.x + this.cameraRadius * Math.sin(this.cameraPhi) * Math.sin(this.cameraTheta);
    const y = this.cameraTarget.y + this.cameraRadius * Math.cos(this.cameraPhi);
    const z = this.cameraTarget.z + this.cameraRadius * Math.sin(this.cameraPhi) * Math.cos(this.cameraTheta);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.cameraTarget);
  }

  public setPreset(preset: 'overview' | 'interior' | 'street') {
    if (preset === 'overview') {
      this.cameraRadius = 32;
      this.cameraPhi = Math.PI * 0.32;
      this.cameraTheta = Math.PI * 0.25;
      this.cameraTarget.set(0, 1.5, 0);
    } else if (preset === 'interior') {
      this.cameraRadius = 14;
      this.cameraPhi = Math.PI * 0.22;
      this.cameraTheta = Math.PI * 0.15;
      this.cameraTarget.set(0, 1.2, -0.5);
    } else if (preset === 'street') {
      this.cameraRadius = 18;
      this.cameraPhi = Math.PI * 0.4;
      this.cameraTheta = 0;
      this.cameraTarget.set(0, 1.2, 5.0);
    }
    this.update();
  }
}
