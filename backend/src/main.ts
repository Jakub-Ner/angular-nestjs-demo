import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Engager Recruitment API')
    .setDescription('API for Engager Recruitment backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  setupSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(port);
}
void bootstrap();
