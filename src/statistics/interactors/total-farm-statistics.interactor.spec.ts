import { Test, TestingModule } from "@nestjs/testing"
import { TotalFarmStatisticsInteractor } from "./total-farm-statistics.interactor"
import { StatisticsDatabaseInMemoryRepository } from "../repositories/in-memory/statistics-database-in-memory";
import { TotalFarmStatisticsPresenter } from "../ports/presenters/total-farm-statistics.presenter";


describe('total-farm-statistics.interactor', () => {
  let totalFarmStatisticsInteractor: TotalFarmStatisticsInteractor
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        TotalFarmStatisticsInteractor,
        {
          provide: 'StatisticsRepository',
          useClass: StatisticsDatabaseInMemoryRepository
        },
        TotalFarmStatisticsPresenter
      ],
    }).compile();
    totalFarmStatisticsInteractor = module.get<TotalFarmStatisticsInteractor>(TotalFarmStatisticsInteractor);
  });

  it('should be returning total farms', async () => {
    const totalFarmResult = await totalFarmStatisticsInteractor.execute();
    expect(totalFarmResult.httpResponse().totalFarmsCount).toBe(5);
    expect(totalFarmResult.httpResponse().totalFarmsArea).toBe(10000)
    
  })
})