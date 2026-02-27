// src/pages/PositionListPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { positionService } from "../../services/positionService";
import { PositionDto } from "../../types/position";

type SortDirection = "asc" | "desc";
type SortKey = "title" | "location" | "company";

export default function PositionListPage() {
  const [positions, setPositions] = useState<PositionDto[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

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

  const sortedPositions = useMemo(() => {
    if (!sortConfig) return filteredPositions;
    const sorted = [...filteredPositions];
    sorted.sort((a, b) => {
      const valueA = (() => {
        switch (sortConfig.key) {
          case "title":
            return a.title || "";
          case "location":
            return a.location || "";
          case "company":
            return a.companyName || "";
        }
      })();
      const valueB = (() => {
        switch (sortConfig.key) {
          case "title":
            return b.title || "";
          case "location":
            return b.location || "";
          case "company":
            return b.companyName || "";
        }
      })();
      const result = String(valueA).localeCompare(String(valueB), undefined, { sensitivity: "base" });
      return sortConfig.direction === "asc" ? result : -result;
    });
    return sorted;
  }, [filteredPositions, sortConfig]);

  const arrowStyle = (key: SortKey, direction: SortDirection): React.CSSProperties => ({
    marginLeft: 6,
    padding: "2px 6px",
    fontSize: 11,
    lineHeight: 1,
    fontWeight: sortConfig?.key === key && sortConfig.direction === direction ? 700 : 400,
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
            <th>
              Title
              <button type="button" onClick={() => setSortConfig({ key: "title", direction: "asc" })} style={arrowStyle("title", "asc")}>
                {"\u25B2"}
              </button>
              <button type="button" onClick={() => setSortConfig({ key: "title", direction: "desc" })} style={arrowStyle("title", "desc")}>
                {"\u25BC"}
              </button>
            </th>
            <th>
              Location
              <button type="button" onClick={() => setSortConfig({ key: "location", direction: "asc" })} style={arrowStyle("location", "asc")}>
                {"\u25B2"}
              </button>
              <button type="button" onClick={() => setSortConfig({ key: "location", direction: "desc" })} style={arrowStyle("location", "desc")}>
                {"\u25BC"}
              </button>
            </th>
            <th>
              Company
              <button type="button" onClick={() => setSortConfig({ key: "company", direction: "asc" })} style={arrowStyle("company", "asc")}>
                {"\u25B2"}
              </button>
              <button type="button" onClick={() => setSortConfig({ key: "company", direction: "desc" })} style={arrowStyle("company", "desc")}>
                {"\u25BC"}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedPositions.length === 0 ? (
            <tr>
              <td colSpan={5}>No positions found</td>
            </tr>
          ) : (
            sortedPositions.map((pos) => (
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
