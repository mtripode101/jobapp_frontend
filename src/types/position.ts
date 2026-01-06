// src/types/positionDto.ts
import { BaseDto } from "./baseDto";

export interface PositionDto extends BaseDto {
  title: string;
  location?: string;
  description?: string;
  companyName?: string;
}