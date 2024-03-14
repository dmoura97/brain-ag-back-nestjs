import { Producer } from "src/producer/entities/producer.entity";
import { Presenter } from "src/shared/contracts/presenter";
import { CreateProducerResponseDto } from "../dtos/create-producer-response.dto";

export class CreateProducerPresenter implements Presenter {
  private data: Producer;

  httpResponse(): CreateProducerResponseDto {
    const response = new CreateProducerResponseDto();
    response.producerId = this.data.getId();
    response.message = 'Producer created successfully';
    return response;
  }
  setData(data: Producer): void {
    this.data = data;
  }
  
}