import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../services/companyService";

export default function CompanyForm() {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    createCompany({
      name,
      website,
    })
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
       <button type="submit">Save</button>
    </form>
  );
}