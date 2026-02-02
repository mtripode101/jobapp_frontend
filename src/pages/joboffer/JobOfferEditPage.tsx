// src/pages/joboffer/JobOfferEditPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobOfferService } from "../../services/jobOfferService";
import { JobOfferDto } from "../../types/jobOfferDto";

export default function JobOfferEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [offer, setOffer] = useState<JobOfferDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      jobOfferService
        .getById(Number(id))
        .then((data) => {
          setOffer(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load job offer");
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (field: keyof JobOfferDto, value: any) => {
    if (!offer) return;
    setOffer({ ...offer, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer || !id) return;

    jobOfferService
      .update(Number(id), offer)
      .then(() => {
        alert("Offer updated successfully!");
        navigate("/job-offers");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to update job offer");
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!offer) return <p>No offer found</p>;

  return (
    <div>
      <h2>Edit Job Offer #{offer.id}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Application ID:</label>
          <input
            type="number"
            value={offer.applicationId ?? ""}
            onChange={(e) => handleChange("applicationId", Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Offered At:</label>
          <input
            type="date"
            value={offer.offeredAt ? offer.offeredAt.substring(0, 10) : ""}
            onChange={(e) => handleChange("offeredAt", e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={offer.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div>
          <label>Expected Salary:</label>
          <input
            type="number"
            value={offer.expectedSalary ?? ""}
            onChange={(e) => handleChange("expectedSalary", Number(e.target.value))}
            placeholder="Enter expected salary"
          />
        </div>
        <div>
          <label>Offered Salary:</label>
          <input
            type="number"
            value={offer.offeredSalary ?? ""}
            onChange={(e) => handleChange("offeredSalary", Number(e.target.value))}
            placeholder="Enter offered salary"
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>

      {/* 🔙 Back to previous page */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate(-1)}>⬅️ Back to Previous Page</button>
      </div>
    </div>
  );
}