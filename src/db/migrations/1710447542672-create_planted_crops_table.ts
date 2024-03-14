import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlantedCropsTable1710447542672 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE planted_crops (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL
			);

			INSERT INTO planted_crops (name) VALUES ('soybeans'),('corn'),('cotton'),('coffee'),('sugarcane')	
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE planted_crops`);
  }

}
