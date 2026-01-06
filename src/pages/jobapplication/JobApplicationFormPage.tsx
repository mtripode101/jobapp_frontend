// src/pages/JobApplicationFormPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";

export default function JobApplicationFormPage() {
  const [formData, setFormData] = useState<JobApplicationDto>({
    sourceLink: "",
    websiteSource: "",
    description: "",
    candidate: { fullName: "", email: "" },
    company: { name: "", website: "", description: "" },
    position: { title: "", location: "", description: "", companyName: "" },
    status: "APPLIED",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    jobApplicationService.create(formData).then(() => {
      alert("Application created successfully!");
      navigate("/applications");
    });
  };

  return (
    <div>
      <h2>Create Job Application</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Candidate Name:</label>
          <input
            type="text"
            value={formData.candidate.fullName}
            onChange={(e) =>
              setFormData({ ...formData, candidate: { ...formData.candidate, fullName: e.target.value } })
            }
          />
        </div>
        <div>
          <label>Candidate Email:</label>
          <input
            type="email"
            value={formData.candidate.email}
            onChange={(e) =>
              setFormData({ ...formData, candidate: { ...formData.candidate, email: e.target.value } })
            }
          />
        </div>
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            value={formData.company.name}
            onChange={(e) =>
              setFormData({ ...formData, company: { ...formData.company, name: e.target.value } })
            }
          />
        </div>
        <div>
          <label>Company Website:</label>
          <input
            type="text"
            value={formData.company.website}
            onChange={(e) =>
              setFormData({ ...formData, company: { ...formData.company, website: e.target.value } })
            }
          />
        </div>
        <div>
          <label>Position Title:</label>
          <input
            type="text"
            value={formData.position.title}
            onChange={(e) =>
              setFormData({ ...formData, position: { ...formData.position, title: e.target.value } })
            }
          />
        </div>
        <div>
          <label>Position Location:</label>
          <input
            type="text"
            value={formData.position.location}
            onChange={(e) =>
              setFormData({ ...formData, position: { ...formData.position, location: e.target.value } })
            }
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
            <option value="INTERVIEW">Interview</option>
            <option value="OFFERED">Offered</option>
          </select>
        </div>
        <button type="submit">Save Application</button>
      </form>
    </div>
  );
}