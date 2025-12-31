import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../services/companyService";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    getCompanyById(id)
      .then((res) => setCompany(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!company) return <p>Loading...</p>;

  return (
    <div>
      <h2>{company.name}</h2>
      <ul>
        <li><strong>Industry:</strong> {company.industry || "N/A"}</li>
        <li><strong>Website:</strong> {company.website || "N/A"}</li>
      </ul>
    </div>
  );
}