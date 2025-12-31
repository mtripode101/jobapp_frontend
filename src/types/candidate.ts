import { BaseDto } from "./baseDto";

/**
 * Candidate DTO aligned with backend.
 * Extends BaseDto to include id, createdAt, updatedAt.
 */
export interface CandidateDto extends BaseDto {
  fullName: string;
  email: string;
  phone?: string; // optional
}