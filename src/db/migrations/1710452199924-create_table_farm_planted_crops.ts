import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableFarmPlantedCrops1710452199924 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE farm_planted_crops(
				id SERIAL PRIMARY KEY,
				farm_id UUID NOT NULL,
				planted_crops_id INT NOT NULL,
				FOREIGN KEY (farm_id) REFERENCES farm(id) ON DELETE CASCADE,
				FOREIGN KEY (planted_crops_id) REFERENCES planted_crops(id) ON DELETE CASCADE
			)
		`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE farm_planted_crops`);
	}

}
