import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createInterview } from "../../services/interviewService";
import { InterviewDto } from "../../types/interviewDto";
import { InterviewType } from "../../types/interviewType";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";

export default function InterviewFormPage() {
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<InterviewType | "">("");
  const [feedback, setFeedback] = useState<string>("");
  const [applicationId, setApplicationId] = useState<number | "">("");
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [loadingApps, setLoadingApps] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingApps(true);
    jobApplicationService.getAll()
      .then((data) => setApplications(data))
      .catch(() => {
        // opcional: manejar error de carga
      })
      .finally(() => setLoadingApps(false));
  }, []);

  const toIsoUtc = (localDatetime: string) => {
    // input from datetime-local: "YYYY-MM-DDTHH:mm"
    // create Date and convert to ISO string (UTC)
    const d = new Date(localDatetime);
    return d.toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "") {
      alert("Please select an interview type");
      return;
    }
    if (applicationId === "") {
      alert("Please select a job application");
      return;
    }
    if (!date) {
      alert("Please select date and time");
      return;
    }

    const newInterview: InterviewDto = {
      scheduledAt: toIsoUtc(date),
      type: type as InterviewType,
      feedback,
      applicationId: applicationId as number,
    };

    createInterview(newInterview).then(() => navigate("/interviews"));
  };

  return (
    <div>
      <h2>Add New Interview</h2>
      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/interviews">📋 Interviews List</Link>

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
          <label htmlFor="application">Application:</label>
          {loadingApps ? (
            <p>Loading applications...</p>
          ) : (
            <select
              id="application"
              value={applicationId}
              onChange={(e) => setApplicationId(Number(e.target.value))}
              required
            >
              <option value="">-- Select Application --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.jobId ?? "jobId"} - {app.candidate?.fullName ?? "Candidate"} @ {app.company?.name ?? "Company"} - {app.position?.title ?? ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={1000}
          />
        </div>

        <button type="submit">Create Interview</button>
      </form>
    </div>
  );
}