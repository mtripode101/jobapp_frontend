import { BaseDto } from "./baseDto";
import { InterviewType } from "./interviewType";

export interface InterviewDto extends BaseDto {
  scheduledAt: string; // ISO date string
  type: InterviewType; // InterviewType as string
  feedback?: string; // optional
  applicationId?: number; // optional relation to JobApplicationDto
}