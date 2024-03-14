import { Inject } from "@nestjs/common";
import { ProducerRepository } from "../contracts/producer.repository";
import { Producer } from "../entities/producer.entity";
import { Presenter } from "../../shared/contracts/presenter";
import { DeleteProducerPresenter } from "../ports/presenters/delete-producer.presenter";

export class DeleteProducerInteractor {
  constructor(
    @Inject('ProducerRepository')
    private producerRepository: ProducerRepository,
    private presenter: DeleteProducerPresenter
  ) {}

  async execute(id: string): Promise<Presenter> {
    const producer: Producer = await this.producerRepository.getById(id);
    if (!producer) throw new Error('Producer not found');
    await this.producerRepository.delete(producer);
    this.presenter.setData(producer);
    return this.presenter;
  }
}