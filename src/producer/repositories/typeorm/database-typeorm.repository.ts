import { Producer } from "src/producer/entities/producer.entity";
import { ProducerRepository } from "../../../producer/contracts/producer.repository";
import { Mapper } from "../../../shared/contracts/mapper";
import { DataSource } from "typeorm";
import { ProducerDatabaseFormatMapper } from "../mappers/producer.database-format.mapper";
import { PlantedCrops } from "src/plantedCrops/entities/planted-crops.entity";
import { ProducerFactory } from "src/producer/factories/producer.factor";
import { Injectable } from "@nestjs/common";

export type ProducerType = {
  id: string;
  document: string;
  name: string;
  farmName: string;
  city: string;
  state: string;
  totalArea: number;
  cultivableArea: number;
  vegetationArea: number;
  plantedCrops: PlantedCrops[];
}

@Injectable()
export class DatabaseTypeOrmRepository implements ProducerRepository {
  private readonly mapper: Mapper;
  private readonly dataSource: DataSource;

  constructor(datasource: DataSource) {
    this.mapper = new ProducerDatabaseFormatMapper();
    this.dataSource = datasource
  }

  async save(producer: Producer): Promise<string> {
    const { producerData, farm, plantedCrops } = this.mapper.toDatabaseSchema(producer);
    let producerId: string;
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const producerResult = await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into('producer')
        .values(producerData)
        .returning('id')
      .execute()
      producerId = producerResult.raw[0].id
      const farmResult = await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into('farm')
        .values({ ...farm, producer_id: producerId})
        .returning('id')
      .execute()
      const farmId = farmResult.raw[0].id;
      for(const plantedCrop of plantedCrops) {
        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into('farm_planted_crops')
          .values({ farm_id: farmId, planted_crops_id: plantedCrop.id })
        .execute();
      }
    });
    return producerId;
  }

  async getById(id: string): Promise<Producer> {
    const producer = await this.fetchTransfer(id);
    if(!producer) return null;
    return (new ProducerFactory()).make(producer)
  }

  async update(id: string, producer: Producer, idsToRemove: number[], idsToAdd: number[]): Promise<void> {
    const farmId = producer.getFarm().getId();
    const { farm, producerData } = this.mapper.toDatabaseSchema(producer);
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.createQueryBuilder()
        .update('producer')
        .set(producerData)
        .where('id = :id', { id })
      .execute();
      await transactionalEntityManager.createQueryBuilder()
        .update('farm')
        .set(farm)
        .where('id = :farmId', { farmId })
      .execute();
      if(idsToRemove && idsToRemove.length > 0) {
        await transactionalEntityManager.createQueryBuilder()
          .delete()
          .from('farm_planted_crops')
          .where('planted_crops_id IN (:...ids)', { ids: idsToRemove })
          .andWhere('farm_id = :farmId', { farmId })
        .execute();
      }
      if(idsToAdd && idsToAdd.length > 0) {
        for(const idToAdd of idsToAdd) {
          await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into('farm_planted_crops')
            .values({ farm_id: farmId, planted_crops_id: idToAdd})
          .execute();
        }
      }
    });  
  }

  async delete(producer: Producer): Promise<void> {
    await this.dataSource.createQueryBuilder()
      .delete()
      .from('producer')
      .where('id = :id', { id: producer.getId() })
    .execute()
  }

  getPlantedCropsByFarmId(farmId: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  async fetchTransfer(id: string): Promise<ProducerType> {
    return this.dataSource.createQueryBuilder()
      .select([
        'p.id',
        'p.document',
        'p.name',
        'f.id "farmId"',
        'f.farm_name "farmName"',
        'f.city',
        'f.state',
        'f.total_area "totalArea"',
        'f.cultivable_area "cultivableArea"',
        'f.vegetation_area "vegetationArea"',
        'json_agg(json_build_object(\'id\', pc.id, \'name\', pc.name)) AS "plantedCrops"'
      ])
      .from('producer', 'p')
      .leftJoin('farm', 'f', 'p.id = f.producer_id')
      .leftJoin('farm_planted_crops', 'fpc', 'f.id = fpc.farm_id')
      .leftJoin('planted_crops', 'pc', 'pc.id = fpc.planted_crops_id')
      .where('p.id = :id', { id })
      .groupBy('f.id, p.id')
      .getRawOne<ProducerType>();
  }
}