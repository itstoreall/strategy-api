import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ExceptionsFilter } from './exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3001;

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));

  app.enableCors({
    origin: [
      process.env.STRATEGY_CLIENT_BASE_URL,
      process.env.STRATEGY_CLIENT_LOCAL_URL,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api', { exclude: ['/', '/api'] });

  await app.listen(port);
}
bootstrap();
