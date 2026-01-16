// src/pages/PositionEditPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { positionService } from "../../services/positionService";
import { getCompanies } from "../../services/companyService";
import { PositionDto } from "../../types/position";
import { CompanyDto } from "../../types/company";

export default function PositionEditPage() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<PositionDto>({
    id: 0,
    title: "",
    location: "",
    description: "",
    companyName: "",
  });
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState<boolean>(true);
  const [loadingPosition, setLoadingPosition] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    // load companies
    setLoadingCompanies(true);
    getCompanies()
      .then((data) => {
        if (!cancelled) setCompanies(Array.isArray(data) ? data : (data as any).content ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load companies:", err);
          alert("Error loading companies list");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingCompanies(false);
      });

    // load position
    if (id) {
      setLoadingPosition(true);
      positionService
        .getById(Number(id))
        .then((pos) => {
          if (cancelled) return;
          setFormData({
            id: pos.id ?? 0,
            title: pos.title ?? "",
            location: pos.location ?? "",
            description: pos.description ?? "",
            companyName: (pos as any).companyName ?? (pos as any).company?.name ?? "",
          } as PositionDto);
        })
        .catch((err) => {
          if (!cancelled) {
            console.error("Failed to load position:", err);
            alert("Error loading position");
          }
        })
        .finally(() => {
          if (!cancelled) setLoadingPosition(false);
        });
    } else {
      setLoadingPosition(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    positionService
      .update(Number(id), formData)
      .then(() => {
        alert("Position updated successfully!");
        navigate("/positions");
      })
      .catch((err) => {
        console.error("Error updating position:", err);
        alert("Error updating position");
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loadingPosition) return <p>Loading position...</p>;

  return (
    <div>
      <h2>Edit Position</h2>
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
        <button type="submit">Update Position</button>
      </form>

      {/* 🔙 Back to Positions List */}
      <div style={{ marginTop: "10px" }}>
        <Link to="/positions">⬅️ Back to Positions List</Link>
      </div>
    </div>
  );
}