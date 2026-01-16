import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCandidateById, updateCandidate } from "../../services/candidateService";
import { CandidateDto } from "../../types/candidate";

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

export default function EditCandidatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<CandidateDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; email?: string; linkedIn?: string; github?: string }>({});

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [github, setGithub] = useState<string>("");

  useEffect(() => {
    if (!id) { setError("Invalid candidate id"); setLoading(false); return; }
    const candidateId = Number(id);
    if (isNaN(candidateId)) { setError("Invalid candidate id"); setLoading(false); return; }

    let cancelled = false;
    setLoading(true);
    getCandidateById(candidateId)
      .then((data) => {
        if (cancelled) return;
        setCandidate(data);
        setFullName(data.fullName ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
        setLinkedIn(data.linkedIn ?? "");
        setGithub(data.github ?? "");
      })
      .catch((err: any) => { if (!cancelled) setError(err?.message || "Error loading candidate"); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  const validate = (): boolean => {
    const errors: { fullName?: string; email?: string; linkedIn?: string; github?: string } = {};
    const trimmedName = fullName.trim();
    if (!trimmedName) errors.fullName = "Full name is required";
    else if (trimmedName.length < 2) errors.fullName = "Full name must be at least 2 characters";

    const trimmedEmail = email.trim();
    if (!trimmedEmail) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) errors.email = "Please enter a valid email";

    if (linkedIn && !isValidUrl(linkedIn.trim())) errors.linkedIn = "Please enter a valid LinkedIn URL";
    if (github && !isValidUrl(github.trim())) errors.github = "Please enter a valid GitHub URL";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!candidate) return;
    if (!validate()) return;

    const payload: CandidateDto = {
      ...candidate,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      linkedIn: linkedIn.trim() || undefined,
      github: github.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      console.log("Sending payload to updateCandidate:", payload);
      const updated = await updateCandidate(candidate.id!, payload);
      console.log("Update response:", updated);
      if (updated && typeof updated === "object") setCandidate(updated);
      navigate("/candidates");
    } catch (err: any) {
      console.error("Update failed:", err);
      setError(err?.message || "Failed to update candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p role="status">Loading candidate...</p>;
  if (error) return (
    <div>
      <p role="alert" style={{ color: "red" }}>{error}</p>
      <div style={{ marginTop: 10 }}><Link to="/candidates">⬅️ Back to Candidates</Link></div>
    </div>
  );
  if (!candidate) return <p>Candidate not found</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Edit Candidate</h2>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="candidate-fullName">Full name</label>
        <input id="candidate-fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required aria-invalid={!!fieldErrors.fullName} />
        {fieldErrors.fullName && <div role="alert" style={{ color: "red" }}>{fieldErrors.fullName}</div>}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="candidate-email">Email</label>
        <input id="candidate-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-invalid={!!fieldErrors.email} />
        {fieldErrors.email && <div role="alert" style={{ color: "red" }}>{fieldErrors.email}</div>}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="candidate-phone">Phone</label>
        <input id="candidate-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="candidate-linkedIn">LinkedIn</label>
        <input id="candidate-linkedIn" type="url" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} aria-invalid={!!fieldErrors.linkedIn} />
        {fieldErrors.linkedIn && <div role="alert" style={{ color: "red" }}>{fieldErrors.linkedIn}</div>}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label htmlFor="candidate-github">GitHub</label>
        <input id="candidate-github" type="url" value={github} onChange={(e) => setGithub(e.target.value)} aria-invalid={!!fieldErrors.github} />
        {fieldErrors.github && <div role="alert" style={{ color: "red" }}>{fieldErrors.github}</div>}
      </div>

      {error && <div role="alert" style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      <div>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save changes"}</button>
        <Link to={`/candidates/${candidate.id}`} style={{ marginLeft: 8 }}>View</Link>
        <Link to="/candidates" style={{ marginLeft: 8 }}>Back to list</Link>
      </div>
    </form>
  );
}