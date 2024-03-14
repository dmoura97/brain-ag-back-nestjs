import { Inject } from "@nestjs/common";
import { PlantedCropsService } from "../../plantedCrops/services/planted-crops.service";
import { ProducerRepository } from "../contracts/producer.repository";
import { Producer } from "../entities/producer.entity";
import { Farm } from "../entities/farm.entity";
import { PlantedCrops } from "../../plantedCrops/entities/planted-crops.entity";
import { UpdateProducerPresenter } from "../ports/presenters/update-producer.presenter";
import { Presenter } from "src/shared/contracts/presenter";

export class UpdateProducerInteractor {
  constructor(
    @Inject('ProducerRepository')
    private producerRepository: ProducerRepository,
    private plantedCropsService: PlantedCropsService,
    private presenter: UpdateProducerPresenter
  ) {}

  async execute(id: string, payload: any): Promise<Presenter> {
    const producer: Producer = await this.producerRepository.getById(id);
    if(!producer) throw new Error('Producer not found');
    const plantedCrops: PlantedCrops[] = await this.plantedCropsService.fetchByIds(payload.farm.plantedCrops);
    if (plantedCrops.length !== payload.farm.plantedCrops.length) {
      throw new Error('Invalid planted crops');
    }
    const updatedFarm = Farm.create(
      payload.farm.farmName,
      payload.farm.city,
      payload.farm.state,
      payload.farm.totalArea,
      payload.farm.cultivableArea,
      payload.farm.vegetationArea,
    );
    updatedFarm.checkArea();
    updatedFarm.setPlantedCrops(plantedCrops);
    updatedFarm.setId(producer.getFarm().getId());
    const updatedProducer = Producer.create(payload.producer.document,payload.producer.name);
    updatedProducer.setFarm(updatedFarm);
    const { idsToRemove, idsToAdd } = this.syncPlantedCrops(payload.farm.plantedCrops, producer.getFarm().getPlantedCrops());
    await this.producerRepository.update(id, updatedProducer, idsToRemove, idsToAdd);
    this.presenter.setData(updatedProducer);
    return this.presenter;
  }

  private syncPlantedCrops(newPlantedCrops: number[], oldPlantedCrops: PlantedCrops[]): { idsToRemove: number[], idsToAdd: number[] } {
    const originalPlantedCropsIds = oldPlantedCrops.map(crop => crop.getId());
    const idsToRemove = originalPlantedCropsIds.filter(id => !newPlantedCrops.includes(id));
    const idsToAdd = newPlantedCrops.filter(id => !originalPlantedCropsIds.includes(id));
    return { idsToRemove, idsToAdd };
  }

}