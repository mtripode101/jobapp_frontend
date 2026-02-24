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

  // We'll keep applicationId as before (required to submit)
  const [applicationId, setApplicationId] = useState<number | "">("");

  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [loadingApps, setLoadingApps] = useState<boolean>(true);

  // 🔎 New: search input + dropdown state
  const [appQuery, setAppQuery] = useState<string>("");
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoadingApps(true);
    jobApplicationService
      .getAll()
      .then((data) => setApplications(data))
      .catch(() => {
        // optional: handle error
      })
      .finally(() => setLoadingApps(false));
  }, []);

  const toIsoUtc = (localDatetime: string) => {
    const d = new Date(localDatetime);
    return d.toISOString();
  };

  const appLabel = (app: JobApplicationDto) =>
    `${app.jobId ?? "jobId"} - ${app.candidate?.fullName ?? "Candidate"} @ ${app.company?.name ?? "Company"
    } - ${app.position?.title ?? ""}`;

  const filteredApplications = applications.filter((app) =>
    appLabel(app).toLowerCase().includes(appQuery.toLowerCase())
  );

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

        <div style={{ position: "relative" }}>
          <label htmlFor="application">Application:</label>

          {loadingApps ? (
            <p>Loading applications...</p>
          ) : (
            <>
              <input
                id="application"
                type="text"
                value={appQuery}
                placeholder="Type to search job applications..."
                required
                onChange={(e) => {
                  const v = e.target.value;
                  setAppQuery(v);
                  setIsAppDropdownOpen(true);

                  // Important: if user starts typing after selecting,
                  // we clear selection so submit doesn't use stale id.
                  setApplicationId("");
                }}
                onFocus={() => setIsAppDropdownOpen(true)}
                onBlur={() => {
                  // Delay so click on an item registers before closing
                  setTimeout(() => setIsAppDropdownOpen(false), 150);
                }}
                style={{ width: "100%", padding: "8px" }}
              />

              {isAppDropdownOpen && filteredApplications.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: 240,
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    background: "#fff",
                    zIndex: 10,
                  }}
                >
                  {filteredApplications
                    .filter((app): app is JobApplicationDto & { id: number } => typeof app.id === "number")
                    .slice(0, 50)
                    .map((app) => (
                      <div
                        key={app.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setApplicationId(app.id); // ahora es number seguro
                          setAppQuery(appLabel(app));
                          setIsAppDropdownOpen(false);
                        }}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {appLabel(app)}
                      </div>
                    ))}
                </div>
              )}

              {isAppDropdownOpen &&
                appQuery.trim() !== "" &&
                filteredApplications.length === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      border: "1px solid #ccc",
                      background: "#fff",
                      zIndex: 10,
                      padding: "8px",
                    }}
                  >
                    No results.
                  </div>
                )}

              {/* Optional: show the selected id for debugging */}
              {/* <small>Selected applicationId: {applicationId || "-"}</small> */}
            </>
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