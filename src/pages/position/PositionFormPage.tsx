// src/pages/PositionFormPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { positionService } from "../../services/positionService";
import { PositionDto } from "../../types/position";

export default function PositionFormPage() {
  const [formData, setFormData] = useState<PositionDto>({
    title: "",
    location: "",
    description: "",
    companyName: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    positionService.create(formData).then(() => {
      alert("Position created successfully!");
      navigate("/positions");
    });
  };

  return (
    <div>
      <h2>Create Position</h2>
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
        <button type="submit">Save Position</button>
      </form>
    </div>
  );
}