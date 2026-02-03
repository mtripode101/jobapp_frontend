// src/pages/JobApplicationDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";
import { InterviewDto } from "../../types/interviewDto";
import { JobOfferDto } from "../../types/jobOfferDto";

export default function JobApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<JobApplicationDto | null>(null);

  useEffect(() => {
    if (id) {
      jobApplicationService.getById(Number(id)).then(setApplication);
    }
  }, [id]);

  if (!application) return <p>Loading...</p>;

  return (
    <div>
      <h2>Application Detail</h2>
      <p><strong>JobID:</strong> {application.jobId}</p>
      <p><strong>Candidate:</strong> {application.candidate?.fullName}</p>
      <p><strong>Company:</strong> {application.company?.name}</p>
      <p><strong>Position:</strong> {application.position?.title} - {application.position.location}</p>
      <p><strong>Status:</strong> {application.status}</p>
      <p><strong>Description:</strong> {application.description}</p>
      <p><strong>Source Link:</strong> {application.sourceLink}</p>
      <p><strong>Date Applied:</strong> {application.dateApplied}</p>

      {/* 🔹 Interviews linked to this application */}
      <div style={{ marginTop: "20px" }}>
        <h3>Interviews</h3>
        {application.interviews && application.interviews.length > 0 ? (
          <ul>
            {application.interviews.map((iv: InterviewDto) => (
              <li key={iv.id}>
                {new Date(iv.scheduledAt).toLocaleString()} — {iv.type}
                {iv.feedback && <span> | Feedback: {iv.feedback}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No interviews linked to this application</p>
        )}
      </div>

      {/* 🔹 Offers linked to this application */}
      <div style={{ marginTop: "20px" }}>
        <h3>Job Offers</h3>
        {application.offers && application.offers.length > 0 ? (
          <ul>
            {application.offers.map((offer: JobOfferDto) => (
              <li key={offer.id}>
                Offered At: {new Date(offer.offeredAt).toLocaleDateString()} — Status: {offer.status}
                {offer.expectedSalary !== null && <span> | Expected: {offer.expectedSalary}</span>}
                {offer.offeredSalary !== null && <span> | Offered: {offer.offeredSalary}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No offers linked to this application</p>
        )}
      </div>

      <Link to="/applications">⬅ Back to List</Link>
    </div>
  );
}