import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "fs";
import * as path from "path";
import { Pool } from "pg";
import * as bcrypt from "bcrypt";

@Injectable()
export class DatabaseService implements OnModuleInit {
	private readonly pool: InstanceType<typeof Pool>;
	private readonly logger = new Logger(DatabaseService.name);

	constructor(private readonly configService: ConfigService) {
		this.pool = new Pool({
			user: this.configService.get<string>("POSTGRES_USER"),
			password: this.configService.get<string>("POSTGRES_PASSWORD"),
			host: this.configService.get<string>("POSTGRES_HOST"),
			port: this.configService.get<number>("POSTGRES_PORT"),
			database: this.configService.get<string>("POSTGRES_DB"),
		});

		this.logger.log(`Connected to database`);
	}

	async onModuleInit() {
		const dropTableFile = readFileSync(
			path.join("src", "common", "database", "sql", "drop_user_table.sql"),
			"utf-8",
		);
		const createTableFile = readFileSync(
			path.join("src", "common", "database", "sql", "create_user_table.sql"),
			"utf-8",
		);

		await this.pool.query(dropTableFile);
		await this.pool.query(createTableFile);
		this.logger.log(`All table created`);

		// Seed with properly hashed passwords
		await this.seedUsers();

		this.logger.log("Db populated");
	}

	private async seedUsers() {
		const hashedPassword = await bcrypt.hash("pass123", 10);

		// Insert users with properly hashed passwords
		const users = [
			[
				"42_001",
				"alice@example.com",
				"alice42",
				"Alice",
				"Dupont",
				hashedPassword,
				"1995-04-12",
				"female",
				"male",
				"Love adventures and coding",
				"true",
			],
			[
				"42_002",
				"bob@example.com",
				"bob42",
				"Bob",
				"Martin",
				hashedPassword,
				"1992-08-21",
				"male",
				"female",
				"Music is my life",
				"false",
			],
			[
				"42_003",
				"charlie@example.com",
				"charlie42",
				"Charlie",
				"Durand",
				hashedPassword,
				"1990-01-05",
				"male",
				"female",
				"Traveler and foodie",
				"true",
			],
			[
				"42_004",
				"diana@example.com",
				"diana42",
				"Diana",
				"Leroy",
				hashedPassword,
				"1998-07-30",
				"female",
				"male",
				"Fitness enthusiast",
				"false",
			],
		];

		for (const user of users) {
			const insertQuery = this.insertQuery(
				"users",
				[
					"fortytwo_id",
					"email",
					"username",
					"first_name",
					"last_name",
					"password",
					"birthdate",
					"gender",
					"sexual_preferences",
					"biography",
					"is_verified",
				],
				user,
			);

			try {
				await this.execute(insertQuery.query, insertQuery.params);
			} catch (e) {
				if (e.code !== "23505") {
					// Ignore duplicate key errors
					this.logger.error(`Error seeding user: ${e.message}`);
				}
			}
		}
	}

	// ...rest of existing methods...
	async execute(query: string, params: string[]) {
		return this.pool.query(query, params);
	}

	insertQuery(
		table: string,
		columns: string[],
		params: string[],
		returning?: string[],
	): { query: string; params: string[] } {
		let query = "INSERT INTO " + table + " (";
		query += columns.join(", ");
		query += ") VALUES (";
		query += params.map((_, i) => `$${i + 1}`).join(", ");
		query += ")";
		if (returning?.length !== undefined) {
			query += " RETURNING " + returning?.join(", ");
		}

		return { query, params };
	}

	selectQuery(
		table: string,
		wantedColums: string[],
		wheresColums: string[],
		wheresParams: string[],
	): { query: string; params: string[] } {
		let query = `SELECT ${wantedColums.join(", ")} FROM ${table}`;

		const whereClause = wheresColums
			.map((col, i) => `${col} = $${i + 1}`)
			.join(" AND ");

		if (whereClause.length !== 0) {
			query += " WHERE " + whereClause;
		}

		return { query, params: wheresParams };
	}

	updateQuery(
		table: string,
		setColums: string[],
		setColumsValues: string[],
		wheresColums: string[],
		wheresParams: string[],
	): { query: string; params: string[] } {
		const setParamsLength = setColums.length;

		let query = `UPDATE ${table} SET `;
		query += setColums.map((col, i) => `${col} = $${i + 1}`).join(", ");
		const whereClause = wheresColums
			.map((col, i) => `${col} = $${i + setParamsLength + 1}`)
			.join(" AND ");

		if (whereClause.length !== 0) {
			query += " WHERE " + whereClause;
		}

		return { query, params: setColumsValues.concat(wheresParams) };
	}

	deleteQuery(
		table: string,
		wheresColums: string[],
		wheresParams: string[],
	): { query: string; params: string[] } {
		let query = `DELETE FROM ${table}`;

		const whereClause = wheresColums
			.map((col, i) => `${col} = $${i + 1}`)
			.join(" AND ");

		if (whereClause.length !== 0) {
			query += " WHERE " + whereClause;
		}

		return { query, params: wheresParams };
	}
}
