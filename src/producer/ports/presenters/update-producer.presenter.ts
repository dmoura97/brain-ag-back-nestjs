import { Producer } from "src/producer/entities/producer.entity";
import { Presenter } from "src/shared/contracts/presenter";
import { UpdateProducerResponseDto } from "../dtos/update-producer-response.dto";

export class UpdateProducerPresenter implements Presenter {
  private data: Producer;
  httpResponse(): UpdateProducerResponseDto {
    const response = new UpdateProducerResponseDto();
    response.message = 'Producer updated successfully';
    return response;
  }
  setData(data: Producer): void {
    this.data = data;
  }
}