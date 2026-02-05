// src/pages/joboffer/JobOfferEditPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobOfferService } from "../../services/jobOfferService";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobOfferDto } from "../../types/jobOfferDto";
import { JobApplicationDto } from "../../types/jobApplicationDto";

export default function JobOfferEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [offer, setOffer] = useState<JobOfferDto | null>(null);
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingApps, setLoadingApps] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar la oferta
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

  // Cargar aplicaciones disponibles
  useEffect(() => {
    jobApplicationService
      .getAll()
      .then((data) => setApplications(data))
      .catch((err) => {
        console.error("Error loading applications", err);
        alert("Failed to load applications");
      })
      .finally(() => setLoadingApps(false));
  }, []);

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
          <label>Application:</label>
          {loadingApps ? (
            <p>Loading applications...</p>
          ) : (
            <select
              value={offer.applicationId ?? ""}
              onChange={(e) => handleChange("applicationId", Number(e.target.value))}
              required
            >
              <option value="">-- Select Application --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} - {app.candidate.fullName} ({app.jobId})
                </option>
              ))}
            </select>
          )}
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