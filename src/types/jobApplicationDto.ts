// src/types/jobApplicationDto.ts
import { BaseDto } from "./baseDto";
import { CandidateDto } from "./candidate";
import { CompanyDto } from "./company";
import { PositionDto } from "./position";

export interface JobApplicationDto extends BaseDto {
  jobId: string;
  dateApplied: string;
  sourceLink: string;
  websiteSource?: string;
  description?: string;
  candidate: CandidateDto;
  company: CompanyDto;
  position: PositionDto;
  status: "APPLIED" | "REJECTED" | "INTERVIEW" | "OFFERED";
}