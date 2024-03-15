import { TotalFarmStatistics } from "../ports/dtos/types/total-farm-statistics.type";

export interface StatisticsRepository {
  totalFarm(): Promise<TotalFarmStatistics>
}