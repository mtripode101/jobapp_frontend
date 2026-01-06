// src/pages/JobApplicationDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { jobApplicationService } from "../../services/jobApplicationService";
import { JobApplicationDto } from "../../types/jobApplicationDto";

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
      <p><strong>ID:</strong> {application.id}</p>
      <p><strong>Candidate:</strong> {application.candidate?.fullName}</p>
      <p><strong>Company:</strong> {application.company?.name}</p>
      <p><strong>Position:</strong> {application.position?.title}</p>
      <p><strong>Status:</strong> {application.status}</p>
      <p><strong>Description:</strong> {application.description}</p>
      <p><strong>Source Link:</strong> {application.sourceLink}</p>

      <Link to="/applications">⬅ Back to List</Link>
    </div>
  );
}