import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const getCompanies = () => axios.get(`${API_URL}/companies`);
export const getCompanyById = (id) => axios.get(`${API_URL}/companies/${id}`);
export const createCompany = (company) => axios.post(`${API_URL}/companies`, company);
export const deleteCompany = (id) => axios.delete(`${API_URL}/companies/${id}`);