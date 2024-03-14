import { Producer } from "../../entities/producer.entity";
import { Mapper } from "../../../shared/contracts/mapper";

export class ProducerDatabaseFormatMapper implements Mapper {
  toDatabaseSchema(payload: Producer): any {
    const producerData = {
      document: payload.getDocument(),
      name: payload.getName(),
    };
    const farmData = {
      farm_name: payload.getFarm().getFarmName(),
      city: payload.getFarm().getCity(),
      state: payload.getFarm().getState(),
      total_area: payload.getFarm().getTotalArea(),
      cultivable_area: payload.getFarm().getCultivableArea(),
      vegetation_area: payload.getFarm().getVegetationArea(),
    };
    const plantedCropsData = payload.getFarm().getPlantedCrops();
    return {
      producerData,
      farm: farmData,
      plantedCrops: plantedCropsData,
    };
  }
}
