/**
 * Facade Coordinator for 3D Mesh Builders
 * Re-exports modular builders to maintain backwards-compatibility
 * and adhere to Single Responsibility & <500 LOC per file constraints.
 */
export { materials } from './materials';
export { buildRestaurantBase } from './restaurantMeshes';
export { createTableMesh, createPottedPlantMesh } from './furnitureMeshes';
export { createCustomerMesh, createStaffMesh, updateCustomerPose, updateCustomerHalo } from './characterMeshes';
export { buildEnvironmentMeshes, createDeliveryScooterMesh } from './cityEnvironmentMeshes';
export type { CityEnvironmentResult } from './cityEnvironmentMeshes';
export { CityBuildingsManager } from './cityBuildings';
export { CityTrafficManager } from './cityVehicles';
