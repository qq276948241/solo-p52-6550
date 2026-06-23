import { Routes, Route, useLocation } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import BookingPage from "@/pages/BookingPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import ProfilePage from "@/pages/ProfilePage";
import BottomTabBar from "@/components/BottomTabBar";

function AppLayout() {
  const location = useLocation();
  const showTabBar = !location.pathname.startsWith("/booking/");

  return (
    <div className="min-h-screen bg-background max-w-[480px] mx-auto relative shadow-xl">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:serviceId" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {showTabBar && <BottomTabBar />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}
