// src/services/noteService.ts
import axios from "axios";
import { NoteDto } from "../types/jobApplicationDto";

const API_URL = "/api/notes";

export const noteService = {
  // Create a new note
  createNote: async (note: NoteDto) => {
    const response = await axios.post(API_URL, note);
    return response.data;
  },

  // Retrieve all notes for a specific application
  getNotesByApplication: async (applicationId: number) => {
    const response = await axios.get(`${API_URL}/application/${applicationId}`);
    return response.data;
  },

  // Update an existing note
  updateNote: async (noteId: string, note: NoteDto) => {
    const response = await axios.put(`${API_URL}/${noteId}`, note);
    return response.data;
  },

  // Delete a note by ID
  deleteNote: async (noteId: string) => {
    const response = await axios.delete(`${API_URL}/${noteId}`);
    return response.data;
  }
};