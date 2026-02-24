// src/services/jobOfferService.ts
import axios from "axios";
import { JobOfferDto } from "../types/jobOfferDto";

const API_URL = process.env.REACT_APP_API_URL || "/api";

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
      axios.post(`${API_URL}/job-offers`, null, { params: { applicationId, offeredAt, status } })
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

  // --- Nuevas llamadas por salario ---
  findByExpectedSalaryGreaterThan: (salary: number): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/expected-salary/greater-than`, { params: { salary } })),

  findByOfferedSalaryLessThan: (salary: number): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/offered-salary/less-than`, { params: { salary } })),

  findByExpectedSalaryBetween: (minSalary: number, maxSalary: number): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/expected-salary/between`, { params: { minSalary, maxSalary } })),

  findByOfferedSalaryBetween: (minSalary: number, maxSalary: number): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/offered-salary/between`, { params: { minSalary, maxSalary } })),

  // --- Null / Not Null ---
  findByExpectedSalaryIsNull: (): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/expected-salary/null`)),

  findByOfferedSalaryIsNull: (): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/offered-salary/null`)),

  findByExpectedSalaryIsNotNull: (): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/expected-salary/not-null`)),

  findByOfferedSalaryIsNotNull: (): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/offered-salary/not-null`)),

  // --- Combinadas ---
  findByExpectedSalaryGreaterThanAndOfferedSalaryLessThan: (expectedMin: number, offeredMax: number): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/expected-greater-and-offered-less`, { params: { expectedMin, offeredMax } })),

  findByExpectedSalaryLessThanAndOfferedSalaryGreaterThan: (expectedMax: number, offeredMin: number): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/expected-less-and-offered-greater`, { params: { expectedMax, offeredMin } })),

  findByExpectedSalaryEqualsOfferedSalary: (): Promise<JobOfferDto[]> =>
    handleResponse<JobOfferDto[]>(axios.get(`${API_URL}/job-offers/salary/equals`)),
};