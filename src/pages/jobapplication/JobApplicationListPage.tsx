import React, { useEffect, useState } from "react";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";
import { Link } from "react-router-dom";

export default function JobApplicationListPage() {
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputPage, setInputPage] = useState("1");

  // 🔹 Filters
  const [candidateFilter, setCandidateFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    jobApplicationService.getPaged(page, 15) // 👈 ahora 15 por página
      .then((data) => {
        setApplications(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
        setInputPage((page + 1).toString());
      })
      .catch((err) => {
        console.error("Failed to fetch applications:", err);
        setLoading(false);
      });
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

  // 🔹 Apply filters
  const filteredApplications = applications.filter((app) => {
    const candidateName = app.candidate?.fullName?.toLowerCase() || "";
    const companyName = (app.company?.name || app.position?.companyName || "").toLowerCase();
    const status = app.status?.toLowerCase() || "";

    return (
      candidateName.includes(candidateFilter.toLowerCase()) &&
      companyName.includes(companyFilter.toLowerCase()) &&
      status.includes(statusFilter.toLowerCase())
    );
  });

  return (
    <div>
      <h2>Job Applications</h2>

      <Link to="/applications/new">➕ Create Application</Link>

      {/* 🔹 Filter controls */}
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
                <th>JobID</th>
                <th>Candidate</th>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td>{app.jobId}</td>
                  <td>{app.candidate?.fullName}</td>
                  <td>{app.company?.name || app.position?.companyName}</td>
                  <td>{app.position?.title}</td>
                  <td>{app.status}</td>
                  <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/applications/${app.id}`}>🔍 Detail</Link>{" "}
                    <Link to={`/applications/${app.id}/edit`} style={{ marginLeft: "10px", color: "blue" }}>
                      ✏️ Edit
                    </Link>
                    <button
                      style={{ marginLeft: "10px", color: "red" }}
                      onClick={() => handleDelete(app.id!)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔹 Pagination Controls */}
          <div style={{ marginTop: "20px" }}>
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              ⬅️ Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {page + 1} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next ➡️
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
