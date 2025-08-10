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


  }
};

