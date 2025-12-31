import { BaseDto } from "./baseDto";

/**
 * Company DTO aligned with backend.
 * Extends BaseDto to include id, createdAt, updatedAt.
 */
export interface CompanyDto extends BaseDto {
  name: string;
  website?: string;
  description?: string;
}