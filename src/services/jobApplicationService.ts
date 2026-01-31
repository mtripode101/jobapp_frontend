// src/services/jobApplicationService.ts
import axios from "axios";
import { JobApplicationDto } from "../types/jobApplicationDto";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const handleResponse = <T>(promise: Promise<any>): Promise<T> =>
  promise.then((res) => res.data).catch((err) => {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  });

export const jobApplicationService = {
  getAll: (): Promise<JobApplicationDto[]> =>
    handleResponse<JobApplicationDto[]>(axios.get(`${API_URL}/applications`)),

  getById: (id: number): Promise<JobApplicationDto> =>
    handleResponse<JobApplicationDto>(axios.get(`${API_URL}/applications/${id}`)),

  create: (dto: JobApplicationDto): Promise<JobApplicationDto> =>
    handleResponse<JobApplicationDto>(axios.post(`${API_URL}/applications`, dto)),

  createRejected: (dto: JobApplicationDto): Promise<JobApplicationDto> =>
    handleResponse<JobApplicationDto>(axios.post(`${API_URL}/applications/rejected`, dto)),

  updateStatus: (id: number, newStatus: string): Promise<JobApplicationDto> =>
    handleResponse<JobApplicationDto>(axios.put(`${API_URL}/${id}/applications/status?newStatus=${newStatus}`)),

  delete: (id: number): Promise<void> =>
    handleResponse<void>(axios.delete(`${API_URL}/applications/${id}`)),

  findByStatus: (status: string): Promise<JobApplicationDto[]> =>
    handleResponse<JobApplicationDto[]>(axios.get(`${API_URL}/applications/status/${status}`)),

  findByCompany: (name: string): Promise<JobApplicationDto[]> =>
    handleResponse<JobApplicationDto[]>(axios.get(`${API_URL}/company?name=${name}`)),

  findByCandidate: (fullName: string): Promise<JobApplicationDto[]> =>
    handleResponse<JobApplicationDto[]>(axios.get(`${API_URL}/applications/candidate?fullName=${fullName}`)),

  findByPosition: (title: string): Promise<JobApplicationDto[]> =>
    handleResponse<JobApplicationDto[]>(axios.get(`${API_URL}/applications/position?title=${title}`)),
};