import axios from "axios";
import { positionService } from "../../services/positionService";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("positionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("runs basic CRUD", async () => {
    const dto = { title: "Backend" } as any;

    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1, ...dto }] });
    mockedAxios.get.mockResolvedValueOnce({ data: { id: 1, ...dto } });
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 2, ...dto } });
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 1, title: "Senior Backend" } });
    mockedAxios.delete.mockResolvedValueOnce({ data: undefined });

    await expect(positionService.getPositions()).resolves.toEqual([{ id: 1, ...dto }]);
    await expect(positionService.getById(1)).resolves.toEqual({ id: 1, ...dto });
    await expect(positionService.create(dto)).resolves.toEqual({ id: 2, ...dto });
    await expect(positionService.update(1, { title: "Senior Backend" } as any)).resolves.toEqual({ id: 1, title: "Senior Backend" });
    await expect(positionService.delete(1)).resolves.toBeUndefined();
  });

  it("runs filter endpoints", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    await positionService.findByTitle("Developer");
    await positionService.findByTitleContaining("Dev");
    await positionService.findByLocation("Remote");
    await positionService.findByCompanyName("Acme");
    await positionService.findWithApplications();

    expect(mockedAxios.get).toHaveBeenNthCalledWith(1, "/api/positions/title?title=Developer");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(2, "/api/positions/title/contains?keyword=Dev");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(3, "/api/positions/location?location=Remote");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(4, "/api/positions/company?companyName=Acme");
    expect(mockedAxios.get).toHaveBeenNthCalledWith(5, "/api/positions/with-applications");
  });

  it("rethrows api errors", async () => {
    const err = { message: "nope" };
    mockedAxios.get.mockRejectedValueOnce(err);

    await expect(positionService.getPositions()).rejects.toBe(err);
    expect(console.error).toHaveBeenCalledWith("API error:", "nope");
  });
});
