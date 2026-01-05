import { Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";

// Home
import HomePage from "../pages/HomePage";

// Companies
import CompaniesListPage from "../pages/company/CompaniesListPage";
import CompanyDetailPage from "../pages/company/CompanyDetailPage";
import CompanyFormPage from "../pages/company/CompanyFormPage";

// Candidates
import CandidateListPage from "../pages/candidate/CandidateListPage";
import CandidateDetailPage from "../pages/candidate/CandidateDetailPage";
import CandidateFormPage from "../pages/candidate/CandidateFormPage";

//Interviews
import InterviewListPage from "../pages/interview/InterviewListPage";
import InterviewFormPage from "../pages/interview/InterviewFormPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Home */}
        <Route index element={<HomePage />} />

        {/* Companies */}
        <Route path="companies" element={<CompaniesListPage />} />
        <Route path="companies/:id" element={<CompanyDetailPage />} />
        <Route path="companies/new" element={<CompanyFormPage />} />

        {/* Candidates */}
        <Route path="candidates" element={<CandidateListPage />} />
        <Route path="candidates/:id" element={<CandidateDetailPage />} />
        <Route path="candidates/new" element={<CandidateFormPage />} />

        {/* Interviews */}
        <Route path="interviews" element={<InterviewListPage />} />
        <Route path="interview/new" element={<InterviewFormPage />} />

        {/* 404 */}
        <Route path="*" element={<p>404 - Page Not Found</p>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;