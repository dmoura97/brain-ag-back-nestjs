import { HttpStatus, Inject } from "@nestjs/common";
import { PlantedCropsService } from "../../plantedCrops/services/planted-crops.service";
import { ProducerRepository } from "../contracts/producer.repository";
import { Farm } from "../entities/farm.entity";
import { Producer } from "../entities/producer.entity";
import { NewProducerDto } from "../ports/dtos/new-producer.dto";
import { Presenter } from "../../shared/contracts/presenter";
import { CreateProducerPresenter } from "../ports/presenters/create-producer.presenter";
import { ErrorsEnum } from "../../shared/errors.enum";
import { CustomException } from "../../shared/errors/custom-error.exception";

export class CreateProducerInteractor {
  constructor(
    @Inject('ProducerRepository')
    private producerRepository: ProducerRepository,
    private plantedCropsService: PlantedCropsService,
    private presenter: CreateProducerPresenter
  ) { }

  async execute(payload: NewProducerDto): Promise<Presenter> {
    const plantedCrops = await this.plantedCropsService.fetchByIds(payload.farm.plantedCrops);
    if(plantedCrops.length !== payload.farm.plantedCrops.length) {
      throw new CustomException(ErrorsEnum.INVALID_CROPS, HttpStatus.BAD_REQUEST, 'INVALID_CROPS')
    }
    const farm = Farm.create(
      payload.farm.farmName,
      payload.farm.city,
      payload.farm.state,
      payload.farm.totalArea,
      payload.farm.cultivableArea,
      payload.farm.vegetationArea,
    );
    farm.checkArea();
    farm.setPlantedCrops(plantedCrops);
    const producer = Producer.create(payload.producer.document,payload.producer.name);
    producer.setFarm(farm);
    const producerId:string = await this.producerRepository.save(producer);
    producer.setId(producerId);
    this.presenter.setData(producer);
    return this.presenter;
  }
}