import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobOfferService } from "../../services/jobOfferService";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";

export default function JobOfferFormPage() {
  const [applicationId, setApplicationId] = useState<number>(0);
  const [offeredAt, setOfferedAt] = useState<string>("");
  const [status, setStatus] = useState<string>("PENDING");
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [loadingApps, setLoadingApps] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    jobApplicationService.getAll()
      .then((data) => setApplications(data))
      .catch((err) => {
        console.error("Error loading applications", err);
        alert("Failed to load applications");
      })
      .finally(() => setLoadingApps(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    jobOfferService.create(applicationId, offeredAt, status).then(() => {
      alert("Offer created successfully!");
      navigate("/job-offers");
    });
  };

  return (
    <div>
      <h2>Create Job Offer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Application:</label>
          {loadingApps ? (
            <p>Loading applications...</p>
          ) : (
            <select
              value={applicationId}
              onChange={(e) => setApplicationId(Number(e.target.value))}
              required
            >
              <option value="">-- Select Application --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} - {app.candidate.fullName} ({app.jobId})
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label>Offered At:</label>
          <input
            type="date"
            value={offeredAt}
            onChange={(e) => setOfferedAt(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <button type="submit">Save Offer</button>
      </form>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate(-1)}>⬅️ Back to Previous Page</button>
      </div>
    </div>
  );
}