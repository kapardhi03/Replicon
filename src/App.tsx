import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui';
import { MainLayout } from './components/layout';
import {
  LandingPage,
  TermsPage,
  PrivacyPage,
  FAQPage,
  ContactPage,
  LoginPage,
  RegisterPage,
  OnboardingPage,
} from './pages';
import { DashboardPage } from './pages/master';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <MainLayout isAuthenticated={false} showSidebar={false}>
                  <LandingPage />
                </MainLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <MainLayout isAuthenticated={false} showSidebar={false}>
                  <TermsPage />
                </MainLayout>
              }
            />
            <Route
              path="/privacy"
              element={
                <MainLayout isAuthenticated={false} showSidebar={false}>
                  <PrivacyPage />
                </MainLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <MainLayout isAuthenticated={false} showSidebar={false}>
                  <FAQPage />
                </MainLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <MainLayout isAuthenticated={false} showSidebar={false}>
                  <ContactPage />
                </MainLayout>
              }
            />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Master Trader Routes */}
            <Route
              path="/master/dashboard"
              element={
                <MainLayout isAuthenticated={true} showSidebar={true}>
                  <DashboardPage />
                </MainLayout>
              }
            />

            {/* TODO: Add more master trader routes */}
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
