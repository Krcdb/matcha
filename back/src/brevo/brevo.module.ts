import { Module } from '@nestjs/common';
import { BrevoService } from './brevo.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BrevoService],
  exports: [BrevoService]
})
export class BrevoModule {}
