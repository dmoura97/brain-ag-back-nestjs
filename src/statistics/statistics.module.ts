import { Module } from "@nestjs/common";
import { TotalFarmStatisticsInteractor } from "./interactors/total-farm-statistics.interactor";
import { DatabaseStatisticsTypeOrmRepository } from "./repositories/typeorm/database-statistics-typeorm";
import { TotalFarmStatisticsPresenter } from "./ports/presenters/total-farm-statistics.presenter";
import { StatisticsController } from "./ports/controllers/statistics.controller";
import { DataSourceTypeorm } from "src/config";


@Module({
  imports: [],
  providers: [
    TotalFarmStatisticsInteractor,
    TotalFarmStatisticsPresenter,
    {
      provide: 'StatisticsRepository',
      useClass: DatabaseStatisticsTypeOrmRepository
    },
    {
      provide: 'DataSource',
      useValue: DataSourceTypeorm
    }
  ],
  controllers: [StatisticsController]
})
export class StatisticsModule {}