class Producer{
  document: string;
  name: string;
}

class Farm {
  farmName: string;
  city: string;
  state: string;
  totalArea: number;
  cultivableArea: number;
  vegetationArea: number;
  plantedCrops: number[]
}

export class NewProducerDto {
  producer: Producer;
  farm: Farm;
  
}
