import { Module } from "@nestjs/common";
import { PlantedCropsModule } from "src/plantedCrops/planterd-crops.module";
import { CreateProducerInteractor } from "./interactors/create-producer.interactor";
import { DeleteProducerInteractor } from "./interactors/delete-producer.interactor";
import { ProducerDatabaseInMemory } from "./repositories/in-memory/producer-database-in-memory";
import { CreateProducerPresenter } from "./ports/presenters/create-producer.presenter";
import { DeleteProducerPresenter } from "./ports/presenters/delete-producer.presenter";
import { UpdateProducerInteractor } from "./interactors/update-producer.interactor";
import { UpdateProducerPresenter } from "./ports/presenters/update-producer.presenter";


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
      useClass: ProducerDatabaseInMemory
    }
  ],
  controllers: []
})
export class ProducerModule {}