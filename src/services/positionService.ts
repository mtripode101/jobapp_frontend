// src/services/positionService.ts
import axios from "axios";
import { PositionDto } from "../types/position";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const handleResponse = <T>(promise: Promise<any>): Promise<T> =>
  promise.then((res) => res.data).catch((err) => {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  });

export const positionService = {
  getPositions: (): Promise<PositionDto[]> =>
    handleResponse<PositionDto[]>(axios.get(`${API_URL}/positions`)),

  getById: (id: number): Promise<PositionDto> =>
    handleResponse<PositionDto>(axios.get(`${API_URL}/positions/${id}`)),

  create: (dto: PositionDto): Promise<PositionDto> =>
    handleResponse<PositionDto>(axios.post(`${API_URL}/positions`, dto)),

  update: (id: number, dto: PositionDto): Promise<PositionDto> =>
    handleResponse<PositionDto>(axios.put(`${API_URL}/positions/${id}`, dto)),

  delete: (id: number): Promise<void> =>
    handleResponse<void>(axios.delete(`${API_URL}/positions/${id}`)),

  findByTitle: (title: string): Promise<PositionDto[]> =>
    handleResponse<PositionDto[]>(axios.get(`${API_URL}/positions/title?title=${title}`)),

  findByTitleContaining: (keyword: string): Promise<PositionDto[]> =>
    handleResponse<PositionDto[]>(axios.get(`${API_URL}/positions/title/contains?keyword=${keyword}`)),

  findByLocation: (location: string): Promise<PositionDto[]> =>
    handleResponse<PositionDto[]>(axios.get(`${API_URL}/positions/location?location=${location}`)),

  findByCompanyName: (companyName: string): Promise<PositionDto[]> =>
    handleResponse<PositionDto[]>(axios.get(`${API_URL}/positions/company?companyName=${companyName}`)),

  findWithApplications: (): Promise<PositionDto[]> =>
    handleResponse<PositionDto[]>(axios.get(`${API_URL}/positions/with-applications`)),
};