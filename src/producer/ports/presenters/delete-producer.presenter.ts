import { Producer } from "../../../producer/entities/producer.entity";
import { Presenter } from "../../../shared/contracts/presenter";
import { DeleteProducerResponseDto } from "../dtos/delete-producer-response.dto";


export class DeleteProducerPresenter implements Presenter {
  private data: Producer;
  httpResponse(): DeleteProducerResponseDto {
    const response = new DeleteProducerResponseDto();
    response.message = 'Producer deleted successfully';
    return response;
  }
  setData(data: Producer): void {
    this.data = data;
  }
}