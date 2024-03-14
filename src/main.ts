import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSourceTypeorm } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  DataSourceTypeorm.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })
}
bootstrap();
