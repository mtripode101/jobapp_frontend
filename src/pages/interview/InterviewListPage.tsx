import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getInterviews, deleteInterview } from "../../services/interviewService";
import { jobApplicationService } from "../../services/jobApplicationService";
import { InterviewDto } from "../../types/interviewDto";
import { JobApplicationDto } from "../../types/jobApplicationDto";

export default function InterviewListPage() {
  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [applicationsMap, setApplicationsMap] = useState<Record<number, JobApplicationDto>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // filters
  const [candidateFilter, setCandidateFilter] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("");

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

  // apply filters
  const filteredInterviews = interviews.filter((it) => {
    const app = it.applicationId ? applicationsMap[it.applicationId] : undefined;
    const candidateName = app?.candidate?.fullName?.toLowerCase() || "";
    const applicationCompany = app?.company?.name?.toLowerCase() || "";

    return (
      candidateName.includes(candidateFilter.toLowerCase()) &&
      applicationCompany.includes(applicationFilter.toLowerCase())
    );
  });

  return (
    <div>
      <h2>Interviews</h2>

      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/interviews/new">➕ Add Interview</Link>

      {/* Filters */}
      <div style={{ margin: "12px 0" }}>
        <input
          type="text"
          placeholder="Filter by candidate"
          value={candidateFilter}
          onChange={(e) => setCandidateFilter(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Filter by company/application"
          value={applicationFilter}
          onChange={(e) => setApplicationFilter(e.target.value)}
        />
      </div>

      {loading && <p>Loading interviews...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Candidate</th>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterviews.length === 0 ? (
              <tr>
                <td colSpan={7}>No interviews found</td>
              </tr>
            ) : (
              filteredInterviews.map((it) => {
                const app = it.applicationId ? applicationsMap[it.applicationId] : undefined;
                return (
                  <tr key={it.id}>
                    <td>
                      {it.id ? (
                        <Link to={`/interviews/${it.id}`}>{formatDate(it.scheduledAt)}</Link>
                      ) : (
                        formatDate(it.scheduledAt)
                      )}
                    </td>
                    <td>{it.type}</td>
                    <td>{app?.candidate?.fullName ?? "—"}</td>
                    <td>{app?.company?.name ?? "—"}</td>
                    <td>{app?.position?.title ?? "—"}</td>
                    <td>{app?.status ?? "—"}</td>
                    <td>
                      <Link to={it.id ? `/interviews/${it.id}/edit` : "#"} style={{ marginRight: 8 }}>
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => it.id && handleDelete(it.id)}
                        disabled={deletingId === it.id}
                      >
                        {deletingId === it.id ? "Deleting..." : "🗑️ Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}