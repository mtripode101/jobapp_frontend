import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCompanies, deleteCompany } from "../services/companyService";
import { CompanyDto } from "../types/company";

export default function CompaniesListPage() {
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadCompanies = useCallback(() => {
    setLoading(true);
    setError(null);
    getCompanies()
      .then((data) => setCompanies(data))
      .catch(() => setError("Failed to load companies"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    deleteCompany(id)
      .then(() => {
        setSuccessMessage("Company deleted successfully");
        loadCompanies();
      })
      .catch(() => setError("Failed to delete company"));
  };

  return (
    <div>
      <h2>Companies</h2>
      <Link to="/companies/new">➕ Add Company</Link>

      {loading && <p>Loading companies...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {!loading && !error && (
        <ul>
          {companies.length === 0 ? (
            <li>No companies found</li>
          ) : (
            companies.map((c) => (
              <li key={c.id}>
                <Link to={`/companies/${c.id}`}>{c.name}</Link>
                <button onClick={() => handleDelete(c.id!)} disabled={loading}>
                  🗑️ Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}