import axios from "axios";
import {
  createCandidate,
  deleteCandidate,
  getCandidateById,
  getCandidates,
  updateCandidate,
} from "../../services/candidateService";
import { CandidateDto } from "../../types/candidate";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("candidateService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("gets all candidates", async () => {
    const candidates: CandidateDto[] = [
      { id: 1, fullName: "Jane Doe", email: "jane@demo.com" },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: candidates });

    await expect(getCandidates()).resolves.toEqual(candidates);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/candidates");
  });

  it("gets one candidate by id", async () => {
    const candidate: CandidateDto = {
      id: 7,
      fullName: "John Smith",
      email: "john@demo.com",
    };

    mockedAxios.get.mockResolvedValueOnce({ data: candidate });

    await expect(getCandidateById(7)).resolves.toEqual(candidate);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/candidates/7");
  });

  it("creates a candidate", async () => {
    const payload: CandidateDto = {
      fullName: "Alice Doe",
      email: "alice@demo.com",
    };

    mockedAxios.post.mockResolvedValueOnce({ data: { id: 3, ...payload } });

    await expect(createCandidate(payload)).resolves.toEqual({ id: 3, ...payload });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/candidates", payload);
  });

  it("updates a candidate", async () => {
    const payload: CandidateDto = {
      fullName: "Alice Updated",
      email: "alice.updated@demo.com",
    };

    mockedAxios.put.mockResolvedValueOnce({ data: { id: 3, ...payload } });

    await expect(updateCandidate(3, payload)).resolves.toEqual({ id: 3, ...payload });
    expect(mockedAxios.put).toHaveBeenCalledWith("/api/candidates/3", payload);
  });

  it("deletes a candidate", async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: undefined });

    await expect(deleteCandidate(3)).resolves.toBeUndefined();
    expect(mockedAxios.delete).toHaveBeenCalledWith("/api/candidates/3");
  });

  it("logs and rethrows api errors", async () => {
    const error = { message: "network down" };
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(getCandidates()).rejects.toBe(error);
    expect(console.error).toHaveBeenCalledWith("API error:", "network down");
  });
});
