import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../../services/companyService";
import { CompanyDto } from "../../types/company";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyDto | null>(null);

  useEffect(() => {
    if (!id) return;
    const companyId = Number(id);

    getCompanyById(companyId)
      .then((data) => setCompany(data)) // ✅ ya devuelve el objeto CompanyDto
      .catch((err) => console.error("Error fetching company:", err));
  }, [id]);

  if (!company) return <p>Loading...</p>;

  return (
    <div>
      <h2>{company.name}</h2>
      <ul>
        {/* industry no está en tu DTO, puedes quitarlo o agregarlo en backend */}
        <li><strong>Website:</strong> {company.website || "N/A"}</li>
        <li><strong>Description:</strong> {company.description || "N/A"}</li>
      </ul>
    </div>
  );
}