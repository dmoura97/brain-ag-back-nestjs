import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableProducer1710451442587 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE producer (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				name VARCHAR(255) NOT NULL,
				document VARCHAR(255) NOT NULL,
				created_at TIMESTAMP NOT NULL DEFAULT now(), 
        updated_at TIMESTAMP NOT NULL DEFAULT now()
			);`
		)

	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP TABLE producer;
    `);
	}

}
