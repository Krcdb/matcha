import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConsoleLogger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: new ConsoleLogger({
			timestamp: true,
		}),
	});

	app.setGlobalPrefix("api");
	app.enableCors({ origin: true, credentials: true });

	// ✅ Add global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	console.log(`listening on port ${process.env.BACK_PORT}`);
	await app.listen(process.env.BACK_PORT ?? 3001);
}
bootstrap();
