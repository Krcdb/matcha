import { Module } from '@nestjs/common';
import { ConnectedController } from './connected.controller';
import { ConnectedService } from './connected.service';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ConnectedController],
  providers: [ConnectedService],
  exports: [ConnectedService],
})
export class ConnectedModule {}
