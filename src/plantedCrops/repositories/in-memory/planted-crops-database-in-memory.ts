import { PlantedCropsRepository } from "../../contracts/planted-crops-repository";
import { PlantedCrops } from "../../entities/planted-crops.entity";

export class PlantedCropsDatabaseInMemory implements PlantedCropsRepository {
  private data: PlantedCrops[] = []

  constructor() {
    this.data.push(
      new PlantedCrops(1, 'soybeans'), 
      new PlantedCrops(2, 'corn'),
      new PlantedCrops(3, 'cotton'),
      new PlantedCrops(4, 'coffee'),
      new PlantedCrops(5, 'sugarcane')
    );
  }
  
  async fetchByIds(ids: number[]): Promise<PlantedCrops[]> {
    const result = this.data.filter(crop => ids.includes(crop.getId()));
    return result;
  }

  getData(): PlantedCrops[] {
    return this.data;
  }
}