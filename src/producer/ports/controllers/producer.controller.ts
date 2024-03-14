import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { CreateProducerResponseDto } from "../dtos/create-producer-response.dto";
import { NewProducerDto } from "../dtos/new-producer.dto";
import { CreateProducerInteractor } from "src/producer/interactors/create-producer.interactor";
import { UpdateProducerResponseDto } from "../dtos/update-producer-response.dto";
import { UpdateProducerInteractor } from "src/producer/interactors/update-producer.interactor";
import { UpdateProducerDto } from "../dtos/update-producer.dto";
import { DeleteProducerInteractor } from "src/producer/interactors/delete-producer.interactor";
import { DeleteProducerResponseDto } from "../dtos/delete-producer-response.dto";


@Controller('producer')
export class ProducerController {
  constructor(
    private readonly createProducerInteractor: CreateProducerInteractor,
    private readonly updateProducerInteractor: UpdateProducerInteractor,
    private readonly deleteProducerInteractor: DeleteProducerInteractor
  ) {}

  @Post()
  async create(
    @Body() newProducerDto: NewProducerDto
  ): Promise<CreateProducerResponseDto> {
    const result = await this.createProducerInteractor.execute(newProducerDto);
    return result.httpResponse();
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProducer: UpdateProducerDto
  ): Promise<UpdateProducerResponseDto> {
    const result = await this.updateProducerInteractor.execute(id, updateProducer);
    return result.httpResponse();
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
  ): Promise<DeleteProducerResponseDto> {
    const result = await this.deleteProducerInteractor.execute(id);
    return result.httpResponse();
  }
}