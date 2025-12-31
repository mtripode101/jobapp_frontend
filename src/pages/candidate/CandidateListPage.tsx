import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCandidates, deleteCandidate } from "../../services/candidateService";
import { CandidateDto } from "../../types/candidate";

export default function CandidateListPage() {
  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCandidates = useCallback(() => {
    setLoading(true);
    setError(null);
    getCandidates()
      .then((data) => setCandidates(data))
      .catch(() => setError("Failed to load candidates"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    deleteCandidate(id)
      .then(() => loadCandidates())
      .catch(() => setError("Failed to delete candidate"));
  };

  return (
    <div>
      <h2>Candidates</h2>
      <Link to="/candidates/new">➕ Add Candidate</Link>

      {loading && <p>Loading candidates...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {candidates.length === 0 ? (
            <li>No candidates found</li>
          ) : (
            candidates.map((c) => (
              <li key={c.id}>
                <Link to={`/candidates/${c.id}`}>{c.fullName}</Link>
                <button onClick={() => handleDelete(c.id!)}>🗑️ Delete</button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}