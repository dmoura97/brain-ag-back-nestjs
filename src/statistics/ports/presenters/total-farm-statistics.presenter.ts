import { Presenter } from "src/shared/contracts/presenter";
import { TotalFarmStatistics } from "../dtos/types/total-farm-statistics.type";
import { TotalFarmStatisticsResponseDto } from "../dtos/total-farm-statistics-response.dto";

export class TotalFarmStatisticsPresenter implements Presenter {
  private data: TotalFarmStatistics

  httpResponse(): TotalFarmStatisticsResponseDto {
    const response = new TotalFarmStatisticsResponseDto();
    response.totalFarmsCount = this.data.totalFarmsCount;
    response.totalFarmsArea = this.data.totalFarmsArea;
    return response;
  }
  setData(data: TotalFarmStatistics): void {
    this.data = data
  }
  
}