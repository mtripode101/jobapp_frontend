import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCompanies, deleteCompany } from "../../services/companyService";
import { CompanyDto } from "../../types/company";

export default function CompaniesListPage() {
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState<string>("");

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

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    setDeletingIds((s) => ({ ...s, [id]: true }));
    const previous = [...companies];
    setCompanies((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteCompany(id);
      setSuccessMessage("Company deleted successfully");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setCompanies(previous);
      setError(err?.message || "Failed to delete company");
      setTimeout(() => setError(null), 4000);
    } finally {
      setDeletingIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    }
  };

  // Filtrar compañías por nombre
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Companies</h2>

      <div style={{ marginBottom: 12 }}>
        <Link to="/">🏠 Back to Home</Link> |{" "}
        <Link to="/companies/new">➕ Add Company</Link>
      </div>

      {/* Filtro por nombre */}
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
      </div>

      {loading && <p>Loading companies...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

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