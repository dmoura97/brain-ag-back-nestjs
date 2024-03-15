import { Module } from "@nestjs/common";
import { AllExceptionsFilter } from "./errors/all-exception.filter";

@Module({
  providers: [
    AllExceptionsFilter
  ]
})
export class SharedModule {}