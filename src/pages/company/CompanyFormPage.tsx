import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createCompany } from "../../services/companyService";
import { CompanyDto } from "../../types/company";

export default function CompanyFormPage() {
  const [name, setName] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [description, setDescription] = useState<string>(""); // optional
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newCompany: CompanyDto = {
      name,
      website,
      description,
    };

    createCompany(newCompany)
      .then(() => {
        // redirect to list after successful creation
        navigate("/companies");
      })
      .catch((err) => {
        console.error("Error creating company:", err);
        alert("There was an error saving the company");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Company</h2>

      <input
        type="text"
        placeholder="Company name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="url"
        placeholder="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Save</button>

      {/* 🔗 Link back to Companies list */}
      <div style={{ marginTop: "10px" }}>
        <Link to="/companies">⬅️ Back to Companies</Link>
      </div>
    </form>
  );
}