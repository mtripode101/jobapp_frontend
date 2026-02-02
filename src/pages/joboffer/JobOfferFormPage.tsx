// src/pages/JobOfferFormPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobOfferService } from "../../services/jobOfferService";

export default function JobOfferFormPage() {
  const [applicationId, setApplicationId] = useState<number>(0);
  const [offeredAt, setOfferedAt] = useState<string>("");
  const [status, setStatus] = useState<string>("PENDING");
  const navigate = useNavigate();

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
          <label>Application ID:</label>
          <input
            type="number"
            value={applicationId}
            onChange={(e) => setApplicationId(Number(e.target.value))}
            required
          />
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

      {/* 🔙 Back to previous page */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate(-1)}>⬅️ Back to Previous Page</button>
      </div>
    </div>
  );
}