// src/types/jobApplicationDto.ts
import { BaseDto } from "./baseDto";
import { CandidateDto } from "./candidate";
import { CompanyDto } from "./company";
import { PositionDto } from "./position";
import { InterviewDto } from "./interviewDto"; 
import { JobOfferDto } from "./jobOfferDto";

export interface CommentDto {
  author: string;
  message: string;
}

export interface NoteDto {
  id?: string | null;
  title: string;
  content: string;
  comments?: CommentDto[];
  applicationId?: number;
}

export interface JobApplicationDto extends BaseDto {
  jobId: string;
  dateApplied: string;
  sourceLink: string;
  websiteSource?: string;
  description?: string;
  candidate: CandidateDto;
  company: CompanyDto;
  position: PositionDto;
  status: "APPLIED" | "REJECTED" | "INTERVIEWED" | "OFFERED" | "INTERVIEW_SCHEDULED" | "HIRED";
  interviews?: InterviewDto[];
  offers?: JobOfferDto[];
  notes?: NoteDto[];
}