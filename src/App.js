import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CompaniesListPage from "./pages/company/CompaniesListPage";
import CompanyDetailPage from "./pages/company/CompanyDetailPage";
import CompanyForm from "./pages/company/CompanyForm";

import CandidateListPage from "./pages/candidate/CandidateListPage";
import CandidateDetailPage from "./pages/candidate/CandidateDetailPage";
import CandidateFormPage from "./pages/candidate/CandidateFormPage";

function App() {
  return (
    <Router>
      <header>
        <h1>JobApp Frontend 🚀</h1>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/companies">Companies</Link> |{" "}
          <Link to="/companies/new">Add Company</Link> |{" "}
          <Link to="/candidates">Candidates</Link> |{" "}
          <Link to="/candidates/new">Add Candidate</Link>
        </nav>
      </header>

      <main>
        <Routes>
          {/* Home */}
          <Route path="/" element={<p>Welcome to JobApp!</p>} />

          {/* Companies */}
          <Route path="/companies" element={<CompaniesListPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/companies/new" element={<CompanyForm />} />

          {/* Candidates */}
          <Route path="/candidates" element={<CandidateListPage />} />
          <Route path="/candidates/:id" element={<CandidateDetailPage />} />
          <Route path="/candidates/new" element={<CandidateFormPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;