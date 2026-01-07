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

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newCandidate: CandidateDto = {
      fullName,
      contactInfo: {
        email,
        phone,
        linkedIn,
        github,
      },
    };

    createCandidate(newCandidate)
      .then(() => navigate("/candidates"))
      .catch((err) => {
        console.error("Error creating candidate:", err);
        alert("There was an error saving the candidate");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Candidate</h2>

      <input
        type="text"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="url"
        placeholder="LinkedIn profile"
        value={linkedIn}
        onChange={(e) => setLinkedIn(e.target.value)}
      />

      <input
        type="url"
        placeholder="GitHub profile"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
      />

      <button type="submit">Save</button>

      {/* 🔗 Link back to Candidates list */}
      <div style={{ marginTop: "10px" }}>
        <Link to="/candidates">⬅️ Back to Candidates</Link>
      </div>
    </form>
  );
}