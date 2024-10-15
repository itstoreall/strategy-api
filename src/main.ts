import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));

  app.enableCors();
  app.setGlobalPrefix('api', { exclude: ['/', '/api'] });
  await app.listen(4466);
}
bootstrap();
