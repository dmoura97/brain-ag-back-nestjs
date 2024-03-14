import { PlantedCrops } from "../entities/planted-crops.entity"

export interface PlantedCropsRepository {
  fetchByIds(ids: number[]): Promise<PlantedCrops[]>
}