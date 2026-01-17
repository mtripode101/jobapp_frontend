// src/services/jobOfferService.ts
import axios from "axios";
import { JobOfferDto } from "../types/jobOfferDto";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const handleResponse = <T>(promise: Promise<any>): Promise<T> =>
  promise.then((res) => res.data).catch((err) => {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  });

export const jobOfferService = {
  getAll: (): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers`)),

  getById: (id: number): Promise<JobOfferDto> =>
    handleResponse<JobOfferDto>(axios.get(`${API_URL}/job-offers/${id}`)),

  create: (applicationId: number, offeredAt: string, status: string): Promise<JobOfferDto> =>
    handleResponse<JobOfferDto>(
      axios.post(API_URL, null, { params: { applicationId, offeredAt, status } })
    ),

  update: (id: number, dto: JobOfferDto): Promise<JobOfferDto> =>
    handleResponse<JobOfferDto>(axios.put(`${API_URL}/job-offers/${id}`, dto)),

  delete: (id: number): Promise<void> =>
    handleResponse<void>(axios.delete(`${API_URL}/job-offers/${id}`)),

  findByStatus: (status: string): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/status/${status}`)),

  accept: (id: number): Promise<JobOfferDto> =>
    handleResponse<JobOfferDto>(axios.put(`${API_URL}/job-offers/${id}/accept`)),

  reject: (id: number): Promise<JobOfferDto> =>
    handleResponse<JobOfferDto>(axios.put(`${API_URL}/job-offers/${id}/reject`)),
};