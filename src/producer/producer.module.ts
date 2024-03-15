import { Module } from "@nestjs/common";
import { PlantedCropsModule } from "src/plantedCrops/planterd-crops.module";
import { CreateProducerInteractor } from "./interactors/create-producer.interactor";
import { DeleteProducerInteractor } from "./interactors/delete-producer.interactor";
import { ProducerDatabaseInMemory } from "./repositories/in-memory/producer-database-in-memory";
import { CreateProducerPresenter } from "./ports/presenters/create-producer.presenter";
import { DeleteProducerPresenter } from "./ports/presenters/delete-producer.presenter";
import { UpdateProducerInteractor } from "./interactors/update-producer.interactor";
import { UpdateProducerPresenter } from "./ports/presenters/update-producer.presenter";
import { DataSourceTypeorm } from "src/config";
import { ProducerController } from "./ports/controllers/producer.controller";
import { DatabaseTypeOrmRepository } from "./repositories/typeorm/database-typeorm.repository";
import { DatabasePostgresRepository } from "./repositories/postgres/database-postgres.repository";
import {PgPromiseAdapter} from "src/shared/adapters/pq-promise.adapter";
import {  DatabaseConnection } from '../shared/contracts/DatabaseConnection'


@Module({
  imports: [
    PlantedCropsModule,
  ],
  providers: [
    CreateProducerInteractor,
    CreateProducerPresenter,
    DeleteProducerInteractor,
    DeleteProducerPresenter,
    UpdateProducerInteractor,
    UpdateProducerPresenter,
    {
      provide: 'ProducerRepository',
      //useClass: ProducerDatabaseInMemory
      useClass: DatabaseTypeOrmRepository
      //useClass: DatabasePostgresRepository
    },
    {
      provide: 'DataSource',
      useValue: DataSourceTypeorm
    },
    {
      provide: 'DatabaseConnection',
      useClass: PgPromiseAdapter
    }
  ],
  controllers: [ProducerController]
})
export class ProducerModule {}