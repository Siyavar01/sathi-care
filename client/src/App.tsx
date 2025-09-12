import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header.tsx';
import UserRegisterPage from './pages/UserRegisterPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import LandingPage from './pages/LandingPage.tsx';
import AuthCallbackPage from './pages/AuthCallbackPage.tsx';
import RoleSelectionPage from './pages/RoleSelectionPage.tsx';
import ProfessionalRegisterPage from './pages/ProfessionalRegisterPage.tsx';
import ProfessionalProfilePage from './pages/ProfessionalProfilePage.tsx';
import AdminDashboardPage from './pages/AdminDashboardPage.tsx';
import AdminRoute from './components/AdminRoute.tsx';
import ProfessionalDirectoryPage from './pages/ProfessionalDirectoryPage.tsx';
import InstitutionRegisterPage from './pages/InstitutionRegisterPage.tsx';
import InstitutionDashboardPage from './pages/InstitutionDashboardPage.tsx';
import ProfessionalConnectPage from './pages/ProfessionalConnectPage.tsx';
import ProfessionalDetailPage from './pages/ProfessionalDetailPage.tsx';
import UserDashboardPage from './pages/UserDashboardPage.tsx';
import ProfessionalDashboardPage from './pages/ProfessionalDashboardPage.tsx';
import QuestionnairePage from './pages/QuestionnairePage.tsx';

function App() {
  return (
    <div className="font-sans antialiased text-gray-800">
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/user" element={<UserRegisterPage />} />
          <Route path="/register/select-role" element={<RoleSelectionPage />} />
          <Route path="/register/professional" element={<ProfessionalRegisterPage />} />
          <Route path="/register/institution" element={<InstitutionRegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/professionals" element={<ProfessionalDirectoryPage />} />
          <Route path="/professionals/:id/book" element={<ProfessionalDetailPage />} />
          <Route path="/user/dashboard" element={<UserDashboardPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/professional/profile" element={<ProfessionalProfilePage />} />
          <Route path="/professional/dashboard" element={<ProfessionalDashboardPage />} />
          <Route path="/institution/dashboard" element={<InstitutionDashboardPage />} />
          <Route path="/professionals/:id/connect" element={<ProfessionalConnectPage />} />
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;