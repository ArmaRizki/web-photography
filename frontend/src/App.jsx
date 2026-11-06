
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Packages from "./pages/Packages";
import VideoGallery from "./pages/VideoGallery";
import LatestGallery from "./pages/LatestGallery";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import TermsAndConditions from "./pages/TermsAndConditions";

// Admin pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminPhotos from "./pages/admin/Photos";
import AdminCategories from "./pages/admin/Categories";
import AdminPackages from "./pages/admin/Packages";
import AdminVideos from "./pages/admin/Videos";
import AdminBookings from "./pages/admin/Bookings";
import AdminCalendar from "./pages/admin/Calendar";
import AdminFaqs from "./pages/admin/Faqs";
import AboutEditor from "./pages/admin/AboutEditor";
import ContactEditor from "./pages/admin/ContactEditor";
import SocialLinksEditor from "./pages/admin/SocialLinksEditor";
import TermsEditor from "./pages/admin/TermsEditor";
import SmtpSettings from "./pages/admin/SmtpSettings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/videos" element={<VideoGallery />} />
            <Route path="/latest" element={<LatestGallery />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="photos" element={<AdminPhotos />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="faqs" element={<AdminFaqs />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="contact" element={<ContactEditor />} />
            <Route path="social-links" element={<SocialLinksEditor />} />
        <Route path="terms" element={<TermsEditor />} />
            <Route path="smtp" element={<SmtpSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
