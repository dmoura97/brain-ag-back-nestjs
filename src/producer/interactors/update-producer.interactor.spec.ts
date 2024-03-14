import { Test, TestingModule } from "@nestjs/testing";
import { PlantedCropsDatabaseInMemory } from "../../plantedCrops/repositories/in-memory/planted-crops-database-in-memory";
import { PlantedCropsService } from "../../plantedCrops/services/planted-crops.service";
import { NewProducerDto } from "../ports/dtos/new-producer.dto";
import { CreateProducerPresenter } from "../ports/presenters/create-producer.presenter";
import { CreateProducerInteractor } from "./create-producer.interactor";
import { UpdateProducerInteractor } from "./update-producer.interactor";
import { ProducerDatabaseInMemory } from "../repositories/in-memory/producer-database-in-memory";
import { Producer } from "../entities/producer.entity";
import { UpdateProducerPresenter } from "../ports/presenters/update-producer.presenter";

describe('update-producer.interactor', () => {
  let createInteractor: CreateProducerInteractor;
  let updateInteractor: UpdateProducerInteractor;
  let module: TestingModule;
  let producerId: string; 

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UpdateProducerInteractor,
        CreateProducerInteractor,
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
        UpdateProducerPresenter
      ],
    }).compile();
    createInteractor = module.get<CreateProducerInteractor>(CreateProducerInteractor);
    updateInteractor = module.get<UpdateProducerInteractor>(UpdateProducerInteractor);
    jest.clearAllMocks();
    const createDto = new NewProducerDto();
    createDto.producer = {
      document: '123.456.789-09',
      name: 'John Doe'
    }
    createDto.farm =  {
      farmName: 'Happy Farm',
      city: 'City A',
      state: 'State X',
      totalArea: 1000,
      cultivableArea: 800,
      vegetationArea: 200,
      plantedCrops: [1,2],
    }
    const result = await createInteractor.execute(createDto);
    producerId = result.httpResponse().producerId
  });

  it('should update a producer', async () => {
    const dto = new NewProducerDto();
    dto.producer = {
      document: '101.405.814-72',
      name: 'John Doe Updated'
    }
    dto.farm =  {
      farmName: 'Happy Farm Updated',
      city: 'City B',
      state: 'State Y',
      totalArea: 1200,
      cultivableArea: 100,
      vegetationArea: 200,
      plantedCrops: [3,4,5],
    }
    await updateInteractor.execute(producerId, dto);
    const producerRepository: ProducerDatabaseInMemory = 
      module.get<ProducerDatabaseInMemory>('ProducerRepository');
    const producer: Producer = await producerRepository.getById(producerId);
    expect(producer).toBeDefined();
    expect(producer.getName()).toBe('John Doe Updated');
    expect(producer.getFarm().getFarmName()).toBe('Happy Farm Updated');
    expect(producer.getFarm().getCity()).toBe('City B');
    expect(producer.getFarm().getState()).toBe('State Y');
  });

  it('should not be possible to update a producer with an invalid document', async () => {
    const dto = new NewProducerDto();
    dto.producer = {
      document: 'invalid-document',
      name: 'John Doe Updated'
    }
    dto.farm =  {
      farmName: 'Happy Farm Updated',
      city: 'City B',
      state: 'State Y',
      totalArea: 1200,
      cultivableArea: 100,
      vegetationArea: 200,
      plantedCrops: [3,4,5],
    }
    await expect(() => updateInteractor.execute(producerId, dto)).rejects.toThrow(new Error('Invalid document'));
  });

  it('should not be possible to update a producer when sum of cultivable area and vegetation area exceed the total area', async () => {
    const dto = new NewProducerDto();
    dto.producer = {
      document: '101.405.814-72',
      name: 'John Doe Updated'
    }
    dto.farm =  {
      farmName: 'Happy Farm Updated',
      city: 'City B',
      state: 'State Y',
      totalArea: 1200,
      cultivableArea: 1000,
      vegetationArea: 400,
      plantedCrops: [3,4,5],
    }
    await expect(() => updateInteractor.execute(producerId, dto)).rejects.toThrow(new Error('The sum of cultivable area and vegetation area cannot exceed the total area of the farm'));
  });

  it('should not be possible to update a producer with planted crops invalid', async () => {
    const dto = new NewProducerDto();
    dto.producer = {
      document: '101.405.814-72',
      name: 'John Doe Updated'
    }
    dto.farm =  {
      farmName: 'Happy Farm Updated',
      city: 'City B',
      state: 'State Y',
      totalArea: 1200,
      cultivableArea: 1000,
      vegetationArea: 100,
      plantedCrops: [3,4,5,8,9],
    }
    await expect(() => updateInteractor.execute(producerId, dto)).rejects.toThrow(new Error('Invalid planted crops'));
  });
});
