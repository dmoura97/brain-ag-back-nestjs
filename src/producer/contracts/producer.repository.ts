import { Producer } from "../entities/producer.entity";

export interface ProducerRepository {
  save(producer: Producer): Promise<string>;
  getById(id: string): Promise<Producer>;
  update(id: string, producer: Producer, idsToRemove: number[], idsToAdd: number[]): Promise<void>
  delete(producer: Producer): Promise<void>;
  getPlantedCropsByFarmId(farmId: string): Promise<any []>
}