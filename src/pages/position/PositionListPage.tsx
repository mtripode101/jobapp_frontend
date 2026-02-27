// src/pages/PositionListPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { positionService } from "../../services/positionService";
import { PositionDto } from "../../types/position";

export default function PositionListPage() {
  const [positions, setPositions] = useState<PositionDto[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  useEffect(() => {
    positionService.getPositions().then(setPositions);
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      await positionService.delete(id);
      setPositions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filteredPositions = positions.filter((pos) => {
    const title = pos.title?.toLowerCase() || "";
    const location = pos.location?.toLowerCase() || "";
    const company = pos.companyName?.toLowerCase() || "";

    return (
      title.includes(titleFilter.toLowerCase()) &&
      location.includes(locationFilter.toLowerCase()) &&
      company.includes(companyFilter.toLowerCase())
    );
  });

  return (
    <div>
      <h2>Positions</h2>

      <Link to="/positions/new">Create Position</Link>

      <div style={{ margin: "12px 0" }}>
        <input
          type="text"
          placeholder="Filter by title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Filter by company"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
        />
      </div>

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
          {filteredPositions.length === 0 ? (
            <tr>
              <td colSpan={5}>No positions found</td>
            </tr>
          ) : (
            filteredPositions.map((pos) => (
              <tr key={pos.id}>
                <td>{pos.id}</td>
                <td>{pos.title}</td>
                <td>{pos.location}</td>
                <td>{pos.companyName}</td>
                <td>
                  <Link to={`/positions/${pos.id}`}>Detail</Link> |{" "}
                  <Link to={`/positions/${pos.id}/edit`}>Edit</Link> |{" "}
                  <button
                    onClick={() => handleDelete(pos.id!)}
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
