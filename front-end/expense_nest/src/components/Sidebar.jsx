import React from "react";

const NAV_ITEMS = [
    { key: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
    { key: "categories", label: "Categories", icon: "ti-category" },
    { key: "transactions", label: "Transactions", icon: "ti-receipt" },
    { key: "profile", label: "Profile", icon: "ti-user-circle" },
];

export default function Sidebar({ activePage, setActivePage, collapsed, onToggleCollapse }) {
    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <i className="ti ti-leaf" aria-hidden="true"></i>
                </div>
                <div>
                    <div className="brand-name">Expense Nest</div>
                    <div className="brand-tagline">Daily expense tracker</div>
                </div>
            </div>

            <button
                className="sidebar-toggle-btn"
                onClick={onToggleCollapse}
                title={collapsed ? "Expand menu" : "Collapse menu"}
            >
                <i className={`ti ${collapsed ? "ti-layout-sidebar-right-expand" : "ti-layout-sidebar-left-collapse"}`} aria-hidden="true"></i>
            </button>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.key}
                        className={`sidebar-nav-item ${activePage === item.key ? "active" : ""}`}
                        onClick={() => setActivePage(item.key)}
                        title={collapsed ? item.label : undefined}
                    >
                        <i className={`ti ${item.icon}`} aria-hidden="true"></i>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}