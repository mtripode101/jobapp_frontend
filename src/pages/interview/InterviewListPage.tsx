// src/pages/interview/InterviewListPage.tsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getInterviews, deleteInterview } from "../../services/interviewService";
import { jobApplicationService } from "../../services/jobApplicationService";
import { InterviewDto } from "../../types/interviewDto";
import { JobApplicationDto } from "../../types/jobApplicationDto";

export default function InterviewListPage() {
  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [applicationsMap, setApplicationsMap] = useState<Record<number, JobApplicationDto>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadInterviews = useCallback(() => {
    setLoading(true);
    setError(null);

    Promise.all([getInterviews(), jobApplicationService.getAll()])
      .then(([interviewsData, apps]) => {
        setInterviews(interviewsData || []);
        const map: Record<number, JobApplicationDto> = {};
        (apps || []).forEach((a) => {
          if (a.id != null) map[a.id] = a;
        });
        setApplicationsMap(map);
      })
      .catch(() => setError("Failed to load interviews or applications"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this Interview?")) return;
    setDeletingId(id);
    deleteInterview(id)
      .then(() => {
        setSuccessMessage("Interview deleted successfully");
        loadInterviews();
      })
      .catch(() => setError("Failed to delete interview"))
      .finally(() => setDeletingId(null));
  };

  const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "No date");

  return (
    <div>
      <h2>Interviews</h2>

      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/interviews/new">➕ Add Interview</Link>

      {loading && <p>Loading interviews...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {!loading && !error && (
        <ul>
          {interviews.length === 0 ? (
            <li>No interviews found</li>
          ) : (
            interviews.map((it, idx) => {
              const app = it.applicationId != null ? applicationsMap[it.applicationId] : undefined;
              return (
                <li key={it.id ?? idx} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {it.id ? (
                      <Link to={`/interviews/${it.id}`} style={{ fontWeight: 600 }}>
                        {formatDate(it.scheduledAt)}
                      </Link>
                    ) : (
                      <span style={{ fontWeight: 600 }}>{formatDate(it.scheduledAt)}</span>
                    )}

                    <div>
                      {app ? (
                        <div style={{ fontSize: 14 }}>
                          <span><strong>Candidate:</strong> {app.candidate?.fullName ?? "—"}</span>
                          <span style={{ marginLeft: 12 }}><strong>Company:</strong> {app.company?.name ?? "—"}</span>
                          <span style={{ marginLeft: 12 }}><strong>Position:</strong> {app.position?.title ?? "—"}</span>
                          <span style={{ marginLeft: 12 }}><strong>Status:</strong> {app.status ?? "—"}</span>
                        </div>
                      ) : it.applicationId ? (
                        <div>Application #{it.applicationId} (not loaded)</div>
                      ) : (
                        <div>No linked application</div>
                      )}
                    </div>

                    <div style={{ marginLeft: "auto" }}>
                      <Link to={it.id ? `/interviews/${it.id}/edit` : "#"} style={{ marginRight: 8 }}>
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => it.id && handleDelete(it.id)}
                        disabled={deletingId === it.id}
                      >
                        {deletingId === it.id ? "Deleting..." : "🗑️ Delete"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}