import React from "react";

export default function CollapsibleFormCard({ title, icon, isOpen, onToggle, children }) {
  return (
    <div className="form-card">
      <button className="collapsible-form-header" onClick={onToggle}>
        <div className="form-card-header-inner">
          <div className="icon-badge">
            <i className={`ti ${icon}`} aria-hidden="true"></i>
          </div>
          <h2>{title}</h2>
        </div>
        <i className={`ti ${isOpen ? "ti-chevron-up" : "ti-chevron-down"} collapse-chevron`} aria-hidden="true"></i>
      </button>

      {isOpen && <div className="collapsible-form-body">{children}</div>}
    </div>
  );
}
