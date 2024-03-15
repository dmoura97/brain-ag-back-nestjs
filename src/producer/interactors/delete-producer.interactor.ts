import { HttpStatus, Inject } from "@nestjs/common";
import { ProducerRepository } from "../contracts/producer.repository";
import { Producer } from "../entities/producer.entity";
import { Presenter } from "../../shared/contracts/presenter";
import { DeleteProducerPresenter } from "../ports/presenters/delete-producer.presenter";
import { ErrorsEnum } from "../../shared/errors.enum";
import { CustomException } from "../../shared/errors/custom-error.exception";

export class DeleteProducerInteractor {
  constructor(
    @Inject('ProducerRepository')
    private producerRepository: ProducerRepository,
    private presenter: DeleteProducerPresenter
  ) {}

  async execute(id: string): Promise<Presenter> {
    const producer: Producer = await this.producerRepository.getById(id);
    if (!producer) throw new CustomException(ErrorsEnum.PRODUCER_NOT_FOUND, HttpStatus.NOT_FOUND, 'PRODUCER_NOT_FOUND') ;
    await this.producerRepository.delete(producer);
    this.presenter.setData(producer);
    return this.presenter;
  }
}