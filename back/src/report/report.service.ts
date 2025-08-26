import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { ApiResponse } from 'src/common/interface/api-response.interface';
import { ReportResponse } from './interface/report-response.interface';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async report(reportDto: ReportDto): Promise<ApiResponse<ReportResponse>> {
    const {reporter, reported} = reportDto;
        
    const insertQuery = this.databaseService.insertQuery(
      "reported",
      ["reporter", "reported"],
      [reporter.toString(), reported.toString()]
    )

    try {
      await this.databaseService.execute(insertQuery.query, insertQuery.params);

      this.logger.log(`Report relation created for reporter ${reporter} to ${reported}`);

      return {
        statusCode: 201,
        message: `Report relation created for reporter ${reporter} to ${reported}`,
        data: {
          reporter,
          reported,
        }
      }
    } catch (e: any) {
      this.logger.error(`Error during report creation : ${e.message}`);
      
      if (e.code === "23505") {
        throw new ConflictException("Report relation already exist");
      }
      
      throw new InternalServerErrorException("An unexpected error occurred");
    }
  }
}
