import { ApiProperty } from "@nestjs/swagger";

export class TotalFarmStatisticsResponseDto {
  @ApiProperty()
  totalFarmsCount: number;
  @ApiProperty()
  totalFarmsArea: number;
}