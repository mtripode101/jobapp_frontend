import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createInterview } from "../../services/interviewService";
import { InterviewDto } from "../../types/interviewDto";
import { InterviewType } from "../../types/interviewType";

export default function InterviewFormPage() {
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<InterviewType | "">("");
  const [feedback, setFeedback] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "") {
      alert("Please select an interview type");
      return;
    }
    const newInterview: InterviewDto = {
      scheduledAt: date,
      type: type as InterviewType,
      feedback,
    };
    createInterview(newInterview).then(() => navigate("/interviews"));
  };

  return (
    <div>
      <h2>Add New Interview</h2>
      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/interview">📋 Interviews List</Link>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as InterviewType)}
            required
          >
            <option value="">-- Select Type --</option>
            <option value={InterviewType.PHONE}>Phone</option>
            <option value={InterviewType.VIDEO}>Video</option>
            <option value={InterviewType.ONSITE}>Onsite</option>
            <option value={InterviewType.TECHNICAL}>Technical</option>
            <option value={InterviewType.HR}>HR</option>
          </select>
        </div>

        <div>
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <button type="submit">Create Interview</button>
      </form>
    </div>
  );
}