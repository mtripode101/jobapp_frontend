import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getInterviews, deleteInterview } from "../../services/interviewService";
import { InterviewDto } from "../../types/interviewDto";   

export default function InterviewListPage() {
  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadInterviews = useCallback(() => {   
    setLoading(true);
    setError(null);
    getInterviews()
      .then((data) => setInterviews(data))
      .catch(() => setError("Failed to load interviews"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { 
    loadInterviews();
  }, [loadInterviews]);

    const handleDelete = (id: number) => { 
      if (!window.confirm("Are you sure you want to delete this Interview?")) return;  
      deleteInterview(id)
        .then(() => {
          setSuccessMessage("Interview deleted successfully");
          loadInterviews();
        })
        .catch(() => setError("Failed to delete interview"));
    }

 return (
    <div>
      <h2>Interviews</h2>

      {/* 🔗 Link back to Home */}
      <Link to="/">🏠 Back to Home</Link> |{" "}
      <Link to="/interview/new">➕ Add Interview</Link>

      {loading && <p>Loading interviews...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {!loading && !error && (
        <ul>
          {interviews.length === 0 ? (
            <li>No interviews found</li>
          ) : (
            interviews.map((c) => (
              <li key={c.id}>
                <Link to={`/interview/${c.id}`}>{c.scheduledAt}</Link>
                <button onClick={() => handleDelete(c.id!)} disabled={loading}>
                  🗑️ Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );

}