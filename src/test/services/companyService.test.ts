import axios from "axios";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  getCompanyByName,
  updateCompany,
} from "../../services/companyService";
import { CompanyDto } from "../../types/company";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("companyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("gets all companies", async () => {
    const companies: CompanyDto[] = [{ id: 1, name: "Acme" }];
    mockedAxios.get.mockResolvedValueOnce({ data: companies });

    await expect(getCompanies()).resolves.toEqual(companies);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/companies");
  });

  it("gets one company by id", async () => {
    const company: CompanyDto = { id: 2, name: "Globex" };
    mockedAxios.get.mockResolvedValueOnce({ data: company });

    await expect(getCompanyById(2)).resolves.toEqual(company);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/companies/2");
  });

  it("searches company by name", async () => {
    const company: CompanyDto = { id: 3, name: "Initech" };
    mockedAxios.get.mockResolvedValueOnce({ data: company });

    await expect(getCompanyByName("Initech")).resolves.toEqual(company);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/companies/Initech/search");
  });

  it("creates a company", async () => {
    const payload: CompanyDto = { name: "Hooli" };
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 5, ...payload } });

    await expect(createCompany(payload)).resolves.toEqual({ id: 5, ...payload });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/companies", payload);
  });

  it("updates a company", async () => {
    const payload: CompanyDto = { name: "Hooli Updated" };
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 5, ...payload } });

    await expect(updateCompany(5, payload)).resolves.toEqual({ id: 5, ...payload });
    expect(mockedAxios.put).toHaveBeenCalledWith("/api/companies/5", payload);
  });

  it("formats backend errors with status", async () => {
    const axiosError = {
      response: {
        status: 500,
        data: { message: "Cannot delete company with active offers" },
      },
      message: "Request failed",
    };

    mockedAxios.delete.mockRejectedValueOnce(axiosError);

    await expect(deleteCompany(5)).rejects.toMatchObject({
      message: "Cannot delete company with active offers",
      status: 500,
    });
    expect(console.error).toHaveBeenCalledWith(
      "API error:",
      500,
      "Cannot delete company with active offers"
    );
  });
});
