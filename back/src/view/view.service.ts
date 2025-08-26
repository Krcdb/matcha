import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { ViewDto } from './dto/view.dto';
import { ApiResponse } from 'src/common/interface/api-response.interface';
import { ViewResponse } from './interface/view-response.interface';

@Injectable()
export class ViewService {
  private readonly logger = new Logger(ViewService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async view(viewDto: ViewDto): Promise<ApiResponse<ViewResponse>> {
    const {viewer, viewed} = viewDto;

    const insertQuery = this.databaseService.insertQuery(
      "viewed",
      ["viewer", "viewed"],
      [viewer, viewed]
    )

    try {
      await this.databaseService.execute(insertQuery.query, insertQuery.params);

      this.logger.log(`View relation created for viewer ${viewer} to ${viewed}`);

      return {
        statusCode: 201,
        message: `View relation created for viewer ${viewer} to ${viewed}`,
        data: {
          viewer,
          viewed,
        }
      }
    } catch (e: any) {
      this.logger.error(`Error during user creation : ${e.message}`);
      
      if (e.code === "23505") {
        throw new ConflictException("View relation already exist");
      }
      
      throw new InternalServerErrorException("An unexpected error occurred");
    }
  }
}
