import { Inject } from "@nestjs/common";
import { ProducerRepository } from "../../../producer/contracts/producer.repository";
import { Producer } from "../../../producer/entities/producer.entity";
import { ProducerDatabaseFormatMapper } from "../mappers/producer.database-format.mapper";
import { Mapper } from "../../../shared/contracts/mapper";
import { DatabaseConnection } from "../../../shared/contracts/DatabaseConnection";
import { ProducerFactory } from "src/producer/factories/producer.factor";

export class DatabasePostgresRepository implements ProducerRepository {
  private readonly mapper: Mapper;

  constructor(
    @Inject('DatabaseConnection')
    readonly connection: DatabaseConnection) {
    this.mapper = new ProducerDatabaseFormatMapper();
  }

  async save(producer: Producer): Promise<string> {
    try {
      const { producerData, farm, plantedCrops } = this.mapper.toDatabaseSchema(producer);
      await this.connection.query('BEGIN', []);
      const [producerId] = await this.connection.query(
        "INSERT INTO producer (document, name) VALUES ($1, $2) RETURNING id",
        [producerData.document, producerData.name]
      );
      const [farmId] = await this.connection.query(
        "INSERT INTO farm (farm_name, city, state, total_area, cultivable_area, vegetation_area, producer_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [farm.farm_name, farm.city, farm.state, farm.total_area, farm.cultivable_area, farm.vegetation_area, producerId.id]
      )
      for (const plantedCrop of plantedCrops) {
        await this.connection.query(
          "INSERT INTO farm_planted_crops (farm_id, planted_crops_id) Values ($1, $2)",
          [farmId.id, plantedCrop.id]
        )
      }
      await this.connection.query('COMMIT', [])
      return producerId;
    } catch (error) {
      await this.connection.query('ROLLBACK', [])
      throw error;
    }
  }

  async getById(id: string): Promise<Producer> {
    const [queryResult] = await this.connection.query(
      `SELECT
        p.id,
        p.document,
        p.name,
        f.id "farmId",
        f.farm_name "farmName",
        f.city,
        f.state,
        f.total_area "totalArea",
        f.cultivable_area "cultivableArea",
        f.vegetation_area "vegetationArea",
        json_agg(json_build_object('id', pc.id, 'name', pc.name)) AS "plantedCrops"
      from
        producer p
      left join
        farm f
      on
        p.id = f.producer_id
      left join
        farm_planted_crops fpc
      on
        f.id = fpc.farm_id
      left join
        planted_crops pc
      on 
        fpc.planted_crops_id = pc.id
      where 
        p.id = $1
      group by f.id, p.id;
      `,
      [id]
    );
    if(!queryResult) return null;
    return (new ProducerFactory()).make(queryResult)
  }

  async update(id: string, producer: Producer, idsToRemove: number[], idsToAdd: number[]): Promise<void> {
    const farmId = producer.getFarm().getId();
    const { producerData, farm, plantedCrops } = this.mapper.toDatabaseSchema(producer);
    try {
      await this.connection.query('BEGIN', []);
      await this.connection.query(
        "UPDATE producer SET document = $1, name = $2 WHERE id = $3",
        [producerData.document, producerData.name, id]
      );
      await this.connection.query(
        ` UPDATE 
            farm
          SET 
            farm_name = $1,
            city = $2,
            state = $3,
            total_area = $4,
            cultivable_area = $5,
            vegetation_area = $6
          WHERE id = $7;
        `,
        [farm.farm_name, farm.city, farm.state, farm.total_area, farm.cultivable_area, farm.vegetation_area, farmId]
      );
      if(idsToRemove && idsToRemove.length > 0) {
        await this.connection.query(
          `
            DELETE 
            FROM 
              farm_planted_crops
            WHERE 
              planted_crops_id = ANY($1) 
            AND 
              farm_id = $2;  
          `,
          [idsToRemove, farmId]
        )
      }
      if(idsToAdd && idsToAdd.length > 0) {
        for(const idToAdd of idsToAdd) {
          await this.connection.query(
            "INSERT INTO farm_planted_crops (farm_id, planted_crops_id) VALUES ($1, $2)",
            [farmId, idToAdd]
          );
        }
      }
      await this.connection.query('COMMIT', [])
    } catch (error) {
      await this.connection.query('ROLLBACK', [])
      throw error;
    }
  }

  async delete(producer: Producer): Promise<void> {
    await this.connection.query(
      `DELETE FROM producer WHERE id = $1`, [producer.getId()]
    )
  }

  async getPlantedCropsByFarmId(farmId: string): Promise<any[]> {
    return this.connection.query(
      'SELECT * from farm_planed_crops where farm_id = $1', [farmId]
    );
  }

}