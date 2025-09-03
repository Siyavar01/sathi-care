import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header.tsx';
import UserRegisterPage from './pages/UserRegisterPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import LandingPage from './pages/LandingPage.tsx';
import AuthCallbackPage from './pages/AuthCallbackPage.tsx';
import RoleSelectionPage from './pages/RoleSelectionPage.tsx';
import ProfessionalRegisterPage from './pages/ProfessionalRegisterPage.tsx';

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
          <Route
            path="/register/professional"
            element={<ProfessionalRegisterPage />}
          />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;