import { Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";

// Home
import HomePage from "../pages/HomePage";

// Companies
import CompaniesListPage from "../pages/company/CompaniesListPage";
import CompanyDetailPage from "../pages/company/CompanyDetailPage";
import CompanyFormPage from "../pages/company/CompanyFormPage";
import CompanyEditPage from "../pages/company/EditCompanyPage";

// Candidates
import CandidateListPage from "../pages/candidate/CandidateListPage";
import CandidateDetailPage from "../pages/candidate/CandidateDetailPage";
import CandidateFormPage from "../pages/candidate/CandidateFormPage";
import CandidateEditPage from "../pages/candidate/EditCandidatePage";

//Interviews
import InterviewListPage from "../pages/interview/InterviewListPage";
import InterviewFormPage from "../pages/interview/InterviewFormPage";

//Positions
import PositionListPage from "../pages/position/PositionListPage";
import PositionDetailPage from "../pages/position/PositionDetailPage";
import PositionFormPage from "../pages/position/PositionFormPage";
import PositionEditPage from "../pages/position/PositionEditPage";

//Job Applications
import JobApplicationListPage from "../pages/jobapplication/JobApplicationListPage";
import JobApplicationDetailPage from "../pages/jobapplication/JobApplicationDetailPage";
import JobApplicationFormPage from "../pages/jobapplication/JobApplicationFormPage";  

//Job Offers
import JobOfferListPage from "../pages/joboffer/JobOfferListPage";
import JobOfferDetailPage from "../pages/joboffer/JobOfferDetailPage";
import JobOfferFormPage from "../pages/joboffer/JobOfferFormPage";


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
        <Route path="companies/:id/edit" element={<CompanyEditPage />} />

        {/* Candidates */}
        <Route path="candidates" element={<CandidateListPage />} />
        <Route path="candidates/:id" element={<CandidateDetailPage />} />
        <Route path="candidates/new" element={<CandidateFormPage />} />
        <Route path="candidates/:id/edit" element={<CandidateEditPage />} /> 

        {/* Interviews */}
        <Route path="interviews" element={<InterviewListPage />} />
        <Route path="interview/new" element={<InterviewFormPage />} />

        {/* Positions */}
        <Route path="positions" element={<PositionListPage />} />
        <Route path="positions/:id" element={<PositionDetailPage />} />
        <Route path="positions/new" element={<PositionFormPage />} />
        <Route path="positions/:id/edit" element={<PositionEditPage />} />

        {/* Job Applications */}
        <Route path="applications" element={<JobApplicationListPage />} />
        <Route path="applications/new" element={<JobApplicationFormPage />} />
        <Route path="applications/:id" element={<JobApplicationDetailPage />} />  

        {/* Job Offers */}
        <Route path="job-offers" element={<JobOfferListPage />} />
        <Route path="job-offers/:id" element={<JobOfferDetailPage />} />
        <Route path="job-offers/new" element={<JobOfferFormPage />} />

        {/* 404 */}
        <Route path="*" element={<p>404 - Page Not Found</p>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;