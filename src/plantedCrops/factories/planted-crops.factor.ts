import { PlantedCrops } from "../entities/planted-crops.entity"

export class PlantedCropsFactory {
  make(payload: any): PlantedCrops[] {
    const plantedCropsArray: PlantedCrops[] = [];
    for (const plantedCrop of payload) {
      plantedCropsArray.push(new PlantedCrops(plantedCrop.id, plantedCrop.name))
    }
    return plantedCropsArray
  }
}