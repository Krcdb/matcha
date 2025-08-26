import { Body, Controller, Post } from '@nestjs/common';
import { BlockDto } from './dto/block.dto';
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {

  constructor(private readonly blockService: BlockService) {}

  @Post()
  async block(@Body() blockDto: BlockDto) {
    return this.blockService.block(blockDto);
  }
}
