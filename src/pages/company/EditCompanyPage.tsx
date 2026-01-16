// src/pages/companies/EditCompanyPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCompanyById, updateCompany } from "../../services/companyService";
import { CompanyDto } from "../../types/company";

const isValidUrl = (value: string) => {
  if (!value) return true;
  try {
    const normalized = value.startsWith("http://") || value.startsWith("https://") ? value : `http://${value}`;
    // eslint-disable-next-line no-new
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
};

export default function EditCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; website?: string }>({});

  // form fields local state
  const [name, setName] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (!id) {
      setError("Invalid company id");
      setLoading(false);
      return;
    }
    const companyId = Number(id);
    if (isNaN(companyId)) {
      setError("Invalid company id");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getCompanyById(companyId)
      .then((data) => {
        if (cancelled) return;
        setCompany(data);
        setName(data.name ?? "");
        setWebsite(data.website ?? "");
        setDescription(data.description ?? "");
      })
      .catch((err: any) => {
        if (cancelled) return;
        // si tu service normaliza errores, muestra err.message
        setError(err?.message || "Error loading company");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const validate = (): boolean => {
    const errors: { name?: string; website?: string } = {};
    const trimmedName = name.trim();
    if (!trimmedName) {
      errors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (website && !isValidUrl(website.trim())) {
      errors.website = "Please enter a valid URL";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!company) return;

    if (!validate()) return;

    const payload: CompanyDto = {
      ...company,
      name: name.trim(),
      website: website.trim() || undefined,
      description: description.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      await updateCompany(company.id!, payload);
      // éxito: volver a la lista o a la vista detalle
      navigate("/companies");
    } catch (err: any) {
      setError(err?.message || "Failed to update company");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p role="status">Loading company...</p>;
  if (error) return (
    <div>
      <p role="alert" style={{ color: "red" }}>{error}</p>
      <div style={{ marginTop: 10 }}>
        <Link to="/companies">⬅️ Back to Companies</Link>
      </div>
    </div>
  );
  if (!company) return <p>Company not found</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Edit Company</h2>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="company-name">Name</label>
        <input
          id="company-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name && <div id="name-error" role="alert" style={{ color: "red" }}>{fieldErrors.name}</div>}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="company-website">Website</label>
        <input
          id="company-website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          aria-invalid={!!fieldErrors.website}
          aria-describedby={fieldErrors.website ? "website-error" : undefined}
        />
        {fieldErrors.website && <div id="website-error" role="alert" style={{ color: "red" }}>{fieldErrors.website}</div>}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="company-description">Description</label>
        <textarea id="company-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {error && <div role="alert" style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
        <Link to={`/companies/${company.id}`} style={{ marginLeft: 8 }}>View</Link>
        <Link to="/companies" style={{ marginLeft: 8 }}>Back to list</Link>
      </div>
    </form>
  );
}