import { ApiProperty } from "@nestjs/swagger";

class Producer{
  @ApiProperty()
  document: string;
  @ApiProperty()
  name: string;
}

class Farm {
  @ApiProperty()
  farmName: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  state: string;
  @ApiProperty()
  totalArea: number;
  @ApiProperty()
  cultivableArea: number;
  @ApiProperty()
  vegetationArea: number;
  @ApiProperty({ 
    description: 'List of identifiers of the planted crops (integer numbers)',
    type: [Number],
    example: [1,2,3]
   })
  plantedCrops: number[]
}

export class UpdateProducerDto {
  @ApiProperty({ type: Producer })
  producer: Producer;
  @ApiProperty({ type: Farm })
  farm: Farm;
  
}
