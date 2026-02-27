// src/pages/PositionListPage.tsx
import React, { useEffect, useState } from "react";
import { positionService } from "../../services/positionService";
import { PositionDto } from "../../types/position";
import { Link } from "react-router-dom";

export default function PositionListPage() {
  const [positions, setPositions] = useState<PositionDto[]>([]);

  useEffect(() => {
    positionService.getPositions().then(setPositions);
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      await positionService.delete(id);
      setPositions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <h2>Positions</h2>

      {/* 🔗 Navigation */}
      <Link to="/positions/new">➕ Create Position</Link>

      <table border={1} style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Location</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos) => (
            <tr key={pos.id}>
              <td>{pos.id}</td>
              <td>{pos.title}</td>
              <td>{pos.location}</td>
              <td>{pos.companyName}</td>
              <td>
                <Link to={`/positions/${pos.id}`}>🔍 Detail</Link> |{" "}
                <Link to={`/positions/${pos.id}/edit`}>✏️ Edit</Link> |{" "}
                <button
                  onClick={() => handleDelete(pos.id!)}
                  style={{ color: "red", cursor: "pointer" }}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
