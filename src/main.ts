import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

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

  await app.listen(+process.env.PORT || 3001);
}
bootstrap();
