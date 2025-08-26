import { Body, Controller, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeDto } from './dto/like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  //@UseGuards(AuthGuard('jwt'))
  async like(@Body() newLikeDto: LikeDto) {
    return this,this.likeService.newLike(newLikeDto);
  }
}
