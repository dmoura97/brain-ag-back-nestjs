import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/errors/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Brain-ag')
    .setDescription('The brain-ag API description')
    .setVersion('1.0')
    .addTag('brain-ag')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(app.get<AllExceptionsFilter>(AllExceptionsFilter));
  
  await app.listen(3000);
}
bootstrap();
