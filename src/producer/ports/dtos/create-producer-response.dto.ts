import { ApiProperty } from "@nestjs/swagger";

export class CreateProducerResponseDto {
  @ApiProperty()
  producerId: string;
  @ApiProperty()
  message: string;
}