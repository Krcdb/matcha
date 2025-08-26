import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { ConnectedDto } from './dto/connected.dto';

@Injectable()
export class ConnectedService {
  private readonly logger = new Logger(ConnectedService.name)

  constructor(private readonly databaseService: DatabaseService) {}

  async connected(connectedDto: ConnectedDto) {
    const {userId, connected} = connectedDto;

    const insertQuery1 = this.databaseService.insertQuery(
      "connected",
      ["user_id", "connected"],
      [userId, connected],
    );
    const insertQuery2 = this.databaseService.insertQuery(
      "connected",
      ["user_id", "connected"],
      [connected, userId],
    )

    try {
      const result1 = await this.databaseService.execute(insertQuery1.query, insertQuery1.params);
      const result2 = await this.databaseService.execute(insertQuery2.query, insertQuery2.params);

      if (result1.rowCount && result2.rowCount) {
        this.logger.log(`Connection successfully created for user ${userId} and ${connected}`);
      }
    } catch(e) {
      this.logger.error(`Error during connection creation : ${e.message}`);
            
      throw new InternalServerErrorException("An unexpected error occurred");
    }
  }
}
