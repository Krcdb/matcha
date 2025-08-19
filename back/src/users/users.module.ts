import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { BrevoModule } from 'src/brevo/brevo.module';

@Module({
  imports: [DatabaseModule, BrevoModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {} 