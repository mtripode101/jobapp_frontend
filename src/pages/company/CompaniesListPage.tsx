import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCompanies,
  deleteCompany,
  getCompanyByName,
} from "../../services/companyService";
import { CompanyDto } from "../../types/company";

export default function CompaniesListPage() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Generic inline error message (used for non-500 errors and loading issues)
  const [error, setError] = useState<string | null>(null);

  // Success message shown after a successful deletion
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tracks which company IDs are currently being deleted (for disabling buttons)
  const [deletingIds, setDeletingIds] = useState<Record<number, boolean>>({});

  // Local filter input for searching by company name (client-side filtering)
  const [filter, setFilter] = useState<string>("");

  // Result returned by remote search endpoint
  const [remoteCompany, setRemoteCompany] = useState<CompanyDto | null>(null);

  /**
   * Loads companies from the backend and populates state.
   * Handles both plain arrays and paginated responses that include "content".
   */
  const loadCompanies = useCallback(() => {
    setLoading(true);
    setError(null);

    getCompanies()
      .then((data) => {
        if (Array.isArray(data)) {
          setCompanies(data);
        } else if ((data as any)?.content) {
          setCompanies((data as any).content);
        } else {
          setCompanies([]);
        }
      })
      .catch((err: any) => {
        setError(err?.message || "Failed to load companies");
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Initial load on component mount.
   */
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  /**
   * Deletes a company.
   *
   * Behavior:
   * - Asks for user confirmation
   * - Optimistically removes company from the UI
   * - If backend deletion fails:
   *    • Restores the previous list
   *    • If HTTP 500: shows a popup, and after OK goes back to /companies and reloads the list
   *    • Otherwise shows inline error message
   */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    setDeletingIds((s) => ({ ...s, [id]: true }));

    // Optimistic update: remove from UI before backend confirms
    const previous = [...companies];
    setCompanies((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteCompany(id);

      setSuccessMessage("Company deleted successfully");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      // Restore list if delete fails
      setCompanies(previous);

      // If your service throws the "clean" error (recommended),
      // it should have err.status and err.message.
      const status = err?.status;
      const msg = err?.message || "The company could not be deleted.";

      // For HTTP 500: show popup and then return to listing
      if (status === 500) {
        // window.alert blocks execution until user clicks OK
        window.alert(msg);

        // Reset UI state so the user is back to a clean listing
        setRemoteCompany(null);
        setFilter("");
        setError(null);
        setSuccessMessage(null);

        // Reload list from backend and navigate to the listing route
        loadCompanies();
        navigate("/companies", { replace: true });
        return;
      }

      // For other status codes: show inline message
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } finally {
      // Re-enable the delete button for this item
      setDeletingIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    }
  };

  /**
   * Client-side filtering by company name.
   */
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  /**
   * Remote search by company name (server-side).
   */
  const handleSearchRemote = async () => {
    if (!filter.trim()) return;

    try {
      const company = await getCompanyByName(filter);
      setRemoteCompany(company);
      setError(null);
    } catch (err: any) {
      setRemoteCompany(null);
      setError(err?.message || "Company not found");
    }
  };

  return (
    <div>
      <h2>Companies</h2>

      <div style={{ marginBottom: 12 }}>
        <Link to="/">🏠 Back to Home</Link> |{" "}
        <Link to="/companies/new">➕ Add Company</Link>
      </div>

      {/* Local name filter + optional remote server search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Filter by company name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
        <button
          onClick={handleSearchRemote}
          style={{
            marginLeft: "8px",
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          🔍 Search in server
        </button>
      </div>

      {loading && <p>Loading companies...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {/* Remote search result */}
      {remoteCompany && (
        <div style={{ marginTop: 12, padding: "8px", border: "1px solid #ccc" }}>
          <strong>Found in server:</strong> {remoteCompany.name}
          <Link to={`/companies/${remoteCompany.id}`} style={{ marginLeft: 8 }}>
            View
          </Link>
        </div>
      )}

      {!loading && !error && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "16px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: "center", padding: "12px" }}>
                  No companies found
                </td>
              </tr>
            ) : (
              filteredCompanies.map((c) => (
                <tr key={c.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <Link to={`/companies/${c.id}`}>{c.name}</Link>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <Link to={`/companies/${c.id}/edit`} style={{ marginRight: 8 }}>
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id!)}
                      disabled={!!deletingIds[c.id!] || loading}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
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