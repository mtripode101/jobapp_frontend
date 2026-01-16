// src/pages/JobApplicationListPage.tsx
import React, { useEffect, useState } from "react";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";
import { Link } from "react-router-dom";

export default function JobApplicationListPage() {
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);

  useEffect(() => {
    jobApplicationService.getAll().then(setApplications);
  }, []);

  return (
    <div>
      <h2>Job Applications</h2>

      {/* 🔗 Navigation */}
      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/applications/new">➕ Create Application</Link>

      <table border={1} style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
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
              <td>{app.id}</td>
              <td>{app.candidate?.fullName}</td>
              <td>{app.position.companyName}</td>
              <td>{app.position?.title}</td>
              <td>{app.status}</td>
              <td>
                <Link to={`/applications/${app.id}`}>🔍 Detail</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}