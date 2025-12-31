import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCandidateById } from "../../services/candidateService";
import { CandidateDto } from "../../types/candidate";

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<CandidateDto | null>(null);

  useEffect(() => {
    if (!id) return;
    getCandidateById(Number(id))
      .then((data) => setCandidate(data))
      .catch((err) => console.error("Error fetching candidate:", err));
  }, [id]);

  if (!candidate) return <p>Loading...</p>;

  return (
    <div>
      <h2>{candidate.fullName}</h2>
      <ul>
        <li><strong>Email:</strong> {candidate.email || "N/A"}</li>
        <li><strong>Phone:</strong> {candidate.phone || "N/A"}</li>
      </ul>
    </div>
  );
}