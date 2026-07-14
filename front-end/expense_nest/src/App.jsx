import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import TransactionsPage from "./pages/TransactionsPage";
import ProfilePage from "./pages/ProfilePage";
import ReportPage from "./pages/Reportpage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AuthenticatedApp() {
  const { customer, logout } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [focusedCategory, setFocusedCategory] = useState(null);

  function goToPage(page) {
    if (page !== "transactions") setFocusedCategory(null);
    setActivePage(page);
  }

  function openCategoryInTransactions(category) {
    setFocusedCategory(category);
    setActivePage("transactions");
  }

  const firstName = customer?.firstName || "";
  const initial = firstName ? firstName[0].toUpperCase() : "?";

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={goToPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
      />
      <main className="app-main">
        {/* Topbar */}
        <div className="topbar">
          <button
            className="topbar-user"
            onClick={() => goToPage("profile")}
            title="View profile"
            style={{ cursor: "pointer", background: activePage === "profile" ? "var(--green-50)" : undefined }}
          >
            <div className="avatar-circle">{initial}</div>
            <span className="topbar-user-name">{firstName}</span>
          </button>
          <button className="logout-btn" onClick={logout}>
            <i className="ti ti-logout-2" aria-hidden="true"></i>
            Log out
          </button>
        </div>

        {activePage === "dashboard" && <DashboardPage onNavigate={goToPage} />}
        {activePage === "categories" && <CategoriesPage onOpenCategory={openCategoryInTransactions} />}
        {activePage === "transactions" && (
          <TransactionsPage focusedCategory={focusedCategory} onClearFocus={() => setFocusedCategory(null)} />
        )}
        {activePage === "profile" && <ProfilePage />}
        {activePage === "reports" && <ReportPage />}
      </main>
    </div>
  );
}

function AuthGate() {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState("register");
  if (isAuthenticated) return <AuthenticatedApp />;
  if (authView === "login") return <LoginPage onSwitchToRegister={() => setAuthView("register")} />;
  return <RegisterPage onSwitchToLogin={() => setAuthView("login")} onRegisterSuccess={() => setAuthView("login")} />;
}

export default function App() {
  return <AuthProvider><AuthGate /></AuthProvider>;
}