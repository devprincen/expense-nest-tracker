import React from "react";

export default function DataTable({
  columns,
  rows,
  renderRow,
  searchTerm,
  onSearchChange,
  filterSlot,
  emptyIcon,
  emptyText,
}) {
  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="search-box">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {filterSlot}
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">
          <i className={`ti ${emptyIcon || "ti-inbox"}`} aria-hidden="true"></i>
          <p>{emptyText || "No records found"}</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>{rows.map((row) => renderRow(row))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
