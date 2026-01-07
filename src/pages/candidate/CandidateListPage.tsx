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

      {/* 🔗 Link back to Home */}
      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/candidates/new">➕ Add Candidate</Link>

      {loading && <p>Loading candidates...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Email</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Phone</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>LinkedIn</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>GitHub</th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={6}>No candidates found</td>
              </tr>
            ) : (
              candidates.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/candidates/${c.id}`}>{c.fullName}</Link>
                  </td>
                  <td>{c.contactInfo?.email || "N/A"}</td>
                  <td>{c.contactInfo?.phone || "N/A"}</td>
                  <td>
                    {c.contactInfo?.linkedIn ? (
                      <a href={c.contactInfo.linkedIn} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {c.contactInfo?.github ? (
                      <a href={c.contactInfo.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(c.id!)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}