import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobOfferService } from "../../services/jobOfferService";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";

export default function JobOfferFormPage() {
  // Change: allow "" so we can enforce selection + avoid "0" default
  const [applicationId, setApplicationId] = useState<number | "">("");
  const [offeredAt, setOfferedAt] = useState<string>("");
  const [status, setStatus] = useState<string>("PENDING");

  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [loadingApps, setLoadingApps] = useState<boolean>(true);

  // 🔎 New: search input + dropdown state
  const [appQuery, setAppQuery] = useState<string>("");
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState<boolean>(false);

  const navigate = useNavigate();

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

  const appLabel = (app: JobApplicationDto) =>
    `${app.id ?? "?"} - ${app.candidate?.fullName ?? "Candidate"} (${app.jobId ?? "jobId"})`;

  const filteredApplications = applications.filter((app) =>
    appLabel(app).toLowerCase().includes(appQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (applicationId === "") {
      alert("Please select a job application");
      return;
    }

    jobOfferService.create(applicationId as number, offeredAt, status).then(() => {
      alert("Offer created successfully!");
      navigate("/job-offers");
    });
  };

  return (
    <div>
      <h2>Create Job Offer</h2>

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

                  // clear selection while typing to avoid stale id submit
                  setApplicationId("");
                }}
                onFocus={() => setIsAppDropdownOpen(true)}
                onBlur={() => {
                  setTimeout(() => setIsAppDropdownOpen(false), 150);
                }}
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
                    // ✅ IMPORTANT: app.id is number | undefined in your types, so we narrow it here
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
                          setApplicationId(app.id);
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
            value={offeredAt}
            onChange={(e) => setOfferedAt(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <button type="submit">Save Offer</button>
      </form>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => navigate(-1)}>⬅️ Back to Previous Page</button>
      </div>
    </div>
  );
}