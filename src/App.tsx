import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { SellTradeInPage } from './pages/SellTradeInPage';
import { FinancePage } from './pages/FinancePage';
import { ResearchPage } from './pages/ResearchPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

// Drawers & Modals
import { VehicleModal } from './components/VehicleModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CompareDrawer } from './components/CompareDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminPortal } from './components/AdminPortal';

// Component to scroll to top on page route transition
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const MainLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Navbar />

      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
          <Route path="/sell" element={<SellTradeInPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/research/:id" element={<ArticleDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Overlays & Modals */}
      <VehicleModal />
      <CheckoutModal />
      <CompareDrawer />
      <WishlistDrawer />
      <AdminPortal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </StoreProvider>
  );
}
