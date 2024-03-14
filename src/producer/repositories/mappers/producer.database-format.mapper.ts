import { Producer } from "../../entities/producer.entity";
import { Mapper } from "../../../shared/contracts/mapper";

export class ProducerDatabaseFormatMapper implements Mapper {
  toDatabaseSchema(payload: Producer): any {
    return {
      producer: {
        document: payload.getDocument(),
        name: payload.getName(),
      },
      farm: {
        farm_name: payload.getFarm().getFarmName(),
        city: payload.getFarm().getCity(),
        state: payload.getFarm().getState(),
        total_area: payload.getFarm().getTotalArea(),
        cultivable_area: payload.getFarm().getCultivableArea(),
        vegetation_area: payload.getFarm().getVegetationArea(),
      },
      plantedCrops: payload.getFarm().getPlantedCrops(),
      
    }
  }

}