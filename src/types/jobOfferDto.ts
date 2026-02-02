// src/types/jobOfferDto.ts
import { BaseDto } from "./baseDto";

export interface JobOfferDto extends BaseDto {
  applicationId: number;
  offeredAt: string; // ISO date string
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  expectedSalary: number | null;
  offeredSalary: number | null;
}