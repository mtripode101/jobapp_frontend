// src/pages/companies/CompaniesListPage.tsx
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

  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 4000);
  };

  const loadCompanies = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCompanies()
      .then((data) => {
        if (cancelled) return;
        // compatibilidad: si getCompanies devuelve paged response, intentar extraer content
        if (Array.isArray(data)) {
          setCompanies(data);
        } else if ((data as any)?.content) {
          setCompanies((data as any).content);
        } else {
          setCompanies([]);
        }
      })
      .catch((err: any) => {
        if (cancelled) return;
        const msg = err?.message || "Failed to load companies";
        setError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cleanup = loadCompanies();
    return cleanup;
  }, [loadCompanies]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    // Optimistic UI: marcar como borrando y quitar de la lista localmente
    setDeletingIds((s) => ({ ...s, [id]: true }));
    const previous = companies;
    setCompanies((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteCompany(id);
      setSuccessMessage("Company deleted successfully");
      clearMessages();
    } catch (err: any) {
      // revertir en caso de error
      setCompanies(previous);
      const msg = err?.message || "Failed to delete company";
      setError(msg);
      clearMessages();
    } finally {
      setDeletingIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    }
  };

  return (
    <div>
      <h2>Companies</h2>

      <div style={{ marginBottom: 12 }}>
        <Link to="/">🏠 Back to Home</Link> | <Link to="/companies/new">➕ Add Company</Link>
      </div>

      {loading && (
        <p role="status" aria-live="polite">
          Loading companies...
        </p>
      )}

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
        <ul>
          {companies.length === 0 ? (
            <li>No companies found</li>
          ) : (
            companies.map((c) => (
              <li key={c.id} style={{ marginBottom: 8 }}>
                <Link to={`/companies/${c.id}`}>{c.name}</Link>{" "}
                <Link to={`/companies/${c.id}/edit`} style={{ marginLeft: 8 }}>
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(c.id!)}
                  disabled={!!deletingIds[c.id!] || loading}
                  aria-disabled={!!deletingIds[c.id!] || loading}
                  style={{ marginLeft: 8 }}
                >
                  {deletingIds[c.id!] ? "Deleting…" : "🗑️ Delete"}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}