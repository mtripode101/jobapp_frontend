// src/pages/JobOfferDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { jobOfferService } from "../../services/jobOfferService";
import { JobOfferDto } from "../../types/jobOfferDto";

export default function JobOfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<JobOfferDto | null>(null);

  useEffect(() => {
    if (id) {
      jobOfferService.getById(Number(id)).then(setOffer);
    }
  }, [id]);

  if (!offer) return <p>Loading...</p>;

  return (
    <div>
      <h2>Job Offer Detail</h2>
      <p><strong>ID:</strong> {offer.id}</p>
      <p><strong>Application ID:</strong> {offer.applicationId}</p>
      <p><strong>Offered At:</strong> {offer.offeredAt}</p>
      <p><strong>Status:</strong> {offer.status}</p>

      <Link to="/job-offers">⬅ Back to List</Link>
    </div>
  );
}