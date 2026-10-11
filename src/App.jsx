
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import InvestigatorDashboard from "./pages/InvestigatorDashboard"
import CreateCase from "./pages/CreateCase"
import CaseDetails from "./pages/CaseDetails"
import EditCase from "./pages/EditCase"
import AISearch from "./pages/AISearch"
import SearchResults from "./pages/SearchResults"
import SightingReview from "./pages/SightingReview"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/investigator"
          element={<InvestigatorDashboard />}
        />

        <Route
          path="/create-case"
          element={<CreateCase />}
        />

        <Route
          path="/case/:caseId"
          element={<CaseDetails />}
        />

        <Route
          path="/edit-case/:caseId"
          element={<EditCase />}
        />

        <Route
          path="/ai-search/:caseId"
          element={<AISearch />}
        />

        <Route
          path="/search-results/:caseId"
          element={<SearchResults />}
        />

        <Route
          path="/sighting-review/:caseId/:sightingId"
          element={<SightingReview />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App