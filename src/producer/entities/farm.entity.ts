import { PlantedCrops } from "../../plantedCrops/entities/planted-crops.entity";
import { Producer } from "./producer.entity";

export class Farm {
  private id?: string;
  private farmName: string;
  private city: string;
  private state: string;
  private totalArea: number;
  private cultivableArea: number;
  private vegetationArea: number;
  private plantedCrops: PlantedCrops[];
  private producer: Producer

  constructor(farmName: string, city: string, state: string, totalArea: number, cultivableArea: number, vegetationArea: number ) {
    this.farmName = farmName;
    this.city = city;
    this.state = state;
    this.totalArea = totalArea;
    this.cultivableArea = cultivableArea;
    this.vegetationArea = vegetationArea;
  }

  static create(farmName: string, city: string, state: string, totalArea: number, cultivableArea: number, vegetationArea: number ) {
    return new Farm(farmName, city, state, totalArea, cultivableArea, vegetationArea);
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getFarmName(): string {
    return this.farmName;
  }

  getCity(): string {
    return this.city;
  }

  getState(): string {
    return this.state;
  }

  getTotalArea(): number {
    return this.totalArea;
  }
  
  getCultivableArea(): number {
    return this.cultivableArea;
  }

  getVegetationArea(): number {
    return this.vegetationArea;
  }

  getPlantedCrops(): PlantedCrops[] {
    return this.plantedCrops;
  }

  setPlantedCrops(plantedCrops: PlantedCrops[]){
    this.plantedCrops = plantedCrops;
  }

  getProducer(): Producer {
    return this.producer;
  }

  setProducer(producer: Producer) {
    this.producer = producer;
  }

  checkArea() {
    const total = this.cultivableArea + this.vegetationArea;
    if(total > this.totalArea) throw new Error('The sum of cultivable area and vegetation area cannot exceed the total area of the farm')
  }

}