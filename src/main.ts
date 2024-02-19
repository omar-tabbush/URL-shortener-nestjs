import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { PrismaExceptionFilterFilter } from './filters/prisma-exception-filter/prisma-exception-filter.filter';

const cors = async (): Promise<CorsOptions> => {
  const options: CorsOptions = {
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };
  return options;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(await cors());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  //prisma filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilterFilter(httpAdapter));

  await app.listen(3001);
}
bootstrap();
