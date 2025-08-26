import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './common/auth/auth.module';
import { BrevoModule } from './brevo/brevo.module';
import { LikeModule } from './like/like.module';
import { ConnectedModule } from './connected/connected.module';
import { ViewModule } from './view/view.module';
import { ReportModule } from './report/report.module';
import { BlockModule } from './block/block.module';
import { InterestsModule } from './interests/interests.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    UsersModule,
    AuthModule,
    BrevoModule,
    LikeModule,
    ConnectedModule,
    ViewModule,
    BlockModule,
    ReportModule,
    InterestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
