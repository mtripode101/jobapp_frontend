import React, { useEffect, useState } from "react";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";
import { Link } from "react-router-dom";

export default function JobApplicationListPage() {
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputPage, setInputPage] = useState("1"); // control del input manual

  useEffect(() => {
    setLoading(true);
    jobApplicationService.getPaged(page, 5).then((data) => {
      setApplications(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
      setInputPage((page + 1).toString()); // sincroniza input con la página actual
    }).catch((err) => {
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
      setPage(num - 1); // ajusta porque el backend usa base 0
    } else {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
    }
  };

  return (
    <div>
      <h2>Job Applications</h2>

      {/* 🔗 Navigation */}
      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/applications/new">➕ Create Application</Link>

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
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.jobId}</td>
                  <td>{app.candidate?.fullName}</td>
                  <td>{app.company?.name || app.position?.companyName}</td>
                  <td>{app.position?.title}</td>
                  <td>{app.status}</td>
                  <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/applications/${app.id}`}>🔍 Detail</Link>{" "}
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

            {/* 🔹 Input manual de página */}
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