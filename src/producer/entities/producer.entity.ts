import { Document } from "./document.entiy";
import { Farm } from "./farm.entity";

export class Producer {
  private id: string;
  private document: string;
  private name: string;
  private farm: Farm;

  constructor(document: Document, name: string) {
    this.document = document.value;
    this.name = name;
  }

  static create(document: string, name: string) {
    return new Producer(new Document(document), name)
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }
  
  getDocument(): string {
    return this.document;
  }

  getName(): string {
    return this.name;
  }

  getFarm(): Farm {
    return this.farm;
  }

  setFarm(farm: Farm): void {
    this.farm = farm;
  }

}