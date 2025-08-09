import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      timestamp: true,
    })
  });

  app.setGlobalPrefix("api");
  app.enableCors({origin: true, credentials: true})

  console.log(`listning on port ${process.env.BACK_PORT}`);
  await app.listen(process.env.BACK_PORT ?? 3001);
}
bootstrap();
