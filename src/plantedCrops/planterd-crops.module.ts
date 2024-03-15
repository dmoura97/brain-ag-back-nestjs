import { Module } from "@nestjs/common";
import { PlantedCropsService } from "./services/planted-crops.service";
import { PlantedCropsDatabaseInMemory } from "./repositories/in-memory/planted-crops-database-in-memory";
import { DataSourceTypeorm } from "src/config";
import { DatabaseTypeormRepository } from "./repositories/typeorm/database-typeorm.repository";

@Module({
  imports: [],
  exports: [PlantedCropsService],
  providers: [
    PlantedCropsService,
    {
      provide: 'PlantedCropsRepository',
      //useClass: PlantedCropsDatabaseInMemory
      useClass: DatabaseTypeormRepository
    },
    {
      provide: 'DataSource',
      useValue: DataSourceTypeorm
    }
  ]
})
export class PlantedCropsModule {}