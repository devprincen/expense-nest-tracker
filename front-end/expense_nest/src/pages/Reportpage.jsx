import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchTransactions } from "../api/transactionsApi";
import { fetchCategories } from "../api/categoriesApi";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const COLORS = [
    "var(--blue-500)", "var(--green-500)", "var(--coral-500)",
    "var(--blue-400)", "var(--green-400)", "var(--coral-400)",
];

function HBar({ value, max, color }) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    return (
        <div style={{ background: "var(--border-light)", borderRadius: 6, height: 9, flex: 1 }}>
            <div style={{ background: color, borderRadius: 6, height: 9, width: `${pct}%`, transition: "width 0.4s ease" }} />
        </div>
    );
}

export default function ReportPage() {
    const { customer } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        let isMounted = true;
        async function load() {
            setLoading(true);
            try {
                const [txns, cats] = await Promise.all([
                    fetchTransactions(customer?.id),
                    fetchCategories(),
                ]);
                if (isMounted) { setTransactions(txns); setCategories(cats); }
            } catch (e) {
                console.error("Report load error", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, [customer?.id]);

    const years = useMemo(() => {
        const ys = new Set(transactions.map((t) => new Date(t.date).getFullYear()));
        const arr = Array.from(ys).sort((a, b) => b - a);
        return arr.length ? arr : [new Date().getFullYear()];
    }, [transactions]);

    const yearTxns = useMemo(
        () => transactions.filter((t) => new Date(t.date).getFullYear() === selectedYear),
        [transactions, selectedYear]
    );

    const totalIncome = yearTxns.filter((t) => t.type === "CREDIT").reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = yearTxns.filter((t) => t.type === "DEBIT").reduce((s, t) => s + Number(t.amount), 0);
    const totalSaving = totalIncome - totalExpense;
    const budget = Number(customer?.budget || 0);
    const budgetPct = budget > 0 ? Math.min(100, Math.round((totalExpense / (budget * 12)) * 100)) : null;

    const monthlyData = useMemo(() => {
        const data = MONTHS.map((m) => ({ month: m, income: 0, expense: 0 }));
        yearTxns.forEach((t) => {
            const m = new Date(t.date).getMonth();
            if (t.type === "CREDIT") data[m].income += Number(t.amount);
            else data[m].expense += Number(t.amount);
        });
        return data;
    }, [yearTxns]);

    const maxMonthly = Math.max(...monthlyData.flatMap((d) => [d.income, d.expense]), 1);

    const catBreakdown = useMemo(() => {
        const map = {};
        yearTxns.filter((t) => t.type === "DEBIT").forEach((t) => {
            const cat = categories.find((c) => String(c.id).toLowerCase() === String(t.categoryId).toLowerCase());
            const name = cat ? cat.categoryName : "Unknown";
            map[name] = (map[name] || 0) + Number(t.amount);
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
    }, [yearTxns, categories]);

    const maxCat = catBreakdown.length ? catBreakdown[0][1] : 1;

    if (loading) return (
        <div className="empty-state">
            <i className="ti ti-loader-2 spin" aria-hidden="true"></i>
            <p>Loading your report...</p>
        </div>
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Reports</h1>
                    <p>Your financial summary at a glance</p>
                </div>
                <div className="page-stats">
                    <select className="filter-select" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {/* Summary cards */}
            <div className="rpt-summary-grid">
                <div className="rpt-card rpt-income">
                    <div className="rpt-card-icon"><i className="ti ti-arrow-down-left" aria-hidden="true"></i></div>
                    <div>
                        <div className="rpt-card-label">Total income</div>
                        <div className="rpt-card-value" style={{ color: "var(--green-600)" }}>
                            ₹{totalIncome.toLocaleString("en-IN")}
                        </div>
                    </div>
                </div>
                <div className="rpt-card rpt-expense">
                    <div className="rpt-card-icon"><i className="ti ti-arrow-up-right" aria-hidden="true"></i></div>
                    <div>
                        <div className="rpt-card-label">Total expense</div>
                        <div className="rpt-card-value" style={{ color: "var(--coral-600)" }}>
                            ₹{totalExpense.toLocaleString("en-IN")}
                        </div>
                    </div>
                </div>
                <div className="rpt-card rpt-saving">
                    <div className="rpt-card-icon">
                        <i className={`ti ${totalSaving >= 0 ? "ti-trending-up" : "ti-trending-down"}`} aria-hidden="true"></i>
                    </div>
                    <div>
                        <div className="rpt-card-label">Net saving</div>
                        <div className="rpt-card-value" style={{ color: totalSaving >= 0 ? "var(--green-600)" : "var(--coral-600)" }}>
                            {totalSaving >= 0 ? "+" : ""}₹{Math.abs(totalSaving).toLocaleString("en-IN")}
                        </div>
                    </div>
                </div>
                {budget > 0 && (
                    <div className="rpt-card rpt-budget">
                        <div className="rpt-card-icon"><i className="ti ti-wallet" aria-hidden="true"></i></div>
                        <div style={{ flex: 1 }}>
                            <div className="rpt-card-label">Annual budget used</div>
                            <div className="rpt-card-value">{budgetPct}%</div>
                            <div style={{ background: "var(--border-light)", borderRadius: 6, height: 6, marginTop: 8 }}>
                                <div style={{
                                    background: budgetPct > 90 ? "var(--coral-500)" : "var(--blue-400)",
                                    borderRadius: 6, height: 6, width: `${budgetPct}%`, transition: "width 0.4s"
                                }} />
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>
                                ₹{totalExpense.toLocaleString("en-IN")} of ₹{(budget * 12).toLocaleString("en-IN")}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Monthly chart */}
            <div className="rpt-chart-card">
                <div className="rpt-chart-header">
                    <h2>Monthly breakdown — {selectedYear}</h2>
                    <div style={{ display: "flex", gap: 16, fontSize: 12.5 }}>
                        <span style={{ color: "var(--green-600)", fontWeight: 600 }}>▮ Income</span>
                        <span style={{ color: "var(--coral-600)", fontWeight: 600 }}>▮ Expense</span>
                    </div>
                </div>
                {yearTxns.length === 0 ? (
                    <div className="empty-state" style={{ padding: "32px 0" }}>
                        <p>No transactions in {selectedYear}</p>
                    </div>
                ) : (
                    <div className="rpt-monthly-grid">
                        {monthlyData.map((d) => (
                            <div key={d.month} className="rpt-month-col">
                                <div className="rpt-month-rows">
                                    <div className="rpt-bar-row">
                                        <HBar value={d.income} max={maxMonthly} color="var(--green-400)" />
                                        <span className="rpt-bar-amt">{d.income > 0 ? `₹${(d.income / 1000).toFixed(0)}k` : ""}</span>
                                    </div>
                                    <div className="rpt-bar-row">
                                        <HBar value={d.expense} max={maxMonthly} color="var(--coral-400)" />
                                        <span className="rpt-bar-amt">{d.expense > 0 ? `₹${(d.expense / 1000).toFixed(0)}k` : ""}</span>
                                    </div>
                                </div>
                                <div className="rpt-month-label">{d.month}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Category breakdown */}
            {catBreakdown.length > 0 && (
                <div className="rpt-chart-card">
                    <div className="rpt-chart-header">
                        <h2>Category-wise expenses — {selectedYear}</h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {catBreakdown.map(([name, amount], i) => (
                            <div key={name} className="rpt-cat-row">
                                <div className="rpt-cat-dot" style={{ background: COLORS[i % COLORS.length] }} />
                                <div className="rpt-cat-name">{name}</div>
                                <HBar value={amount} max={maxCat} color={COLORS[i % COLORS.length]} />
                                <div className="rpt-cat-amount">₹{amount.toLocaleString("en-IN")}</div>
                                <div className="rpt-cat-pct">
                                    {totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}