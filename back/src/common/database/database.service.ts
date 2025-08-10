import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as path from 'path'
import { Pool } from 'pg'

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly pool: InstanceType<typeof Pool>;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({ 
      user: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: this.configService.get<number>('POSTGRES_PORT'),
      database: this.configService.get<string>('POSTGRES_DB'),
    });

    this.logger.log(`Connected to database`);
  }

  async onModuleInit() {
    const dropTableFile = readFileSync(path.join('src', 'common', 'database', 'sql', 'drop_user_table.sql'), 'utf-8');
    const createTableFile = readFileSync(path.join('src', 'common', 'database', 'sql', 'create_user_table.sql'), 'utf-8');
  
    await this.pool.query(dropTableFile);
    await this.pool.query(createTableFile);
    this.logger.log(`All table created`);

    const insert = this.insertQuery(
      "users",
      ["email", "username", "first_name", "last_name", "password", "date_of_birth", "gender", "sexual_preferences", "biography"],
      ["jd@gmail.com", "jd", "John", "Doe", "123456789", "1992-10-18", "male", "female", "bio"]
    );

    // this.logger.debug(insert)
    
    // this.execute(insert.query, insert.params);

    // let select = this.selectQuery(
    //   "users",
    //   ["id", "email"],
    //   ["gender", "username"],
    //   ["male", "jd"],
    // );

    // this.logger.debug(select);

    // let res = await this.execute(select.query, select.params);

    // this.logger.debug(res.rows);

    // const update = this.updateQuery(
    //   "users",
    //   ["username", "email"],
    //   ["bob", "plop@plop.com"],
    //   ["username"],
    //   ["jd"]
    // );
    // this.logger.debug(update);

    // res = await this.execute(update.query, update.params);

    // this.logger.debug(res.rowCount);

    // select = this.selectQuery(
    //   "users",
    //   ["*"],
    //   [],
    //   [],
    // );
    // res = await this.execute(select.query, select.params);

    // this.logger.debug(res.rows);

    // let deleteQ = this.deleteQuery(
    //   "users",
    //   ["username", "first_name"],
    //   ["bob", "John"]
    // );

    // this.logger.debug(deleteQ);

    // res = await this.execute(deleteQ.query, deleteQ.params);

    // this.logger.debug(res.rows);

    // res = await this.execute(select.query, select.params);

    // this.logger.debug(res.rows);

    this.logger.log("Db populated");
  }

  async execute(query: string, params: string []) {
    return this.pool.query(query, params);
  }

  insertQuery(table: string, columns: string[], params: string[]): { query : string, params: string[]} {
    let query = "INSERT INTO " + table + " (";
    query += columns.join(", ");
    query += ") VALUES (";
    query += params.map((_, i) => `$${i + 1}`).join(", ");
    query += ")";
    
    return { query, params };
  }

  selectQuery(table: string, wantedColums: string[], wheresColums: string[], wheresParams: string[]): { query: string, params: string[] } {
    let query = `SELECT ${wantedColums.join(", ")} FROM ${table}`;

    const whereClause = wheresColums.map((col, i) => `${col} = $${i + 1}`).join(' AND ');

    if (whereClause.length !== 0) {
      query += ' WHERE ' + whereClause;
    }

    return { query, params: wheresParams }
  }

  updateQuery(table: string, setColums: string[], setColumsValues: string[], wheresColums: string[], wheresParams: string[]): { query: string, params: string[] } {
    const setParamsLength = setColums.length;
    
    let query = `UPDATE ${table} SET `;
    query += setColums.map((col, i) => `${col} = $${i + 1}`).join(', ');
    const whereClause = wheresColums.map((col, i) => `${col} = $${i + setParamsLength + 1}`).join(' AND ');

    if (whereClause.length !== 0) {
      query += ' WHERE ' + whereClause;
    }

    return { query, params: setColumsValues.concat(wheresParams) }
  }

  deleteQuery(table: string, wheresColums: string[], wheresParams: string[]): { query: string, params: string[] } {
    let query = `DELETE FROM ${table}`;

    const whereClause = wheresColums.map((col, i) => `${col} = $${i + 1}`).join(' AND ');

    if (whereClause.length !== 0) {
      query += ' WHERE ' + whereClause;
    }

    return { query, params: wheresParams }
  }
};

