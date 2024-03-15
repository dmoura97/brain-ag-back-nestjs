import { Injectable } from "@nestjs/common";
import { PlantedCropsRepository } from "src/plantedCrops/contracts/planted-crops-repository";
import { PlantedCrops } from "src/plantedCrops/entities/planted-crops.entity";
import { PlantedCropsFactory } from "src/plantedCrops/factories/planted-crops.factor";
import { DataSource } from "typeorm";

@Injectable()
export class DatabaseTypeormRepository implements PlantedCropsRepository {
  private readonly dataSource: DataSource;

  constructor(datasource: DataSource) {
    this.dataSource = datasource
  }

  async fetchByIds(ids: number[]): Promise<PlantedCrops[]> {
    const queryResult = await this.dataSource.createQueryBuilder()
      .select('*')
      .from('planted_crops', 'planted_crops')
      .where('id IN (:...ids)', { ids }) 
    .execute();
    return (new PlantedCropsFactory()).make(queryResult);
  }

}