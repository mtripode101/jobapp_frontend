import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CompaniesListPage from "./pages/CompaniesListPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import CompanyForm from "./pages/CompanyForm";

function App() {
  return (
    <Router>
      <header>
        <h1>JobApp Frontend 🚀</h1>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/companies">Companies</Link> |{" "}
          <Link to="/companies/new">Add Company</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<p>Welcome to JobApp!</p>} />
          <Route path="/companies" element={<CompaniesListPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/companies/new" element={<CompanyForm />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;