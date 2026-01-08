// src/pages/PositionFormPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { positionService } from "../../services/positionService";
import { getCompanies } from "../../services/companyService";
import { PositionDto } from "../../types/position";
import { CompanyDto } from "../../types/company";

export default function PositionFormPage() {
  const [formData, setFormData] = useState<PositionDto>({
    title: "",
    location: "",
    description: "",
    companyName: "",
  });
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCompanies()
      .then((data) => {
        setCompanies(data);
      })
      .catch((err) => {
        console.error("Failed to load companies:", err);
        alert("Error loading companies list");
      })
      .finally(() => setLoadingCompanies(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    positionService
      .create(formData)
      .then(() => {
        alert("Position created successfully!");
        navigate("/positions");
      })
      .catch(() => alert("Error creating position"));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>Create Position</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Company:</label>
          {loadingCompanies ? (
            <p>Loading companies...</p>
          ) : (
            <select
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a company --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Position</button>
      </form>

      {/* 🔙 Back to positions list */}
      <div style={{ marginTop: "10px" }}>
        <Link to="/positions">⬅️ Back to Positions List</Link>
      </div>
    </div>
  );
}