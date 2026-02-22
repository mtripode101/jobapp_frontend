import axios from "axios";
import { CompanyDto } from "../types/company";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const handleResponse = <T>(promise: Promise<any>): Promise<T> =>
  promise.then((res) => res.data).catch((err) => {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  });

export const getCompanies = (): Promise<CompanyDto[]> =>
  handleResponse<CompanyDto[]>(axios.get(`${API_URL}/companies`));

export const getCompanyById = (id: number): Promise<CompanyDto> =>
  handleResponse<CompanyDto>(axios.get(`${API_URL}/companies/${id}`));

export const createCompany = (companyDto: CompanyDto): Promise<CompanyDto> =>
  handleResponse<CompanyDto>(axios.post(`${API_URL}/companies`, companyDto));

export const updateCompany = (id: number, companyDto: CompanyDto): Promise<CompanyDto> =>
  handleResponse<CompanyDto>(axios.put(`${API_URL}/companies/${id}`, companyDto));

export const deleteCompany = (id: number): Promise<void> =>
  handleResponse<void>(axios.delete(`${API_URL}/companies/${id}`));

export const getCompanyByName = (name: string): Promise<CompanyDto> =>
  handleResponse<CompanyDto>(axios.get(`${API_URL}/companies/${name}/search`));