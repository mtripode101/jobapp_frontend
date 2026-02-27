import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getInterviews, deleteInterview } from "../../services/interviewService";
import { jobApplicationService } from "../../services/jobApplicationService";
import { InterviewDto } from "../../types/interviewDto";
import { JobApplicationDto } from "../../types/jobApplicationDto";

type SortDirection = "asc" | "desc";
type SortKey = "date" | "type" | "candidate" | "company" | "position" | "status";

export default function InterviewListPage() {
  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [applicationsMap, setApplicationsMap] = useState<Record<number, JobApplicationDto>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [candidateFilter, setCandidateFilter] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

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

  const filteredInterviews = useMemo(() => {
    return interviews.filter((it) => {
      const app = it.applicationId ? applicationsMap[it.applicationId] : undefined;
      const candidateName = app?.candidate?.fullName?.toLowerCase() || "";
      const applicationCompany = app?.company?.name?.toLowerCase() || "";

      return (
        candidateName.includes(candidateFilter.toLowerCase()) &&
        applicationCompany.includes(applicationFilter.toLowerCase())
      );
    });
  }, [interviews, applicationsMap, candidateFilter, applicationFilter]);

  const sortedInterviews = useMemo(() => {
    if (!sortConfig) return filteredInterviews;

    const sorted = [...filteredInterviews];
    sorted.sort((a, b) => {
      const appA = a.applicationId ? applicationsMap[a.applicationId] : undefined;
      const appB = b.applicationId ? applicationsMap[b.applicationId] : undefined;

      const valueA = (() => {
        switch (sortConfig.key) {
          case "date":
            return a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
          case "type":
            return a.type || "";
          case "candidate":
            return appA?.candidate?.fullName || "";
          case "company":
            return appA?.company?.name || "";
          case "position":
            return appA?.position?.title || "";
          case "status":
            return appA?.status || "";
        }
      })();

      const valueB = (() => {
        switch (sortConfig.key) {
          case "date":
            return b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;
          case "type":
            return b.type || "";
          case "candidate":
            return appB?.candidate?.fullName || "";
          case "company":
            return appB?.company?.name || "";
          case "position":
            return appB?.position?.title || "";
          case "status":
            return appB?.status || "";
        }
      })();

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
      }

      const result = String(valueA).localeCompare(String(valueB), undefined, { sensitivity: "base" });
      return sortConfig.direction === "asc" ? result : -result;
    });

    return sorted;
  }, [filteredInterviews, sortConfig, applicationsMap]);

  const arrowStyle = (key: SortKey, direction: SortDirection): React.CSSProperties => ({
    marginLeft: 6,
    padding: "2px 6px",
    fontSize: 11,
    lineHeight: 1,
    fontWeight: sortConfig?.key === key && sortConfig.direction === direction ? 700 : 400,
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "16px" }}>Interviews</h2>

      <div style={{ marginBottom: 16 }}>
        <Link to="/interviews/new">Add Interview</Link>
      </div>

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
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Date
                <button type="button" onClick={() => setSortConfig({ key: "date", direction: "asc" })} style={arrowStyle("date", "asc")}>{"\u25B2"}</button>
                <button type="button" onClick={() => setSortConfig({ key: "date", direction: "desc" })} style={arrowStyle("date", "desc")}>{"\u25BC"}</button>
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Type
                <button type="button" onClick={() => setSortConfig({ key: "type", direction: "asc" })} style={arrowStyle("type", "asc")}>{"\u25B2"}</button>
                <button type="button" onClick={() => setSortConfig({ key: "type", direction: "desc" })} style={arrowStyle("type", "desc")}>{"\u25BC"}</button>
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Candidate
                <button type="button" onClick={() => setSortConfig({ key: "candidate", direction: "asc" })} style={arrowStyle("candidate", "asc")}>{"\u25B2"}</button>
                <button type="button" onClick={() => setSortConfig({ key: "candidate", direction: "desc" })} style={arrowStyle("candidate", "desc")}>{"\u25BC"}</button>
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Company
                <button type="button" onClick={() => setSortConfig({ key: "company", direction: "asc" })} style={arrowStyle("company", "asc")}>{"\u25B2"}</button>
                <button type="button" onClick={() => setSortConfig({ key: "company", direction: "desc" })} style={arrowStyle("company", "desc")}>{"\u25BC"}</button>
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Position
                <button type="button" onClick={() => setSortConfig({ key: "position", direction: "asc" })} style={arrowStyle("position", "asc")}>{"\u25B2"}</button>
                <button type="button" onClick={() => setSortConfig({ key: "position", direction: "desc" })} style={arrowStyle("position", "desc")}>{"\u25BC"}</button>
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Status
                <button type="button" onClick={() => setSortConfig({ key: "status", direction: "asc" })} style={arrowStyle("status", "asc")}>{"\u25B2"}</button>
                <button type="button" onClick={() => setSortConfig({ key: "status", direction: "desc" })} style={arrowStyle("status", "desc")}>{"\u25BC"}</button>
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInterviews.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "12px" }}>
                  No interviews found
                </td>
              </tr>
            ) : (
              sortedInterviews.map((it) => {
                const app = it.applicationId ? applicationsMap[it.applicationId] : undefined;
                return (
                  <tr key={it.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{formatDate(it.scheduledAt)}</td>
                    <td style={{ padding: "8px" }}>{it.type}</td>
                    <td style={{ padding: "8px" }}>{app?.candidate?.fullName ?? "-"}</td>
                    <td style={{ padding: "8px" }}>{app?.company?.name ?? "-"}</td>
                    <td style={{ padding: "8px" }}>{app?.position?.title ?? "-"}</td>
                    <td style={{ padding: "8px" }}>{app?.status ?? "-"}</td>
                    <td style={{ padding: "8px" }}>
                      <Link
                        to={it.id ? `/interviews/${it.id}/edit` : "#"}
                        style={{
                          marginRight: 8,
                          color: "#3498db",
                          textDecoration: "none",
                        }}
                      >
                        Edit
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
                        {deletingId === it.id ? "Deleting..." : "Delete"}
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
