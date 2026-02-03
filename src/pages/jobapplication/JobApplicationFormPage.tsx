// src/pages/JobApplicationFormPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jobApplicationService } from "../../services/jobApplicationService";
import { getCandidates } from "../../services/candidateService";
import { getCompanies } from "../../services/companyService";
import { positionService } from "../../services/positionService";
import { JobApplicationDto } from "../../types/jobApplicationDto";
import { CandidateDto } from "../../types/candidate";
import { CompanyDto } from "../../types/company";
import { PositionDto } from "../../types/position";

const EMPTY_CANDIDATE: CandidateDto = {
  id: 0,
  fullName: "",
  email: "",
  phone: undefined,
  linkedIn: undefined,
  github: undefined,
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
    jobId: "",
    sourceLink: "",
    websiteSource: "",
    description: "",
    candidate: EMPTY_CANDIDATE,
    company: EMPTY_COMPANY,
    position: EMPTY_POSITION,
    status: "APPLIED",
  } as JobApplicationDto);

  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [positions, setPositions] = useState<PositionDto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    getCandidates()
      .then((data) => {
        if (!cancelled) setCandidates(data);
      })
      .catch(() => {
        if (!cancelled) alert("Failed to load candidates");
      });

    getCompanies()
      .then((data) => {
        if (!cancelled) setCompanies(data);
      })
      .catch(() => {
        if (!cancelled) alert("Failed to load companies");
      });

    positionService
      .getPositions()
      .then((data) => {
        if (!cancelled) setPositions(data);
      })
      .catch(() => {
        if (!cancelled) alert("Failed to load positions");
      });

    return () => {
      cancelled = true;
    };
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

    jobApplicationService
      .create(formData)
      .then(() => {
        alert("Application created successfully!");
        navigate("/applications");
      })
      .catch((err: any) => {
        console.error("Failed to create application:", err);

        if (err.response?.status === 409) {
          // El backend devuelve 409 Conflict si el JobId ya existe
          alert(`This Job ID (${formData.jobId}) already exists. Please use another.`);
        } else if (err.response?.status === 400) {
          // Si decides devolver 400 Bad Request en el backend
          alert(err.response?.data?.message || "Invalid request data");
        } else {
          alert(err?.message || "Failed to create application");
        }
      });
  };

  return (
    <div>
      <h2>Create Job Application</h2>
      <form onSubmit={handleSubmit}>
        {/* Source info */}
        <div>

          <div>
            <label>Job Id:</label>
            <input
              type="text"
              value={formData.jobId}
              onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
              required
            />
          </div>

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
            value={formData.candidate?.id ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              const selected = candidates.find((c) => c.id === id) || EMPTY_CANDIDATE;
              setFormData({ ...formData, candidate: selected });
            }}
            required
          >
            <option value="">-- Choose a candidate --</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.email || "N/A"})
              </option>
            ))}
          </select>
        </div>

        {/* Company selection */}
        <div>
          <label>Select Company:</label>
          <select
            value={formData.company?.id ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              const selected = companies.find((c) => c.id === id) || EMPTY_COMPANY;
              setFormData({ ...formData, company: selected });
            }}
            required
          >
            <option value="">-- Choose a company --</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.website || "N/A"})
              </option>
            ))}
          </select>
        </div>

        {/* Position selection */}
        <div>
          <label>Select Position:</label>
          <select
            value={formData.position?.id ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              const selected = positions.find((p) => p.id === id) || EMPTY_POSITION;
              setFormData({ ...formData, position: selected });
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
            onChange={(e) => setFormData({ ...formData, status: e.target.value as JobApplicationDto["status"] })}
          >
            <option value="Applied">Applied</option>
            <option value="Rejected">Rejected</option>
            <option value="Interviewed">Interview</option>
            <option value="Offered">Offered</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Hired">Hired</option>
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