// src/pages/JobOfferListPage.tsx
import React, { useEffect, useState } from "react";
import { jobOfferService } from "../../services/jobOfferService";
import { JobOfferDto } from "../../types/jobOfferDto";
import { Link } from "react-router-dom";

export default function JobOfferListPage() {
  const [offers, setOffers] = useState<JobOfferDto[]>([]);

  useEffect(() => {
    jobOfferService.getAll().then(setOffers);
  }, []);

  return (
    <div>
      <h2>Job Offers</h2>
      <Link to="/job-offers/new">➕ Create Offer</Link>
      <table border={1} style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Application</th>
            <th>Offered At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id}>
              <td>{offer.id}</td>
              <td>{offer.applicationId}</td>
              <td>{offer.offeredAt}</td>
              <td>{offer.status}</td>
              <td>
                <Link to={`/job-offers/${offer.id}`}>🔍 Detail</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}