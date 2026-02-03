// src/types/jobApplicationDto.ts
import { BaseDto } from "./baseDto";
import { CandidateDto } from "./candidate";
import { CompanyDto } from "./company";
import { PositionDto } from "./position";
import { InterviewDto } from "./interviewDto"; 
import { JobOfferDto } from "./jobOfferDto";

export interface JobApplicationDto extends BaseDto {
  jobId: string;
  dateApplied: string;
  sourceLink: string;
  websiteSource?: string;
  description?: string;
  candidate: CandidateDto;
  company: CompanyDto;
  position: PositionDto;
  status: "Applied" | "Rejected" | "Interviewed" | "Offered" | "Interview Scheduled" | "Hired";
  interviews?: InterviewDto[];
  offers?: JobOfferDto[];
}