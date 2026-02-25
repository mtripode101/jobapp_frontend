import axios from "axios";
import { CompanyDto } from "../types/company";

/**
 * Base API URL.
 * Uses environment variable if available, otherwise defaults to "/api".
 */
const API_URL = process.env.REACT_APP_API_URL || "/api";

/**
 * Generic response handler.
 * 
 * - Returns response data on success.
 * - On error:
 *    • Extracts backend message (if available)
 *    • Attaches HTTP status
 *    • Throws a clean Error object for frontend usage
 */
const handleResponse = <T>(promise: Promise<any>): Promise<T> =>
  promise
    .then((res) => res.data)
    .catch((err) => {
      const status = err?.response?.status;

      // Try to extract backend error message
      const backendMessage =
        err?.response?.data?.message || // If backend returns { message: "..." }
        err?.response?.data ||          // If backend returns plain string
        err?.message ||                // Fallback to axios message
        "Unexpected error";

      // Create a clean Error object
      const formattedError = new Error(
        typeof backendMessage === "string"
          ? backendMessage
          : "Unexpected error"
      ) as Error & { status?: number };

      // Attach HTTP status for conditional handling (e.g., 500 errors)
      formattedError.status = status;

      console.error("API error:", status, backendMessage);

      throw formattedError;
    });

/**
 * Retrieve all companies.
 */
export const getCompanies = (): Promise<CompanyDto[]> =>
  handleResponse<CompanyDto[]>(axios.get(`${API_URL}/companies`));

/**
 * Retrieve a company by its ID.
 */
export const getCompanyById = (id: number): Promise<CompanyDto> =>
  handleResponse<CompanyDto>(axios.get(`${API_URL}/companies/${id}`));

/**
 * Create a new company.
 */
export const createCompany = (
  companyDto: CompanyDto
): Promise<CompanyDto> =>
  handleResponse<CompanyDto>(
    axios.post(`${API_URL}/companies`, companyDto)
  );

/**
 * Update an existing company.
 */
export const updateCompany = (
  id: number,
  companyDto: CompanyDto
): Promise<CompanyDto> =>
  handleResponse<CompanyDto>(
    axios.put(`${API_URL}/companies/${id}`, companyDto)
  );

/**
 * Delete a company by its ID.
 * 
 * If the backend returns an error (e.g., 500),
 * the error will contain:
 *   - err.message (backend message)
 *   - err.status (HTTP status)
 */
export const deleteCompany = (id: number): Promise<void> =>
  handleResponse<void>(
    axios.delete(`${API_URL}/companies/${id}`)
  );

/**
 * Search company by name (case-insensitive).
 */
export const getCompanyByName = (
  name: string
): Promise<CompanyDto> =>
  handleResponse<CompanyDto>(
    axios.get(`${API_URL}/companies/${name}/search`)
  );