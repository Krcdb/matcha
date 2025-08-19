import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './common/auth/auth.module';
import { BrevoModule } from './brevo/brevo.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    UsersModule,
    AuthModule,
    BrevoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
