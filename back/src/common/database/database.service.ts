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

