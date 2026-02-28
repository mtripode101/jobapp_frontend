import axios from "axios";
import { noteService } from "../../services/noteService";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("noteService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a note", async () => {
    const dto = { content: "new note" } as any;
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, ...dto } });

    await expect(noteService.createNote(dto)).resolves.toEqual({ id: 1, ...dto });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/notes", dto);
  });

  it("gets notes by application", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1 }] });

    await expect(noteService.getNotesByApplication(5)).resolves.toEqual([{ id: 1 }]);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/notes/application/5");
  });

  it("updates and deletes note", async () => {
    const dto = { content: "updated" } as any;
    mockedAxios.put.mockResolvedValueOnce({ data: { id: "n1", ...dto } });
    mockedAxios.delete.mockResolvedValueOnce({ data: true });

    await expect(noteService.updateNote("n1", dto)).resolves.toEqual({ id: "n1", ...dto });
    await expect(noteService.deleteNote("n1")).resolves.toBe(true);

    expect(mockedAxios.put).toHaveBeenCalledWith("/api/notes/n1", dto);
    expect(mockedAxios.delete).toHaveBeenCalledWith("/api/notes/n1");
  });
});
