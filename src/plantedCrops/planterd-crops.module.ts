import { Module } from "@nestjs/common";
import { PlantedCropsService } from "./services/planted-crops.service";
import { PlantedCropsDatabaseInMemory } from "./repositories/in-memory/planted-crops-database-in-memory";

@Module({
  imports: [],
  exports: [PlantedCropsService],
  providers: [
    PlantedCropsService,
    {
      provide: 'PlantedCropsRepository',
      useClass: PlantedCropsDatabaseInMemory
    }
  ]
})
export class PlantedCropsModule {}