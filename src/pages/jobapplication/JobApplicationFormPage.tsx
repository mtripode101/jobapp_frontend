// src/pages/JobApplicationFormPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jobApplicationService } from "../../services/jobApplicationService";
import { getCandidates } from "../../services/candidateService";
import { getCompanies } from "../../services/companyService";
import { positionService  } from "../../services/positionService";
import { JobApplicationDto } from "../../types/jobApplicationDto";
import { CandidateDto } from "../../types/candidate";
import { CompanyDto } from "../../types/company";
import { PositionDto } from "../../types/position";

const EMPTY_CANDIDATE: CandidateDto = {
  id: 0,
  fullName: "",
  contactInfo: { email: "", phone: "", linkedIn: "", github: "" },
};

const EMPTY_COMPANY: CompanyDto = {
  id: 0,
  name: "",
  website: "",
  description: "",
};

const EMPTY_POSITION: PositionDto = {
  id: 0,
  title: "",
  location: "",
  description: "",
  companyName: "",
};

export default function JobApplicationFormPage() {
  const [formData, setFormData] = useState<JobApplicationDto>({
    sourceLink: "",
    websiteSource: "",
    description: "",
    candidate: EMPTY_CANDIDATE,
    company: EMPTY_COMPANY,
    position: EMPTY_POSITION,
    status: "APPLIED",
  });

  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [positions, setPositions] = useState<PositionDto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCandidates().then(setCandidates).catch(() => alert("Failed to load candidates"));
    getCompanies().then(setCompanies).catch(() => alert("Failed to load companies"));
    positionService.getPositions().then(setPositions).catch(() => alert("Failed to load positions")); // ✅ use method
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.candidate?.id || formData.candidate.id === 0) {
      alert("Please select a candidate.");
      return;
    }
    if (!formData.company?.id || formData.company.id === 0) {
      alert("Please select a company.");
      return;
    }
    if (!formData.position?.id || formData.position.id === 0) {
      alert("Please select a position.");
      return;
    }

    jobApplicationService.create(formData).then(() => {
      alert("Application created successfully!");
      navigate("/applications");
    });
  };

  return (
    <div>
      <h2>Create Job Application</h2>
      <form onSubmit={handleSubmit}>
        {/* Source info */}
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

        {/* Candidate selection */}
        <div>
          <label>Select Candidate:</label>
          <select
            value={formData.candidate?.id || ""}
            onChange={(e) => {
              const selected = candidates.find((c) => c.id === Number(e.target.value));
              setFormData({ ...formData, candidate: selected || EMPTY_CANDIDATE });
            }}
            required
          >
            <option value="">-- Choose a candidate --</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.contactInfo?.email})
              </option>
            ))}
          </select>
        </div>

        {/* Company selection */}
        <div>
          <label>Select Company:</label>
          <select
            value={formData.company?.id || ""}
            onChange={(e) => {
              const selected = companies.find((c) => c.id === Number(e.target.value));
              setFormData({ ...formData, company: selected || EMPTY_COMPANY });
            }}
            required
          >
            <option value="">-- Choose a company --</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.website})
              </option>
            ))}
          </select>
        </div>

        {/* Position selection */}
        <div>
          <label>Select Position:</label>
          <select
            value={formData.position?.id || ""}
            onChange={(e) => {
              const selected = positions.find((p) => p.id === Number(e.target.value));
              setFormData({ ...formData, position: selected || EMPTY_POSITION });
            }}
            required
          >
            <option value="">-- Choose a position --</option>
            {positions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.companyName} ({p.location})
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label>Status:</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as JobApplicationDto["status"] })
            }
          >
            <option value="APPLIED">Applied</option>
            <option value="REJECTED">Rejected</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFERED">Offered</option>
          </select>
        </div>

        <button type="submit">Save Application</button>
      </form>

      {/* Back to Applications List */}
      <div style={{ marginTop: "10px" }}>
        <Link to="/applications">⬅️ Back to Applications List</Link>
      </div>
    </div>
  );
}