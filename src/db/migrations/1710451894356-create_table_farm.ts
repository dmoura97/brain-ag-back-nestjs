import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableFarm1710451894356 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE farm(
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				farm_name VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        total_area NUMERIC NOT NULL,
        cultivable_area NUMERIC NOT NULL,
        vegetation_area NUMERIC NOT NULL,
				producer_id UUID NOT NULL,
				FOREIGN KEY (producer_id) REFERENCES producer(id) ON DELETE CASCADE,
				created_at TIMESTAMP NOT NULL DEFAULT now(), 
        updated_at TIMESTAMP NOT NULL DEFAULT now()
			);
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE farm`);
	}

}
