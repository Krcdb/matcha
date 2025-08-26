import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { BlockDto } from './dto/block.dto';
import { ApiResponse } from 'src/common/interface/api-response.interface';
import { BlockResponse } from './interface/block-reponse.interface';

@Injectable()
export class BlockService {
  private readonly logger = new Logger(BlockService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async block(blockDto: BlockDto): Promise<ApiResponse<BlockResponse>> {
    const {blocker, blocked} = blockDto;
    
    const insertQuery = this.databaseService.insertQuery(
      "blocked",
      ["blocker", "blocked"],
      [blocker, blocked]
    )

    try {
      await this.databaseService.execute(insertQuery.query, insertQuery.params);

      this.logger.log(`block relation created for blocker ${blocker} to ${blocked}`);

      return {
        statusCode: 201,
        message: `block relation created for blocker ${blocker} to ${blocked}`,
        data: {
          blocker,
          blocked,
        }
      }
    } catch (e: any) {
      this.logger.error(`Error during block creation : ${e.message}`);
      
      if (e.code === "23505") {
        throw new ConflictException("Block relation already exist");
      }
      
      throw new InternalServerErrorException("An unexpected error occurred");
    }
  }
}
