import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../services/companyService";

export default function CompanyForm() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    createCompany({
      name,
      industry,
      website,
      email,
      phone,
      address,
      country,
      employeeCount: employeeCount ? parseInt(employeeCount, 10) : null,
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
        type="text"
        placeholder="Industry"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
      />
      <input
        type="url"
        placeholder="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <input
        type="number"
        placeholder="Employee count"
        value={employeeCount}
        onChange={(e) => setEmployeeCount(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}