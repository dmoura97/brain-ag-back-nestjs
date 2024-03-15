import { Injectable } from "@nestjs/common";
import { StatisticsRepository } from "src/statistics/contracts/statistics.repository";
import { TotalFarmStatistics } from "src/statistics/ports/dtos/types/total-farm-statistics.type";
import { DataSource } from "typeorm";

@Injectable()
export class DatabaseStatisticsTypeOrmRepository implements StatisticsRepository {
  private readonly dataSource: DataSource;
  
  constructor(datasource: DataSource) {
    this.dataSource = datasource
  }

  async totalFarm(): Promise<TotalFarmStatistics> {
    const queryResult = await this.dataSource.createQueryBuilder()
      .select('COUNT(*) "totalFarmsCount"')
      .addSelect('(SUM(farm.total_area)) "totalFarmsArea"')
      .from('farm', 'farm')
      .getRawOne<TotalFarmStatistics>();
    return {
      totalFarmsCount: Number(queryResult.totalFarmsCount),
      totalFarmsArea: Number(queryResult.totalFarmsArea)
    };
  }

}