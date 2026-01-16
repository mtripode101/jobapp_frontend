// src/types/candidate.ts
import { BaseDto } from "./baseDto";

/**
 * Candidate DTO aligned with backend (flat fields).
 */
export interface CandidateDto extends BaseDto {
  fullName: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  github?: string;
}