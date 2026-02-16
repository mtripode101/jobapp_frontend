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
import { useDebounce } from "../utils/useDebounce";

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

  // Local filter inputs
  const [candidateQuery, setCandidateQuery] = useState("");
  const [companyQuery, setCompanyQuery] = useState("");
  const [positionQuery, setPositionQuery] = useState("");

  const debouncedCandidate = useDebounce(candidateQuery, 200);
  const debouncedCompany = useDebounce(companyQuery, 200);
  const debouncedPosition = useDebounce(positionQuery, 200);

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
          alert(`This Job ID (${formData.jobId}) already exists. Please use another.`);
        } else if (err.response?.status === 400) {
          alert(err.response?.data?.message || "Invalid request data");
        } else {
          alert(err?.message || "Failed to create application");
        }
      });
  };

  // Local filtering logic
  const filteredCandidates = candidates.filter((c) =>
    `${c.fullName} ${c.email || ""}`.toLowerCase().includes(debouncedCandidate.toLowerCase())
  );

  const filteredCompanies = companies.filter((c) =>
    `${c.name} ${c.website || ""}`.toLowerCase().includes(debouncedCompany.toLowerCase())
  );

  const filteredPositions = positions.filter((p) =>
    `${p.title} ${p.companyName} ${p.location}`.toLowerCase().includes(debouncedPosition.toLowerCase())
  );

  const selectCandidate = (c: CandidateDto) => {
    setFormData({ ...formData, candidate: c });
    setCandidateQuery(`${c.fullName} (${c.email || "N/A"})`);
  };

  const selectCompany = (c: CompanyDto) => {
    setFormData({ ...formData, company: c });
    setCompanyQuery(`${c.name}`);
  };

  const selectPosition = (p: PositionDto) => {
    setFormData({ ...formData, position: p });
    setPositionQuery(`${p.title} - ${p.companyName}`);
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

        {/* Candidate selection (local filter) */}
        <div>
          <label>Select Candidate:</label>
          <input
            type="text"
            value={candidateQuery}
            onChange={(e) => {
              setCandidateQuery(e.target.value);
              // clear selection if user edits query
              if (formData.candidate?.id) setFormData({ ...formData, candidate: EMPTY_CANDIDATE });
            }}
            placeholder="Type to filter candidates by name or email"
            aria-label="Search candidates"
          />
          <div>
            <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: 160, overflowY: "auto" }}>
              {filteredCandidates.slice(0, 10).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => selectCandidate(c)}
                    style={{ display: "block", width: "100%", textAlign: "left" }}
                  >
                    {c.fullName} ({c.email || "N/A"})
                  </button>
                </li>
              ))}
            </ul>
            {debouncedCandidate && filteredCandidates.length === 0 && <small>No candidates found.</small>}
          </div>
        </div>

        {/* Company selection (local filter) */}
        <div>
          <label>Select Company:</label>
          <input
            type="text"
            value={companyQuery}
            onChange={(e) => {
              setCompanyQuery(e.target.value);
              if (formData.company?.id) setFormData({ ...formData, company: EMPTY_COMPANY });
            }}
            placeholder="Type to filter companies by name or website"
            aria-label="Search companies"
          />
          <div>
            <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: 160, overflowY: "auto" }}>
              {filteredCompanies.slice(0, 10).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => selectCompany(c)}
                    style={{ display: "block", width: "100%", textAlign: "left" }}
                  >
                    {c.name} ({c.website || "N/A"})
                  </button>
                </li>
              ))}
            </ul>
            {debouncedCompany && filteredCompanies.length === 0 && <small>No companies found.</small>}
          </div>
        </div>

        {/* Position selection (local filter) */}
        <div>
          <label>Select Position:</label>
          <input
            type="text"
            value={positionQuery}
            onChange={(e) => {
              setPositionQuery(e.target.value);
              if (formData.position?.id) setFormData({ ...formData, position: EMPTY_POSITION });
            }}
            placeholder="Type to filter positions by title, company or location"
            aria-label="Search positions"
          />
          <div>
            <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: 160, overflowY: "auto" }}>
              {filteredPositions.slice(0, 10).map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => selectPosition(p)}
                    style={{ display: "block", width: "100%", textAlign: "left" }}
                  >
                    {p.title} - {p.companyName} ({p.location})
                  </button>
                </li>
              ))}
            </ul>
            {debouncedPosition && filteredPositions.length === 0 && <small>No positions found.</small>}
          </div>
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