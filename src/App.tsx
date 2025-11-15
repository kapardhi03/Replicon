import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui';
import { MainLayout } from './components/layout';
import { LandingPage, TermsPage, PrivacyPage, FAQPage, ContactPage } from './pages';

function App() {
  return (
    <ToastProvider>
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

          {/* TODO: Add authentication routes */}
          {/* TODO: Add master trader routes */}
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
