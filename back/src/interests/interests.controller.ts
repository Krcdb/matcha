import { Body, Controller, Post } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { UpdateInterestsDto } from './dto/update-interest.dto';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  async updateInterests(@Body() updateInterestsDto: UpdateInterestsDto) {
    return this.interestsService.updateInterests(updateInterestsDto);
  }
}
