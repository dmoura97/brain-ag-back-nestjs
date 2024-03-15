import { Inject } from "@nestjs/common";
import { Presenter } from "src/shared/contracts/presenter";
import { StatisticsRepository } from "../contracts/statistics.repository";
import { TotalFarmStatisticsPresenter } from "../ports/presenters/total-farm-statistics.presenter";

export class TotalFarmStatisticsInteractor {
  constructor(
    @Inject('StatisticsRepository')
    private statisticsRepository: StatisticsRepository,
    private presenter: TotalFarmStatisticsPresenter
  ) {}

  async execute(): Promise<Presenter> {
    const statistics = await this.statisticsRepository.totalFarm()
    this.presenter.setData(statistics)
    return this.presenter;
  }
}