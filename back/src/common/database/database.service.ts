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

    this.logger.debug(insert)
    
    this.execute(insert.query, insert.params);
    this.logger.log("Db populated");
  }

  async execute(query: string, params: string []) {
    await this.pool.query(query, params);
  }

  insertQuery(table: string, columns: string[], params: string[]): { query : string, params: string[]} {
    this.logger.log(columns)
    let query = "INSERT INTO " + table + " (";
    query += columns.join(", ");
    query += ") VALUES (";
    query += params.map((_, i) => `$${i + 1}`).join(", ");
    query += ")"
    return {query, params}
  }

};

