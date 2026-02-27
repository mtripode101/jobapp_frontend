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
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "16px" }}>📅 Interviews</h2>

      <div style={{ marginBottom: 16 }}>
        <Link to="/interviews/new">➕ Add Interview</Link>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Filter by candidate"
          value={candidateFilter}
          onChange={(e) => setCandidateFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginRight: 8,
          }}
        />
        <input
          type="text"
          placeholder="Filter by company/application"
          value={applicationFilter}
          onChange={(e) => setApplicationFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {loading && <p>Loading interviews...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {!loading && !error && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Type</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Candidate</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Company</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Position</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterviews.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "12px" }}>
                  No interviews found
                </td>
              </tr>
            ) : (
              filteredInterviews.map((it) => {
                const app = it.applicationId ? applicationsMap[it.applicationId] : undefined;
                return (
                  <tr key={it.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{formatDate(it.scheduledAt)}</td>
                    <td style={{ padding: "8px" }}>{it.type}</td>
                    <td style={{ padding: "8px" }}>{app?.candidate?.fullName ?? "—"}</td>
                    <td style={{ padding: "8px" }}>{app?.company?.name ?? "—"}</td>
                    <td style={{ padding: "8px" }}>{app?.position?.title ?? "—"}</td>
                    <td style={{ padding: "8px" }}>{app?.status ?? "—"}</td>
                    <td style={{ padding: "8px" }}>
                      <Link
                        to={it.id ? `/interviews/${it.id}/edit` : "#"}
                        style={{
                          marginRight: 8,
                          color: "#3498db",
                          textDecoration: "none",
                        }}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => it.id && handleDelete(it.id)}
                        disabled={deletingId === it.id}
                        style={{
                          backgroundColor: "#e74c3c",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
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
