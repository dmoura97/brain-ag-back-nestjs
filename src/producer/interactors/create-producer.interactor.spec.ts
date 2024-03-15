import { Test, TestingModule } from "@nestjs/testing"
import { CreateProducerInteractor } from "./create-producer.interactor"
import { ProducerDatabaseInMemory } from "../repositories/in-memory/producer-database-in-memory";
import { PlantedCropsService } from "../../plantedCrops/services/planted-crops.service";
import { PlantedCropsDatabaseInMemory } from "../../plantedCrops/repositories/in-memory/planted-crops-database-in-memory";
import { NewProducerDto } from "../ports/dtos/new-producer.dto";
import { CreateProducerPresenter } from "../ports/presenters/create-producer.presenter";
import { ErrorsEnum } from "../../shared/errors.enum";


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
    dto.farm = {
      farmName: 'Happy Farm',
      city: 'City A',
      state: 'State X',
      totalArea: 1000,
      cultivableArea: 800,
      vegetationArea: 200,
      plantedCrops: [1, 2],
    }
    const result = await interactor.execute(dto);
    expect(result.httpResponse().producerId).toBeDefined();
  });
  describe('should return error when', () => {
    it('producer with an invalid document', async () => {
      const dto = new NewProducerDto();
      dto.producer = {
        document: 'invalid-document',
        name: 'John Doe'
      }
      dto.farm = {
        farmName: 'Happy Farm',
        city: 'City A',
        state: 'State X',
        totalArea: 1000,
        cultivableArea: 800,
        vegetationArea: 200,
        plantedCrops: [1, 2],
      }
      try {
        await interactor.execute(dto)
      } catch (error) {
        expect(error.message).toBe(ErrorsEnum.INVALID_DOCUMENT)
        expect(error.httpStatus).toBe(400)
        expect(error.errorType).toBe('INVALID_DOCUMENT')
      }
    });

    it('sum of cultivable area and vegetation area exceed the total area', async () => {
      const dto = new NewProducerDto();
      dto.producer = {
        document: 'invalid-document',
        name: 'John Doe'
      }
      dto.farm = {
        farmName: 'Happy Farm',
        city: 'City A',
        state: 'State X',
        totalArea: 1000,
        cultivableArea: 800,
        vegetationArea: 400,
        plantedCrops: [1, 2],
      }
      try {
        await interactor.execute(dto)
      } catch (error) {
        expect(error.message).toBe(ErrorsEnum.INVALID_AREA)
        expect(error.httpStatus).toBe(400)
        expect(error.errorType).toBe('INVALID_AREA')
      }
    });

    it('should not be possible to create a producer with planted crops invalid', async () => {
      const dto = new NewProducerDto();
      dto.producer = {
        document: 'invalid-document',
        name: 'John Doe'
      }
      dto.farm = {
        farmName: 'Happy Farm',
        city: 'City A',
        state: 'State X',
        totalArea: 1000,
        cultivableArea: 800,
        vegetationArea: 200,
        plantedCrops: [1, 2, 8],
      }
      try {
        await interactor.execute(dto)
      } catch (error) {
        expect(error.message).toBe(ErrorsEnum.INVALID_CROPS)
        expect(error.httpStatus).toBe(400)
        expect(error.errorType).toBe('INVALID_CROPS')
      }
    });
  })

});