// src/pages/PositionDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { positionService } from "../../services/positionService";
import { PositionDto } from "../../types/position";

export default function PositionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [position, setPosition] = useState<PositionDto | null>(null);

  useEffect(() => {
    if (id) {
      positionService.getById(Number(id)).then(setPosition);
    }
  }, [id]);

  if (!position) return <p>Loading...</p>;

  return (
    <div>
      <h2>Position Detail</h2>
      <p><strong>ID:</strong> {position.id}</p>
      <p><strong>Title:</strong> {position.title}</p>
      <p><strong>Location:</strong> {position.location}</p>
      <p><strong>Company:</strong> {position.companyName}</p>
      <p><strong>Description:</strong> {position.description}</p>

      <Link to="/positions">⬅ Back to List</Link>
    </div>
  );
}