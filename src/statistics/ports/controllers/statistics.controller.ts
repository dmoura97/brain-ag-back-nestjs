import { Controller, Get } from "@nestjs/common";
import { TotalFarmStatisticsInteractor } from "src/statistics/interactors/total-farm-statistics.interactor";
import { TotalFarmStatisticsResponseDto } from "../dtos/total-farm-statistics-response.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller('statistics')
@ApiTags('Statistics')
export class StatisticsController {
  constructor(
    private readonly totalFarmStatisticsInteractor: TotalFarmStatisticsInteractor
  ) {}

  @Get('/farm-total')
  @ApiResponse({
    type: TotalFarmStatisticsResponseDto,
    status: 200
  })
  async totalFarmStatistics(): Promise<TotalFarmStatisticsResponseDto> {
    const result = await this.totalFarmStatisticsInteractor.execute();
    return result.httpResponse();
  }
}