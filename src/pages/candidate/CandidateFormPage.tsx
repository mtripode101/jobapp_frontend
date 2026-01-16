import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createCandidate } from "../../services/candidateService";
import { CandidateDto } from "../../types/candidate";

export default function CandidateFormPage() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [linkedIn, setLinkedIn] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const newCandidate: CandidateDto = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      linkedIn: linkedIn.trim() || undefined,
      github: github.trim() || undefined,
    } as CandidateDto;

    try {
      await createCandidate(newCandidate);
      navigate("/candidates");
    } catch (err: any) {
      console.error("Error creating candidate:", err);
      setError(err?.message || "There was an error saving the candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Candidate</h2>

      {error && <div role="alert" style={{ color: "red" }}>{error}</div>}

      <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input type="url" placeholder="LinkedIn profile" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} />
      <input type="url" placeholder="GitHub profile" value={github} onChange={(e) => setGithub(e.target.value)} />

      <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save"}</button>

      <div style={{ marginTop: 10 }}>
        <Link to="/candidates">⬅️ Back to Candidates</Link>
      </div>
    </form>
  );
}