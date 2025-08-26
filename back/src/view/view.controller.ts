import { Body, Controller, Post } from '@nestjs/common';
import { ViewDto } from './dto/view.dto';
import { ViewService } from './view.service';

@Controller('view')
export class ViewController {

  constructor(private readonly viewService: ViewService) {}

  @Post()
  async view(@Body() viewDto: ViewDto) {
    return this.viewService.view(viewDto);
  }
}
