import { Inject, Injectable } from "@nestjs/common";
import { PlantedCropsRepository } from "../contracts/planted-crops-repository";

@Injectable()
export class PlantedCropsService {
  constructor(
    @Inject('PlantedCropsRepository')
    private plantedCropsRepository: PlantedCropsRepository
  ) {}

  async fetchByIds(ids: number[]) {
    return await this.plantedCropsRepository.fetchByIds(ids);
  }
}