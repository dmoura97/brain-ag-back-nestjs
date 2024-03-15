import {DatabaseConnection} from "../contracts/DatabaseConnection";
import pgp from "pg-promise";

export class PgPromiseAdapter implements DatabaseConnection {
	connection: any;

	constructor () {	
		this.connection = pgp()(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`);
	}
	
	query(statement: string, params: any): Promise<any> {
		return this.connection.query(statement, params);
	}
	
	async close(): Promise<void> {
		await this.connection.$pool.end();
	}

}
