import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomeDashboard from './pages/HomeDashboard';
import PropertyListingPage from './pages/PropertyListingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomeDashboard />} />
      <Route path="/properties" element={<PropertyListingPage />} />
    </Routes>
  );
}