import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanies, deleteCompany } from "../services/companyService";

export default function CompaniesListPage() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    getCompanies()
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    deleteCompany(id)
      .then(() => loadCompanies())
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Companies</h2>
      <Link to="/companies/new">➕ Add Company</Link>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>
            <Link to={`/companies/${c.id}`}>{c.name}</Link>
            <button onClick={() => handleDelete(c.id)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}