import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCandidates, deleteCandidate } from "../../services/candidateService";
import { CandidateDto } from "../../types/candidate";

export default function CandidateListPage() {
  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Record<number, boolean>>({});

  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 4000);
  };

  const loadCandidates = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCandidates()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) setCandidates(data);
        else if ((data as any)?.content) setCandidates((data as any).content);
        else setCandidates([]);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setError(err?.message || "Failed to load candidates");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const cleanup = loadCandidates();
    return cleanup;
  }, [loadCandidates]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    setDeletingIds((s) => ({ ...s, [id]: true }));
    const previous = candidates;
    setCandidates((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteCandidate(id);
      setSuccessMessage("Candidate deleted successfully");
      clearMessages();
    } catch (err: any) {
      setCandidates(previous);
      setError(err?.message || "Failed to delete candidate");
      clearMessages();
    } finally {
      setDeletingIds((s) => { const copy = { ...s }; delete copy[id]; return copy; });
    }
  };

  return (
    <div>
      <h2>Candidates</h2>
      <div style={{ marginBottom: 12 }}>
        <Link to="/">🏠 Back to Home</Link> | <Link to="/candidates/new">➕ Add Candidate</Link>
      </div>

      {loading && <p role="status">Loading candidates...</p>}
      {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
      {successMessage && <p role="status" style={{ color: "green" }}>{successMessage}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Email</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Phone</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>LinkedIn</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>GitHub</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 8 }}>No candidates found</td></tr>
            ) : (
              candidates.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: 8 }}><Link to={`/candidates/${c.id}`}>{c.fullName}</Link></td>
                  <td style={{ padding: 8 }}>{c.email || "N/A"}</td>
                  <td style={{ padding: 8 }}>{c.phone || "N/A"}</td>
                  <td style={{ padding: 8 }}>
                    {c.linkedIn ? <a href={c.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a> : "N/A"}
                  </td>
                  <td style={{ padding: 8 }}>
                    {c.github ? <a href={c.github} target="_blank" rel="noopener noreferrer">GitHub</a> : "N/A"}
                  </td>
                  <td style={{ padding: 8 }}>
                    <Link to={`/candidates/${c.id}/edit`} style={{ marginRight: 8 }}>✏️ Edit</Link>
                    <button onClick={() => handleDelete(c.id!)} disabled={!!deletingIds[c.id!] || loading}>
                      {deletingIds[c.id!] ? "Deleting…" : "🗑️ Delete"}
                    </button>
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