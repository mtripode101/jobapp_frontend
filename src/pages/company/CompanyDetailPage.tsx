import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCompanyById } from "../../services/companyService";
import { CompanyDto } from "../../types/company";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyDto | null>(null);

  useEffect(() => {
    if (!id) return;
    const companyId = Number(id);

    getCompanyById(companyId)
      .then((data) => setCompany(data)) // ✅ returns CompanyDto
      .catch((err) => console.error("Error fetching company:", err));
  }, [id]);

  if (!company) return <p>Loading...</p>;

  return (
    <div>
      <h2>{company.name}</h2>
      <ul>
        <li><strong>Website:</strong> {company.website || "N/A"}</li>
        <li><strong>Description:</strong> {company.description || "N/A"}</li>
      </ul>

      {/* 🔗 Link back to Companies list */}
      <div style={{ marginTop: "10px" }}>
        <Link to="/companies">⬅️ Back to Companies</Link>
      </div>
    </div>
  );
}