import { NavLink } from "react-router-dom";
import { Home, CalendarDays, User } from "lucide-react";

const tabs = [
  { to: "/", label: "首页", icon: Home, end: true },
  { to: "/my-bookings", label: "我的预约", icon: CalendarDays },
  { to: "/profile", label: "我的", icon: User },
];

export default function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-muted shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-[480px] mx-auto flex items-stretch">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 min-h-[56px] transition-colors duration-200 ${
                isActive ? "text-primary" : "text-text-light"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "scale-110 transition-transform" : ""}
                />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
