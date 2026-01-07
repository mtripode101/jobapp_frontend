import { BaseDto } from "./baseDto";

/**
 * Candidate DTO aligned with backend.
 * Extends BaseDto to include id, createdAt, updatedAt.
 */
export interface ContactInfoDto {
  email: string;
  phone?: string;      // optional
  linkedIn?: string;   // optional
  github?: string;     // optional
}

export interface CandidateDto extends BaseDto {
  fullName: string;
  contactInfo: ContactInfoDto;
}