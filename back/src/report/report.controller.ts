import { Body, Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportDto } from './dto/report.dto';

@Controller('report')
export class ReportController {

  constructor(private readonly reportService: ReportService) {}

  @Post()
  async report(@Body() reportDto: ReportDto) {
    return this.reportService.report(reportDto);
  }
}
