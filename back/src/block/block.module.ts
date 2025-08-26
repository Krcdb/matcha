import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BlockController],
  providers: [BlockService]
})
export class BlockModule {}
