import axios from "axios";
import { jobOfferService } from "../../services/jobOfferService";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("jobOfferService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("gets all and by id", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    mockedAxios.get.mockResolvedValueOnce({ data: { id: 1 } });

    await expect(jobOfferService.getAll()).resolves.toEqual([{ id: 1 }]);
    await expect(jobOfferService.getById(1)).resolves.toEqual({ id: 1 });

    expect(mockedAxios.get).toHaveBeenNthCalledWith(1, "/api/job-offers");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(2, "/api/job-offers/1");
  });

  it("creates with query params", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 2 } });

    await expect(jobOfferService.create(10, "2026-02-28", "PENDING")).resolves.toEqual({ id: 2 });

    expect(mockedAxios.post).toHaveBeenCalledWith("/api/job-offers", null, {
      params: { applicationId: 10, offeredAt: "2026-02-28", status: "PENDING" },
    });
  });

  it("accepts and rejects offers", async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 3, status: "ACCEPTED" } });
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 4, status: "REJECTED" } });

    await expect(jobOfferService.accept(3)).resolves.toEqual({ id: 3, status: "ACCEPTED" });
    await expect(jobOfferService.reject(4)).resolves.toEqual({ id: 4, status: "REJECTED" });

    expect(mockedAxios.put).toHaveBeenNthCalledWith(1, "/api/job-offers/3/accept");
    expect(mockedAxios.put).toHaveBeenNthCalledWith(2, "/api/job-offers/4/reject");
  });

  it("runs salary filters with params", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    await jobOfferService.findByExpectedSalaryGreaterThan(100000);
    await jobOfferService.findByExpectedSalaryBetween(90000, 120000);
    await jobOfferService.findByExpectedSalaryGreaterThanAndOfferedSalaryLessThan(100000, 95000);

    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      1,
      "/api/job-offers/expected-salary/greater-than",
      { params: { salary: 100000 } }
    );
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      2,
      "/api/job-offers/expected-salary/between",
      { params: { minSalary: 90000, maxSalary: 120000 } }
    );
    expect(mockedAxios.get).toHaveBeenNthCalledWith(
      3,
      "/api/job-offers/expected-greater-and-offered-less",
      { params: { expectedMin: 100000, offeredMax: 95000 } }
    );
  });

  it("rethrows api errors", async () => {
    const err = { message: "timeout" };
    mockedAxios.delete.mockRejectedValueOnce(err);

    await expect(jobOfferService.delete(2)).rejects.toBe(err);
    expect(console.error).toHaveBeenCalledWith("API error:", "timeout");
  });
});
