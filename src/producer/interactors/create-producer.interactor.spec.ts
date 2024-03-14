import { Test, TestingModule } from "@nestjs/testing"
import { CreateProducerInteractor } from "./create-producer.interactor"
import { ProducerDatabaseInMemory } from "../repositories/in-memory/producer-database-in-memory";
import { PlantedCropsService } from "../../plantedCrops/services/planted-crops.service";
import { PlantedCropsDatabaseInMemory } from "../../plantedCrops/repositories/in-memory/planted-crops-database-in-memory";
import { NewProducerDto } from "../ports/dtos/new-producer.dto";
import { CreateProducerPresenter } from "../ports/presenters/create-producer.presenter";


describe('create-producer.interactor', () => {
  let interactor: CreateProducerInteractor;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
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
        CreateProducerPresenter
      ],
    }).compile()
    interactor = module.get<CreateProducerInteractor>(CreateProducerInteractor);
    jest.clearAllMocks();
  });

  it('should be create a new producer', async () => {
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
    const result = await interactor.execute(dto);
    expect(result.httpResponse().producerId).toBeDefined();
  });

  it('should not be possible to create a producer with an invalid document', async () => {
    const dto = new NewProducerDto();
    dto.producer = {
      document: 'invalid-document',
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
    await expect(() => interactor.execute(dto)).rejects.toThrow(new Error('Invalid document'));
  });

  it('should not be possible to create a producer when sum of cultivable area and vegetation area exceed the total area', async () => {
    const dto = new NewProducerDto();
    dto.producer = {
      document: 'invalid-document',
      name: 'John Doe'
    }
    dto.farm =  {
      farmName: 'Happy Farm',
      city: 'City A',
      state: 'State X',
      totalArea: 1000,
      cultivableArea: 800,
      vegetationArea: 400,
      plantedCrops: [1,2],
    }
    await expect(() => interactor.execute(dto)).rejects.toThrow(new Error('The sum of cultivable area and vegetation area cannot exceed the total area of the farm'));
  });

  it('should not be possible to create a producer with planted crops invalid', async () => {
    const dto = new NewProducerDto();
    dto.producer = {
      document: 'invalid-document',
      name: 'John Doe'
    }
    dto.farm =  {
      farmName: 'Happy Farm',
      city: 'City A',
      state: 'State X',
      totalArea: 1000,
      cultivableArea: 800,
      vegetationArea: 200,
      plantedCrops: [1,2,8],
    }
    await expect(() => interactor.execute(dto)).rejects.toThrow(new Error('Invalid planted crops'));
  });

});