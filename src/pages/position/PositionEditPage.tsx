// src/pages/PositionEditPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { positionService } from "../../services/positionService";
import { PositionDto } from "../../types/position";

export default function PositionEditPage() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<PositionDto>({
    id: 0,
    title: "",
    location: "",
    description: "",
    companyName: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      positionService.getById(Number(id)).then((pos) => setFormData(pos));
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    positionService.update(Number(id), formData).then(() => {
      alert("Position updated successfully!");
      navigate("/positions");
    });
  };

  return (
    <div>
      <h2>Edit Position</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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