// src/pages/JobApplicationEditPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";
import { CandidateDto } from "../../types/candidate";
import { CompanyDto } from "../../types/company";
import { PositionDto } from "../../types/position";
import { getCandidates } from "../../services/candidateService";
import { getCompanies } from "../../services/companyService";
import { positionService } from "../../services/positionService";
import { InterviewDto } from "../../types/interviewDto";
import { JobOfferDto } from "../../types/jobOfferDto"; // 👈 nuevo import

export default function JobApplicationEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<JobApplicationDto | null>(null);
  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [positions, setPositions] = useState<PositionDto[]>([]);

  useEffect(() => {
    if (id) {
      jobApplicationService.getById(Number(id))
        .then((data) => setFormData(data))
        .catch((err) => {
          console.error("Failed to load application:", err);
          alert("Application not found");
          navigate("/applications");
        });
    }

    getCandidates().then(setCandidates).catch(() => alert("Failed to load candidates"));
    getCompanies().then(setCompanies).catch(() => alert("Failed to load companies"));
    positionService.getPositions().then(setPositions).catch(() => alert("Failed to load positions"));
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    jobApplicationService.update(formData.id!, formData)
      .then(() => {
        alert("Application updated successfully!");
        navigate("/applications");
      })
      .catch((err: any) => {
        console.error("Failed to update application:", err);
        alert(err?.message || "Failed to update application");
      });
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Job Application</h2>
      <form onSubmit={handleSubmit}>
        {/* campos de edición */}
        <div>
          <label>Job Id:</label>
          <input
            type="text"
            value={formData.jobId}
            onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Source Link:</label>
          <input
            type="text"
            value={formData.sourceLink}
            onChange={(e) => setFormData({ ...formData, sourceLink: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Website Source:</label>
          <input
            type="text"
            value={formData.websiteSource}
            onChange={(e) => setFormData({ ...formData, websiteSource: e.target.value })}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label>Status:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as JobApplicationDto["status"] })}
          >
            <option value="APPLIED">Applied</option>
            <option value="REJECTED">Rejected</option>
            <option value="INTERVIEWED">Interviewed</option>
            <option value="OFFERED">Offered</option>
            <option value="INTERVIEW SCHEDULED">Interview Scheduled</option>
            <option value="HIRED">Hired</option>

          </select>
        </div>

        <button type="submit">Update Application</button>
      </form>

      {/* 🔹 Interviews linked to this application */}
      <div style={{ marginTop: "20px" }}>
        <h3>Interviews</h3>
        {formData.interviews && formData.interviews.length > 0 ? (
          <ul>
            {formData.interviews.map((iv: InterviewDto) => (
              <li key={iv.id}>
                {new Date(iv.scheduledAt).toLocaleString()} — {iv.type}
                {iv.feedback && <span> | Feedback: {iv.feedback}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No interviews linked to this application</p>
        )}
      </div>

      {/* 🔹 Offers linked to this application */}
      <div style={{ marginTop: "20px" }}>
        <h3>Job Offers</h3>
        {formData.offers && formData.offers.length > 0 ? (
          <ul>
            {formData.offers.map((offer: JobOfferDto) => (
              <li key={offer.id}>
                Offered At: {new Date(offer.offeredAt).toLocaleDateString()} — Status: {offer.status}
                {offer.expectedSalary !== null && <span> | Expected: {offer.expectedSalary}</span>}
                {offer.offeredSalary !== null && <span> | Offered: {offer.offeredSalary}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No offers linked to this application</p>
        )}
      </div>

      <div style={{ marginTop: "10px" }}>
        <Link to="/applications">⬅️ Back to Applications List</Link>
      </div>
    </div>
  );
}