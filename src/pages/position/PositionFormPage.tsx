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

  // 🔎 New: company search state
  const [companyQuery, setCompanyQuery] = useState("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

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

  // Keep input text in sync if companyName changes elsewhere
  useEffect(() => {
    setCompanyQuery(formData.companyName ?? "");
  }, [formData.companyName]);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(companyQuery.toLowerCase())
  );

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

        <div style={{ position: "relative" }}>
          <label>Company:</label>

          {loadingCompanies ? (
            <p>Loading companies...</p>
          ) : (
            <>
              <input
                type="text"
                value={companyQuery}
                placeholder="Type to search..."
                required
                onChange={(e) => {
                  const v = e.target.value;
                  setCompanyQuery(v);
                  // allow typing to set companyName (fast UX; submit requires non-empty)
                  setFormData((prev) => ({ ...prev, companyName: v }));
                  setIsCompanyDropdownOpen(true);
                }}
                onFocus={() => setIsCompanyDropdownOpen(true)}
                onBlur={() => {
                  // Delay so clicks on dropdown items register before closing
                  setTimeout(() => setIsCompanyDropdownOpen(false), 150);
                }}
                style={{ width: "100%" }}
              />

              {isCompanyDropdownOpen && filteredCompanies.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: 220,
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    background: "#fff",
                    zIndex: 10,
                  }}
                >
                  {filteredCompanies.slice(0, 50).map((company) => (
                    <div
                      key={company.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setCompanyQuery(company.name);
                        setFormData((prev) => ({
                          ...prev,
                          companyName: company.name,
                        }));
                        setIsCompanyDropdownOpen(false);
                      }}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              )}

              {isCompanyDropdownOpen &&
                companyQuery.trim() !== "" &&
                filteredCompanies.length === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      border: "1px solid #ccc",
                      background: "#fff",
                      zIndex: 10,
                      padding: "8px",
                    }}
                  >
                    No results.
                  </div>
                )}
            </>
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