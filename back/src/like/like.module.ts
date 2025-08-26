import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { ConnectedModule } from 'src/connected/connected.module';

@Module({
  imports: [DatabaseModule, ConnectedModule],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
