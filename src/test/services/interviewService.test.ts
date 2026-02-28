import axios from "axios";
import {
  createInterview,
  deleteInterview,
  getInterviewById,
  getInterviews,
  updateInterview,
} from "../../services/interviewService";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("interviewService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("gets all interviews", async () => {
    const data = [{ id: 1, type: "TECH" }];
    mockedAxios.get.mockResolvedValueOnce({ data });

    await expect(getInterviews()).resolves.toEqual(data);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/interview");
  });

  it("gets interview by id", async () => {
    const data = { id: 2, type: "HR" };
    mockedAxios.get.mockResolvedValueOnce({ data });

    await expect(getInterviewById(2)).resolves.toEqual(data);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/interview/2");
  });

  it("creates, updates and deletes interview", async () => {
    const dto = { applicationId: 1, type: "TECH" } as any;

    mockedAxios.post.mockResolvedValueOnce({ data: { id: 3, ...dto } });
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 3, ...dto, type: "HR" } });
    mockedAxios.delete.mockResolvedValueOnce({ data: undefined });

    await expect(createInterview(dto)).resolves.toEqual({ id: 3, ...dto });
    await expect(updateInterview(3, { ...dto, type: "HR" } as any)).resolves.toEqual({ id: 3, ...dto, type: "HR" });
    await expect(deleteInterview(3)).resolves.toBeUndefined();

    expect(mockedAxios.post).toHaveBeenCalledWith("/api/interview", dto);
    expect(mockedAxios.put).toHaveBeenCalledWith("/api/interview/3", { ...dto, type: "HR" });
    expect(mockedAxios.delete).toHaveBeenCalledWith("/api/interview/3");
  });

  it("rethrows api errors", async () => {
    const err = { message: "boom" };
    mockedAxios.get.mockRejectedValueOnce(err);

    await expect(getInterviews()).rejects.toBe(err);
    expect(console.error).toHaveBeenCalledWith("API error:", "boom");
  });
});
