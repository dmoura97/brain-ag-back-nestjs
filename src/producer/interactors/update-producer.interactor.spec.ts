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
import { UpdateProducerDto } from "../ports/dtos/update-producer.dto";
import { ErrorsEnum } from "../../shared/errors.enum";

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
    const dto = new UpdateProducerDto();
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
  describe('should return error when', () => {
    it('producer invalid document', async () => {
      const dto = new UpdateProducerDto();
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
      try {
        await updateInteractor.execute(producerId, dto)
      } catch (error) {
        expect(error.message).toBe(ErrorsEnum.INVALID_DOCUMENT)
        expect(error.httpStatus).toBe(400)
        expect(error.errorType).toBe('INVALID_DOCUMENT')
      }
    });

    it('producer id not exists', async () => {
      const dto = new UpdateProducerDto();
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
      try {
        await updateInteractor.execute('producerId', dto)
      } catch (error) {
        expect(error.message).toBe(ErrorsEnum.PRODUCER_NOT_FOUND)
        expect(error.httpStatus).toBe(404)
        expect(error.errorType).toBe('PRODUCER_NOT_FOUND')
      }
    });
  
    it('sum of cultivable area and vegetation area exceed the total area', async () => {
      const dto = new UpdateProducerDto();
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
      try {
        await updateInteractor.execute(producerId, dto)
      } catch (error) {
        expect(error.message).toBe(ErrorsEnum.INVALID_AREA)
        expect(error.httpStatus).toBe(400)
        expect(error.errorType).toBe('INVALID_AREA')
      }
    });
  
    it('planted crops invalid', async () => {
      const dto = new UpdateProducerDto();
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
      try {
        await updateInteractor.execute(producerId, dto)
      } catch (error) {
        expect(error.message).toBe(ErrorsEnum.INVALID_CROPS)
        expect(error.httpStatus).toBe(400)
        expect(error.errorType).toBe('INVALID_CROPS')
      }
    });
  })
});
