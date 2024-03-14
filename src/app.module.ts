import { Module } from '@nestjs/common';
import { PlantedCropsModule } from './plantedCrops/planterd-crops.module';
import { ProducerModule } from './producer/producer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DatabaseConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database')
      }),
      inject: [ConfigService]
    }),
    PlantedCropsModule,
    ProducerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
