import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";

type SortDirection = "asc" | "desc";
type SortKey = "jobId" | "candidate" | "company" | "position" | "status" | "dateApplied";

export default function JobApplicationListPage() {
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputPage, setInputPage] = useState("1");

  const [candidateFilter, setCandidateFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  useEffect(() => {
    setLoading(true);
    jobApplicationService
      .getPaged(page, 15)
      .then((data) => {
        setApplications(data.content);
        setTotalPages(data.totalPages);
        setInputPage((page + 1).toString());
      })
      .catch((err) => {
        console.error("Failed to fetch applications:", err);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      jobApplicationService
        .delete(id)
        .then(() => {
          setApplications((prev) => prev.filter((app) => app.id !== id));
          alert("Application deleted successfully!");
        })
        .catch((err) => {
          console.error("Failed to delete application:", err);
          alert(err?.message || "Failed to delete application");
        });
    }
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const goToPage = () => {
    const num = parseInt(inputPage, 10);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      setPage(num - 1);
    } else {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const candidateName = app.candidate?.fullName?.toLowerCase() || "";
      const companyName = (app.company?.name || app.position?.companyName || "").toLowerCase();
      const status = app.status?.toLowerCase() || "";

      return (
        candidateName.includes(candidateFilter.toLowerCase()) &&
        companyName.includes(companyFilter.toLowerCase()) &&
        status.includes(statusFilter.toLowerCase())
      );
    });
  }, [applications, candidateFilter, companyFilter, statusFilter]);

  const getSortValue = (app: JobApplicationDto, key: SortKey): string | number => {
    switch (key) {
      case "jobId":
        return app.jobId || "";
      case "candidate":
        return app.candidate?.fullName || "";
      case "company":
        return app.company?.name || app.position?.companyName || "";
      case "position":
        return app.position?.title || "";
      case "status":
        return app.status || "";
      case "dateApplied":
        return app.dateApplied ? new Date(app.dateApplied).getTime() : 0;
      default:
        return "";
    }
  };

  const sortedApplications = useMemo(() => {
    if (!sortConfig) return filteredApplications;

    const sorted = [...filteredApplications];
    sorted.sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.key);
      const bValue = getSortValue(b, sortConfig.key);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      const result = String(aValue).localeCompare(String(bValue), undefined, { sensitivity: "base" });
      return sortConfig.direction === "asc" ? result : -result;
    });

    return sorted;
  }, [filteredApplications, sortConfig]);

  const setSort = (key: SortKey, direction: SortDirection) => {
    setSortConfig({ key, direction });
  };

  const arrowStyle = (key: SortKey, direction: SortDirection): React.CSSProperties => ({
    marginLeft: 6,
    padding: "2px 6px",
    fontSize: 11,
    lineHeight: 1,
    fontWeight: sortConfig?.key === key && sortConfig.direction === direction ? 700 : 400,
  });

  return (
    <div>
      <h2>Job Applications</h2>

      <Link to="/applications/new">Create Application</Link>

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
          placeholder="Filter by company"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <>
          <table border={1} style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr>
                <th>
                  JobID
                  <button type="button" onClick={() => setSort("jobId", "asc")} style={arrowStyle("jobId", "asc")}>{"\u25B2"}</button>
                  <button type="button" onClick={() => setSort("jobId", "desc")} style={arrowStyle("jobId", "desc")}>{"\u25BC"}</button>
                </th>
                <th>
                  Candidate
                  <button type="button" onClick={() => setSort("candidate", "asc")} style={arrowStyle("candidate", "asc")}>{"\u25B2"}</button>
                  <button type="button" onClick={() => setSort("candidate", "desc")} style={arrowStyle("candidate", "desc")}>{"\u25BC"}</button>
                </th>
                <th>
                  Company
                  <button type="button" onClick={() => setSort("company", "asc")} style={arrowStyle("company", "asc")}>{"\u25B2"}</button>
                  <button type="button" onClick={() => setSort("company", "desc")} style={arrowStyle("company", "desc")}>{"\u25BC"}</button>
                </th>
                <th>
                  Position
                  <button type="button" onClick={() => setSort("position", "asc")} style={arrowStyle("position", "asc")}>{"\u25B2"}</button>
                  <button type="button" onClick={() => setSort("position", "desc")} style={arrowStyle("position", "desc")}>{"\u25BC"}</button>
                </th>
                <th>
                  Status
                  <button type="button" onClick={() => setSort("status", "asc")} style={arrowStyle("status", "asc")}>{"\u25B2"}</button>
                  <button type="button" onClick={() => setSort("status", "desc")} style={arrowStyle("status", "desc")}>{"\u25BC"}</button>
                </th>
                <th>
                  Date Applied
                  <button type="button" onClick={() => setSort("dateApplied", "asc")} style={arrowStyle("dateApplied", "asc")}>{"\u25B2"}</button>
                  <button type="button" onClick={() => setSort("dateApplied", "desc")} style={arrowStyle("dateApplied", "desc")}>{"\u25BC"}</button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedApplications.map((app) => (
                <tr key={app.id}>
                  <td>{app.jobId}</td>
                  <td>{app.candidate?.fullName}</td>
                  <td>{app.company?.name || app.position?.companyName}</td>
                  <td>{app.position?.title}</td>
                  <td>{app.status}</td>
                  <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/applications/${app.id}`}>Detail</Link>{" "}
                    <Link to={`/applications/${app.id}/edit`} style={{ marginLeft: "10px", color: "blue" }}>
                      Edit
                    </Link>
                    <button style={{ marginLeft: "10px", color: "red" }} onClick={() => handleDelete(app.id!)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {page + 1} of {totalPages}
            </span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Next
            </button>

            <div style={{ marginTop: "10px" }}>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={inputPage}
                onChange={handlePageInput}
                style={{ width: "60px", marginRight: "10px" }}
              />
              <button onClick={goToPage}>Go</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

