import { randomUUID } from "crypto";
import { PlantedCropsDatabaseInMemory } from "../../../plantedCrops/repositories/in-memory/planted-crops-database-in-memory";
import { ProducerRepository } from "../../contracts/producer.repository";
import { Producer } from "../../entities/producer.entity";

export class ProducerDatabaseInMemory implements ProducerRepository {
  private data: Producer[] = [];
  private farm_plantedCrops = [];
  private plantedCropsData: PlantedCropsDatabaseInMemory;

  constructor() {
    this.plantedCropsData = new PlantedCropsDatabaseInMemory();
  }

  async save(producer: Producer): Promise<string> {
    producer.setId(randomUUID());
    producer.getFarm().setId(randomUUID())
    this.data.push(producer);
    for(const plantedCrop of producer.getFarm().getPlantedCrops()) {
      this.farm_plantedCrops.push({
        id: randomUUID(),
        farm_id: producer.getFarm().getId(),
        planted_crop_id: plantedCrop.getId()
      });
    }
    return producer.getId()
  }
  
  async getById(id: string): Promise<Producer> {
    const producer = this.data.find(producer => producer.getId() === id);
    if(!producer) return null;
    return producer;
  }
  async update(id: string, producer: Producer, idsToRemove: number[], idsToAdd: number[]): Promise<void> {
    producer.setId(id);
    const index = this.data.findIndex((item) => item.getId() === id);
    this.data[index] = producer;
    if(idsToRemove && idsToRemove.length > 0) {
      for(const idToRemove of idsToRemove) {
        const index = this.farm_plantedCrops.findIndex((item) => item.id === idToRemove && item.farm_id === producer.getFarm().getId());
        this.farm_plantedCrops.splice(index, 1)
      }
    }
    if(idsToAdd && idsToAdd.length > 0) {
      for(const idToAdd of idsToAdd) {
        this.farm_plantedCrops.push({
          id: randomUUID(),
          producerId: producer.getId(),
          plantedCropId: idToAdd
        })
      }
    }
  }

  async delete(producer: Producer): Promise<void> {
    const index = this.data.findIndex((item) => item.getId() === producer.getId());
    this.data.splice(index, 1)
    this.farm_plantedCrops = this.farm_plantedCrops.filter(item => item.farm_id !== producer.getFarm().getId());
  }

  async getPlantedCropsByFarmId(farmId: string): Promise<any[]> {
    return this.farm_plantedCrops.filter((item) => item.farm_id === farmId);
  }
  
}