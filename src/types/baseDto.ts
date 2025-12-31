/**
 * Base DTO with common fields for all DTOs.
 * These fields are typically returned by the backend for auditing.
 */
export interface BaseDto {
  id?: number;          // Unique identifier
  createdAt?: string;   // ISO date string (e.g. "2025-12-31T14:52:00Z")
  updatedAt?: string;   // ISO date string
}