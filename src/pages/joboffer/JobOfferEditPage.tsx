// src/pages/joboffer/JobOfferEditPage.tsx
import React, { useEffect, useMemo, useState } from "react";
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

  // 🔎 New: search input + dropdown state
  const [appQuery, setAppQuery] = useState<string>("");
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState<boolean>(false);

  const appLabel = (app: JobApplicationDto) =>
    `${app.id ?? "?"} - ${app.candidate?.fullName ?? "Candidate"} (${app.jobId ?? "jobId"})`;

  // Load offer
  useEffect(() => {
    if (!id) return;

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
  }, [id]);

  // Load applications
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

  // Sync the search input with the currently selected applicationId
  useEffect(() => {
    if (loadingApps || !offer) return;

    const selected = applications.find((a) => a.id === offer.applicationId);
    if (selected) setAppQuery(appLabel(selected));
    else if (!offer.applicationId) setAppQuery("");
    // If applicationId exists but we couldn't find it (maybe filtered out / missing),
    // we leave whatever is in the input (or blank).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingApps, offer?.applicationId, applications]);

  const filteredApplications = useMemo(() => {
    const q = appQuery.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((app) => appLabel(app).toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications, appQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer || !id) return;

    if (!offer.applicationId) {
      alert("Please select a job application");
      return;
    }

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
        <div style={{ position: "relative" }}>
          <label>Application:</label>

          {loadingApps ? (
            <p>Loading applications...</p>
          ) : (
            <>
              <input
                type="text"
                value={appQuery}
                placeholder="Type to search job applications..."
                required
                onChange={(e) => {
                  const v = e.target.value;
                  setAppQuery(v);
                  setIsAppDropdownOpen(true);

                  // Clear selection while typing so you don't submit a stale id
                  handleChange("applicationId", undefined);
                }}
                onFocus={() => setIsAppDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsAppDropdownOpen(false), 150)}
                style={{ width: "100%", padding: "8px" }}
              />

              {isAppDropdownOpen && filteredApplications.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: 240,
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    background: "#fff",
                    zIndex: 10,
                  }}
                >
                  {filteredApplications
                    // ✅ IMPORTANT: your JobApplicationDto.id is number | undefined, so we narrow it here
                    .filter(
                      (app): app is JobApplicationDto & { id: number } =>
                        typeof app.id === "number"
                    )
                    .slice(0, 50)
                    .map((app) => (
                      <div
                        key={app.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          handleChange("applicationId", app.id);
                          setAppQuery(appLabel(app));
                          setIsAppDropdownOpen(false);
                        }}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {appLabel(app)}
                      </div>
                    ))}
                </div>
              )}

              {isAppDropdownOpen &&
                appQuery.trim() !== "" &&
                filteredApplications.length === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      border: "1px solid #ccc",
                      background: "#fff",
                      zIndex: 10,
                      padding: "8px",
                    }}
                  >
                    No results.
                  </div>
                )}
            </>
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
            onChange={(e) =>
              handleChange(
                "expectedSalary",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            placeholder="Enter expected salary"
          />
        </div>

        <div>
          <label>Offered Salary:</label>
          <input
            type="number"
            value={offer.offeredSalary ?? ""}
            onChange={(e) =>
              handleChange(
                "offeredSalary",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            placeholder="Enter offered salary"
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate(-1)}>⬅️ Back to Previous Page</button>
      </div>
    </div>
  );
}