import { Farm } from "../../../producer/entities/farm.entity";
import { StatisticsRepository } from "../../../statistics/contracts/statistics.repository";
import { TotalFarmStatistics } from "../../../statistics/ports/dtos/types/total-farm-statistics.type";

export class StatisticsDatabaseInMemoryRepository implements StatisticsRepository {
  private data: Farm[] = []

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    this.data.push(
      Farm.create("Fazenda 1", "Cidade 1", "Estado 1", 1000, 500, 200),
      Farm.create("Fazenda 2", "Cidade 2", "Estado 2", 2000, 1000, 500),
      Farm.create("Fazenda 3", "Cidade 3", "Estado 3", 1500, 800, 300),
      Farm.create("Fazenda 4", "Cidade 4", "Estado 4", 3000, 1500, 600),
      Farm.create("Fazenda 5", "Cidade 5", "Estado 5", 2500, 1200, 400)
    );
  }

  async totalFarm(): Promise<TotalFarmStatistics> {
    const totalFarmsCount = this.data.length;
    const totalFarmsArea = this.data.reduce((total: number, farm: Farm): number => {
      return total + farm.getTotalArea();
    }, 0)
    return {
      totalFarmsCount,
      totalFarmsArea
    }
  }

}