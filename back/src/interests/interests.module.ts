import { Module } from '@nestjs/common';
import { InterestsController } from './interests.controller';
import { InterestsService } from './interests.service';
import { DatabaseService } from 'src/common/database/database.service';

@Module({
  imports: [DatabaseService],
  controllers: [InterestsController],
  providers: [InterestsService]
})
export class InterestsModule {}
