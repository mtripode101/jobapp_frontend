import axios from "axios";
import { InterviewDto } from "../types/interviewDto";

const API_URL = process.env.REACT_APP_API_URL || "/api";

const handleResponse = <T>(promise: Promise<any>): Promise<T> =>
  promise.then((res) => res.data).catch((err) => {
    console.error("API error:", err.response?.data || err.message);
    throw err;
  });

export const getInterviews = (): Promise<InterviewDto[]> =>
  handleResponse<InterviewDto[]>(axios.get(`${API_URL}/interview`));    

export const getInterviewById = (id: number): Promise<InterviewDto> =>
  handleResponse<InterviewDto>(axios.get(`${API_URL}/interview/${id}`));   

export const createInterview = (interviewDto: InterviewDto): Promise<InterviewDto> =>
  handleResponse<InterviewDto>(axios.post(`${API_URL}/interview`, interviewDto));  

export const updateInterview = (id: number, interviewDto: InterviewDto): Promise<InterviewDto> =>
  handleResponse<InterviewDto>(axios.put(`${API_URL}/interview/${id}`, interviewDto)); 

export const deleteInterview = (id: number): Promise<void> =>
  handleResponse<void>(axios.delete(`${API_URL}/interview/${id}`));    