import { TestingModule, Test } from "@nestjs/testing";
import { PlantedCropsDatabaseInMemory } from "../../plantedCrops/repositories/in-memory/planted-crops-database-in-memory";
import { PlantedCropsService } from "../../plantedCrops/services/planted-crops.service";
import { NewProducerDto } from "../ports/dtos/new-producer.dto";
import { CreateProducerPresenter } from "../ports/presenters/create-producer.presenter";
import { ProducerDatabaseInMemory } from "../repositories/in-memory/producer-database-in-memory";
import { CreateProducerInteractor } from "./create-producer.interactor";
import { DeleteProducerInteractor } from "./delete-producer.interactor";
import { Producer } from "../entities/producer.entity";
import { DeleteProducerPresenter } from "../ports/presenters/delete-producer.presenter";

describe('update-producer.interactor', () => {
  let createInteractor: CreateProducerInteractor;
  let deleteInteractor: DeleteProducerInteractor;
  let module: TestingModule;
  let producerId: string; 

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CreateProducerInteractor,
        DeleteProducerInteractor,
        {
          provide: 'ProducerRepository',
          useClass: ProducerDatabaseInMemory
        },
        PlantedCropsService,
        {
          provide: 'PlantedCropsRepository',
          useClass: PlantedCropsDatabaseInMemory
        },
        CreateProducerPresenter,
        DeleteProducerPresenter
      ],
    }).compile();
    createInteractor = module.get<CreateProducerInteractor>(CreateProducerInteractor);
    deleteInteractor = module.get<DeleteProducerInteractor>(DeleteProducerInteractor);
    jest.clearAllMocks();
    const dto = new NewProducerDto();
    dto.producer = {
      document: '123.456.789-09',
      name: 'John Doe'
    }
    dto.farm =  {
      farmName: 'Happy Farm',
      city: 'City A',
      state: 'State X',
      totalArea: 1000,
      cultivableArea: 800,
      vegetationArea: 200,
      plantedCrops: [1,2],
    }
    const createResult = await createInteractor.execute(dto);
    producerId = createResult.httpResponse().producerId;
  });

  it('should be possible delete a producer', async () => {
    const producerRepository: ProducerDatabaseInMemory = 
      module.get<ProducerDatabaseInMemory>('ProducerRepository');
    const producer: Producer = await producerRepository.getById(producerId);
    const farmId = producer.getFarm().getId()
    await deleteInteractor.execute(producerId);
    const checkProducer: Producer = await producerRepository.getById(producerId);
    const plantedCrops = await producerRepository.getPlantedCropsByFarmId(farmId);
    expect(checkProducer).toBeNull();
    expect(plantedCrops.length).toBe(0)
  })
});
