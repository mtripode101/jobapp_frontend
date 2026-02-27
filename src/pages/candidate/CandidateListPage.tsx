import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { getCandidates, deleteCandidate } from "../../services/candidateService";
import { CandidateDto } from "../../types/candidate";

type SortKey = "name" | "email";
type SortDirection = "asc" | "desc";

export default function CandidateListPage() {
  const [candidates, setCandidates] = useState<CandidateDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Record<number, boolean>>({});
  const [nameFilter, setNameFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

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

    return () => {
      cancelled = true;
    };
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
      setDeletingIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) =>
      (c.fullName || "").toLowerCase().includes(nameFilter.toLowerCase())
    );
  }, [candidates, nameFilter]);

  const sortedCandidates = useMemo(() => {
    if (!sortConfig) return filteredCandidates;
    const sorted = [...filteredCandidates];
    sorted.sort((a, b) => {
      const aValue = sortConfig.key === "name" ? a.fullName || "" : a.email || "";
      const bValue = sortConfig.key === "name" ? b.fullName || "" : b.email || "";
      const result = aValue.localeCompare(bValue, undefined, { sensitivity: "base" });
      return sortConfig.direction === "asc" ? result : -result;
    });
    return sorted;
  }, [filteredCandidates, sortConfig]);

  const arrowStyle = (key: SortKey, direction: SortDirection): React.CSSProperties => ({
    marginLeft: 6,
    padding: "2px 6px",
    fontSize: 11,
    lineHeight: 1,
    fontWeight: sortConfig?.key === key && sortConfig.direction === direction ? 700 : 400,
  });

  return (
    <div>
      <h2>Candidates</h2>
      <div style={{ marginBottom: 12 }}>
        <Link to="/candidates/new">Add Candidate</Link>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      {loading && <p role="status">Loading candidates...</p>}
      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}
      {successMessage && (
        <p role="status" style={{ color: "green" }}>
          {successMessage}
        </p>
      )}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>
                Name
                <button type="button" onClick={() => setSortConfig({ key: "name", direction: "asc" })} style={arrowStyle("name", "asc")}>
                  {"\u25B2"}
                </button>
                <button type="button" onClick={() => setSortConfig({ key: "name", direction: "desc" })} style={arrowStyle("name", "desc")}>
                  {"\u25BC"}
                </button>
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>
                Email
                <button type="button" onClick={() => setSortConfig({ key: "email", direction: "asc" })} style={arrowStyle("email", "asc")}>
                  {"\u25B2"}
                </button>
                <button type="button" onClick={() => setSortConfig({ key: "email", direction: "desc" })} style={arrowStyle("email", "desc")}>
                  {"\u25BC"}
                </button>
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Phone</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>LinkedIn</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>GitHub</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCandidates.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 8 }}>
                  No candidates found
                </td>
              </tr>
            ) : (
              sortedCandidates.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: 8 }}>
                    <Link to={`/candidates/${c.id}`}>{c.fullName}</Link>
                  </td>
                  <td style={{ padding: 8 }}>{c.email || "N/A"}</td>
                  <td style={{ padding: 8 }}>{c.phone || "N/A"}</td>
                  <td style={{ padding: 8 }}>
                    {c.linkedIn ? (
                      <a href={c.linkedIn} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td style={{ padding: 8 }}>
                    {c.github ? (
                      <a href={c.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td style={{ padding: 8 }}>
                    <Link to={`/candidates/${c.id}/edit`} style={{ marginRight: 8 }}>
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(c.id!)} disabled={!!deletingIds[c.id!] || loading}>
                      {deletingIds[c.id!] ? "Deleting..." : "Delete"}
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
