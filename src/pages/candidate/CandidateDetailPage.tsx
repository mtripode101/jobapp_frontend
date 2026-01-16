import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCandidateById } from "../../services/candidateService";
import { CandidateDto } from "../../types/candidate";

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<CandidateDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const candidateId = Number(id);
    if (isNaN(candidateId)) {
      setError("Invalid id");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getCandidateById(candidateId)
      .then((data) => { if (!cancelled) setCandidate(data); })
      .catch((err) => { if (!cancelled) setError(err?.message || "Error fetching candidate"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!candidate) return <p>Candidate not found</p>;

  return (
    <div>
      <h2>{candidate.fullName}</h2>
      <ul>
        <li><strong>Email:</strong> {candidate.email || "N/A"}</li>
        <li><strong>Phone:</strong> {candidate.phone || "N/A"}</li>
        <li><strong>LinkedIn:</strong> {candidate.linkedIn || "N/A"}</li>
        <li><strong>GitHub:</strong> {candidate.github || "N/A"}</li>
      </ul>

      <div style={{ marginTop: "10px" }}>
        <Link to="/candidates">⬅️ Back to Candidates</Link>
      </div>
    </div>
  );
}