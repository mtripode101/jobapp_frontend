import axios from "axios";
import { jobApplicationService } from "../../services/jobApplicationService";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("jobApplicationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("gets all and paged applications", async () => {
    const all = [{ id: 1 }];
    const paged = { content: [{ id: 1 }], totalElements: 1 };

    mockedAxios.get.mockResolvedValueOnce({ data: all });
    mockedAxios.get.mockResolvedValueOnce({ data: paged });

    await expect(jobApplicationService.getAll()).resolves.toEqual(all);
    await expect(jobApplicationService.getPaged(0, 10)).resolves.toEqual(paged);

    expect(mockedAxios.get).toHaveBeenNthCalledWith(1, "/api/applications");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(2, "/api/applications/paged?page=0&size=10");
  });

  it("creates and updates application", async () => {
    const dto = { status: "APPLIED" } as any;

    mockedAxios.post.mockResolvedValueOnce({ data: { id: 2, ...dto } });
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 3, ...dto, status: "REJECTED" } });
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 2, ...dto } });

    await expect(jobApplicationService.create(dto)).resolves.toEqual({ id: 2, ...dto });
    await expect(jobApplicationService.createRejected(dto)).resolves.toEqual({ id: 3, ...dto, status: "REJECTED" });
    await expect(jobApplicationService.update(2, dto)).resolves.toEqual({ id: 2, ...dto });

    expect(mockedAxios.post).toHaveBeenNthCalledWith(1, "/api/applications", dto);
    expect(mockedAxios.post).toHaveBeenNthCalledWith(2, "/api/applications/rejected", dto);
    expect(mockedAxios.put).toHaveBeenCalledWith("/api/applications/2", dto, {
      headers: { "Content-Type": "application/json" },
    });
  });

  it("updates status and runs search filters", async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 4, status: "INTERVIEW" } });
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 4 }] });
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 5 }] });
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 6 }] });

    await expect(jobApplicationService.updateStatus(4, "INTERVIEW")).resolves.toEqual({ id: 4, status: "INTERVIEW" });
    await expect(jobApplicationService.findByStatus("APPLIED")).resolves.toEqual([{ id: 4 }]);
    await expect(jobApplicationService.findByCandidate("Jane")).resolves.toEqual([{ id: 5 }]);
    await expect(jobApplicationService.findByPosition("Backend")).resolves.toEqual([{ id: 6 }]);

    expect(mockedAxios.put).toHaveBeenCalledWith("/api/4/applications/status?newStatus=INTERVIEW");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(1, "/api/applications/status/APPLIED");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(2, "/api/applications/candidate?fullName=Jane");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(3, "/api/applications/position?title=Backend");
  });

  it("rethrows api errors", async () => {
    const err = { message: "network" };
    mockedAxios.delete.mockRejectedValueOnce(err);

    await expect(jobApplicationService.delete(10)).rejects.toBe(err);
    expect(console.error).toHaveBeenCalledWith("API error:", "network");
  });
});
