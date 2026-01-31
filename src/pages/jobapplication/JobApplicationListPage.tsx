import React, { useEffect, useState } from "react";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";
import { Link } from "react-router-dom";

export default function JobApplicationListPage() {
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);

  useEffect(() => {
    jobApplicationService.getAll().then(setApplications);
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      jobApplicationService
        .delete(id)
        .then(() => {
          // Filtrar la lista local para quitar el eliminado
          setApplications((prev) => prev.filter((app) => app.id !== id));
          alert("Application deleted successfully!");
        })
        .catch((err) => {
          console.error("Failed to delete application:", err);
          alert(err?.message || "Failed to delete application");
        });
    }
  };

  return (
    <div>
      <h2>Job Applications</h2>

      {/* 🔗 Navigation */}
      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/applications/new">➕ Create Application</Link>

      <table border={1} style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>JobID</th>
            <th>Candidate</th>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.jobId}</td>
              <td>{app.candidate?.fullName}</td>
              <td>{app.position.companyName}</td>
              <td>{app.position?.title}</td>
              <td>{app.status}</td>
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
    </div>
  );
}