import axios from "axios";
import { CandidateDto } from "../types/candidate";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const handleResponse = <T>(promise: Promise<any>): Promise<T> =>
  promise
    .then((res) => res.data)
    .catch((err) => {
      console.error("API error:", err.response?.data || err.message);
      throw err;
    });

/**
 * Get all candidates.
 */
export const getCandidates = (): Promise<CandidateDto[]> =>
  handleResponse<CandidateDto[]>(axios.get(`${API_URL}/candidates`));

/**
 * Get candidate by ID.
 */
export const getCandidateById = (id: number): Promise<CandidateDto> =>
  handleResponse<CandidateDto>(axios.get(`${API_URL}/candidates/${id}`));

/**
 * Create a new candidate.
 */
export const createCandidate = (candidateDto: CandidateDto): Promise<CandidateDto> =>
  handleResponse<CandidateDto>(axios.post(`${API_URL}/candidates`, candidateDto));

/**
 * Update an existing candidate.
 */
export const updateCandidate = (id: number, candidateDto: CandidateDto): Promise<CandidateDto> =>
  handleResponse<CandidateDto>(axios.put(`${API_URL}/candidates/${id}`, candidateDto));

/**
 * Delete candidate by ID.
 */
export const deleteCandidate = (id: number): Promise<void> =>
  handleResponse<void>(axios.delete(`${API_URL}/candidates/${id}`));