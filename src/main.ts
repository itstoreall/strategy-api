import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  app.setGlobalPrefix('api', { exclude: ['/', '/api'] });
  await app.listen(4466);
}
bootstrap();
