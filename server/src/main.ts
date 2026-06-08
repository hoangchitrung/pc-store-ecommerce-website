import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config general prefix or API
  app.setGlobalPrefix('api');

  // Enable version for API Versioning for whole system
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Config swagger api
  const config = new DocumentBuilder()
    .setTitle('PC STORE API')
    .setDescription('API Documents for PC STORE PROJECT')
    .setVersion('1.0')
    .addTag('Products')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
