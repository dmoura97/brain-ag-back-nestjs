import { PlantedCrops } from "src/plantedCrops/entities/planted-crops.entity";
import { Farm } from "../entities/farm.entity";
import { Producer } from "../entities/producer.entity";

export class ProducerFactory {
  make(payload: any): Producer {
    const farm = Farm.create(
      payload.farmName,
      payload.city,
      payload.state,
      payload.totalArea,
      payload.cultivableArea,
      payload.vegetationArea
    );
    farm.setPlantedCrops(
      payload.plantedCrops.map((crop) => new PlantedCrops(crop.id, crop.name))
    );
    const producer = Producer.create(payload.document, payload.name);
    producer.setFarm(farm);
    return producer;
  }
}