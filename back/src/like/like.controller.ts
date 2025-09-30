import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeDto } from './dto/like.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async like(@Body() newLikeDto: LikeDto) {
    return this.likeService.newLike(newLikeDto); // ✅ Fixed: was "this.this.likeService"
  }

  @Post('unlike')
  @UseGuards(AuthGuard('jwt'))
  async unlike(@Body() unlikeDto: LikeDto) {
    return this.likeService.unlike(unlikeDto);
  }
}