import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class InterestsService {
  private readonly logger = new Logger(InterestsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

}
