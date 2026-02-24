// EditInterviewPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getInterviewById, updateInterview } from "../../services/interviewService";
import { jobApplicationService } from "../../services/jobApplicationService";
import { InterviewDto } from "../../types/interviewDto";
import { InterviewType } from "../../types/interviewType";
import { JobApplicationDto } from "../../types/jobApplicationDto";

export default function EditInterviewPage() {
  const { id } = useParams<{ id: string }>();
  const interviewId = id ? Number(id) : NaN;
  const navigate = useNavigate();

  const [interview, setInterview] = useState<InterviewDto | null>(null);
  const [dateLocal, setDateLocal] = useState<string>(""); // value for datetime-local
  const [type, setType] = useState<InterviewType | "">("");
  const [feedback, setFeedback] = useState<string>("");

  // Keep the chosen id (required)
  const [applicationId, setApplicationId] = useState<number | "">("");

  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 🔎 New: search input + dropdown state (like InterviewFormPage)
  const [appQuery, setAppQuery] = useState<string>("");
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState<boolean>(false);

  const toLocalDatetime = (iso: string | undefined) => {
    if (!iso) return "";
    const d = new Date(iso);
    const tzOffset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const toIsoUtc = (localDatetime: string) => {
    if (!localDatetime) return "";
    const d = new Date(localDatetime);
    return d.toISOString();
  };

  const appLabel = (app: JobApplicationDto) =>
    `${app.jobId ?? "jobId"} - ${app.candidate?.fullName ?? "Candidate"} @ ${
      app.company?.name ?? "Company"
    } - ${app.position?.title ?? ""}`;

  useEffect(() => {
    if (isNaN(interviewId)) {
      setError("Invalid interview id");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([getInterviewById(interviewId), jobApplicationService.getAll()])
      .then(([interviewData, apps]) => {
        setInterview(interviewData);
        setType(interviewData.type ?? "");
        setFeedback(interviewData.feedback ?? "");
        setApplicationId(interviewData.applicationId ?? "");
        setDateLocal(toLocalDatetime(interviewData.scheduledAt));
        setApplications(apps);
      })
      .catch(() => setError("Failed to load interview or applications"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  // Sync the input with the current selected applicationId (so edit loads with a readable label)
  useEffect(() => {
    if (loading || applications.length === 0) return;

    if (applicationId === "") {
      setAppQuery("");
      return;
    }

    const selected = applications.find((a) => a.id === applicationId);
    if (selected) setAppQuery(appLabel(selected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId, applications, loading]);

  const filteredApplications = useMemo(() => {
    const q = appQuery.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((app) => appLabel(app).toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications, appQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!interview) {
      setError("Interview not loaded");
      return;
    }
    if (type === "") {
      setError("Please select an interview type");
      return;
    }
    if (applicationId === "") {
      setError("Please select a job application");
      return;
    }
    if (!dateLocal) {
      setError("Please select date and time");
      return;
    }

    const updated: InterviewDto = {
      ...interview,
      scheduledAt: toIsoUtc(dateLocal),
      type: type as InterviewType,
      feedback,
      applicationId: applicationId as number,
    };

    setSaving(true);
    updateInterview(interviewId, updated)
      .then(() => {
        setSuccessMessage("Interview updated successfully");
        setTimeout(() => navigate("/interviews"), 800);
      })
      .catch(() => setError("Failed to update interview"))
      .finally(() => setSaving(false));
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/interviews">← Back to Interviews</Link>
      </div>
    );

  return (
    <div>
      <h2>Edit Interview</h2>
      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/interviews">📋 Interviews List</Link>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="datetime-local"
            id="date"
            value={dateLocal}
            onChange={(e) => setDateLocal(e.target.value)}
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

        {/* ✅ Replaced select with searchable input + dropdown */}
        <div style={{ position: "relative" }}>
          <label htmlFor="application">Application:</label>

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

              // Clear selected id while user is typing to avoid submitting stale selection
              setApplicationId("");
            }}
            onFocus={() => setIsAppDropdownOpen(true)}
            onBlur={() => {
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
                // ✅ IMPORTANT: your JobApplicationDto.id seems to be number | undefined
                .filter((app): app is JobApplicationDto & { id: number } => typeof app.id === "number")
                .slice(0, 50)
                .map((app) => (
                  <div
                    key={app.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setApplicationId(app.id);
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

          {isAppDropdownOpen && appQuery.trim() !== "" && filteredApplications.length === 0 && (
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

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}