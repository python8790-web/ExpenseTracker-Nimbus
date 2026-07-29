import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { CategoryIcon, IconPlus, IconTrash, IconEdit, IconSearch, IconTrend, IconShield, IconWallet } from "../components/Icons";
import { useAuth } from "../context/AuthContext";

import * as expensesApi from "../api/expenses";
import * as categoriesApi from "../api/categories";
import * as budgetsApi from "../api/budgets";
import type { Category, Expense, Summary } from "../types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PALETTE = ["#34e5b0", "#9b8cff", "#ffc369", "#ff8a8a", "#60a5fa", "#f472b6", "#a3e635", "#22d3ee"];

function currency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function Dashboard() {
  const { user } = useAuth();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [expensesData, categoriesData, summaryData] = await Promise.all([
        expensesApi.listExpenses({ month, year }),
        categoriesApi.listCategories(),
        expensesApi.getSummary(month, year),
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load your data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const filteredExpenses = useMemo(() => {
    if (!search.trim()) return expenses;
    const q = search.toLowerCase();
    return expenses.filter(
      (e) => e.title.toLowerCase().includes(q) || e.category.name.toLowerCase().includes(q)
    );
  }, [expenses, search]);

  const budgetPct = summary?.budget
    ? Math.min(100, Math.round((summary.total / summary.budget) * 100))
    : 0;

  async function handleDeleteExpense(id: number) {
    if (!confirm("Delete this expense?")) return;
    await expensesApi.deleteExpense(id);
    loadAll();
  }

  function openAddExpense() {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  }

  function openEditExpense(expense: Expense) {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  }

  return (
    <div className="nimbus-bg min-h-screen pb-16">
      <div className="grain" />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-mist">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</p>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Your spending, at a glance
            </h1>
          </div>

          <div className="glass glass-pill flex items-center gap-1 p-1">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-full bg-transparent px-3 py-1.5 text-sm text-ink outline-none [&>option]:bg-nimbus-900"
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-full bg-transparent px-3 py-1.5 text-sm text-ink outline-none [&>option]:bg-nimbus-900"
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-coral-400/30 bg-coral-400/10 px-4 py-3 text-sm text-coral-400">
            {error}
          </div>
        ) : null}

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <GlassCard className="p-5">
            <div className="mb-3 flex items-center gap-2 text-mist">
              <IconTrend className="h-4 w-4" />
              <span className="text-sm">Total spent</span>
            </div>
            <p className="font-display text-2xl font-bold text-ink">
              {summary ? currency(summary.total) : "—"}
            </p>
            <p className="mt-1 text-xs text-mist">{summary?.count ?? 0} transactions this month</p>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="mb-3 flex items-center justify-between text-mist">
              <div className="flex items-center gap-2">
                <IconShield className="h-4 w-4" />
                <span className="text-sm">Monthly budget</span>
              </div>
              <button onClick={() => setBudgetModalOpen(true)} className="text-xs font-semibold text-mint-400 hover:text-mint-500">
                {summary?.budget ? "Edit" : "Set"}
              </button>
            </div>
            {summary?.budget ? (
              <>
                <p className="font-display text-2xl font-bold text-ink">{currency(summary.budget)}</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${budgetPct >= 100 ? "bg-coral-400" : budgetPct >= 80 ? "bg-amber-400" : "bg-mint-400"}`}
                    style={{ width: `${budgetPct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-mist">
                  {summary.remaining !== null && summary.remaining >= 0
                    ? `${currency(summary.remaining)} remaining`
                    : `${currency(Math.abs(summary.remaining ?? 0))} over budget`}
                </p>
              </>
            ) : (
              <p className="text-sm text-mist">No budget set for {MONTH_NAMES[month - 1]} yet.</p>
            )}
          </GlassCard>

          <GlassCard className="p-5">
            <div className="mb-3 flex items-center gap-2 text-mist">
              <IconWallet className="h-4 w-4" />
              <span className="text-sm">Top category</span>
            </div>
            {summary?.byCategory[0] ? (
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${summary.byCategory[0].color}26`, color: summary.byCategory[0].color }}
                >
                  <CategoryIcon icon={summary.byCategory[0].icon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-ink">{summary.byCategory[0].name}</p>
                  <p className="text-xs text-mist">{currency(summary.byCategory[0].total)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-mist">No expenses yet.</p>
            )}
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Expenses list */}
          <GlassCard as="panel" className="p-5 sm:p-6 lg:col-span-2">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">Expenses</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist/70" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search…"
                    className="glass-input w-40 rounded-full py-2 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-mist/60 sm:w-52"
                  />
                </div>
                <Button variant="primary" onClick={openAddExpense} className="!px-4 !py-2 text-sm">
                  <IconPlus className="h-4 w-4" /> Add
                </Button>
              </div>
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm text-mist">Loading expenses…</p>
            ) : filteredExpenses.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-sm text-mist">No expenses found for this period.</p>
                <button onClick={openAddExpense} className="mt-3 text-sm font-semibold text-mint-400 hover:text-mint-500">
                  Add your first expense
                </button>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {filteredExpenses.map((expense) => (
                  <li
                    key={expense.id}
                    className="glass-card group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:bg-white/[0.06]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: `${expense.category.color}26`, color: expense.category.color }}
                      >
                        <CategoryIcon icon={expense.category.icon} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{expense.title}</p>
                        <p className="truncate text-xs text-mist">
                          {expense.category.name} · {new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-semibold text-ink">{currency(expense.amount)}</span>
                      <button
                        onClick={() => openEditExpense(expense)}
                        className="rounded-full p-1.5 text-mist opacity-0 transition hover:bg-white/10 hover:text-ink group-hover:opacity-100"
                        aria-label="Edit"
                      >
                        <IconEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="rounded-full p-1.5 text-mist opacity-0 transition hover:bg-coral-400/15 hover:text-coral-400 group-hover:opacity-100"
                        aria-label="Delete"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>

          {/* Category breakdown */}
          <GlassCard as="panel" className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">By category</h2>
              <button
                onClick={() => setCategoryModalOpen(true)}
                className="text-xs font-semibold text-mint-400 hover:text-mint-500"
              >
                Manage
              </button>
            </div>

            {summary && summary.byCategory.length > 0 ? (
              <ul className="space-y-4">
                {summary.byCategory.map((c) => {
                  const pct = summary.total > 0 ? Math.round((c.total / summary.total) * 100) : 0;
                  return (
                    <li key={c.categoryId}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-ink">
                          <span style={{ color: c.color }}>
                            <CategoryIcon icon={c.icon} className="h-3.5 w-3.5" />
                          </span>
                          {c.name}
                        </span>
                        <span className="text-mist">{currency(c.total)}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-mist">Nothing tracked yet this month.</p>
            )}
          </GlassCard>
        </div>
      </main>

      <ExpenseModal
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSaved={loadAll}
        categories={categories}
        expense={editingExpense}
      />

      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onChanged={loadAll}
        categories={categories}
      />

      <BudgetModal
        open={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        onSaved={loadAll}
        month={month}
        year={year}
        current={summary?.budget ?? null}
      />
    </div>
  );
}

function ExpenseModal({
  open, onClose, onSaved, categories, expense,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  categories: Category[];
  expense: Expense | null;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(String(expense.amount));
      setDate(expense.date.slice(0, 10));
      setCategoryId(expense.categoryId);
      setDescription(expense.description ?? "");
    } else {
      setTitle("");
      setAmount("");
      setDate(new Date().toISOString().slice(0, 10));
      setCategoryId(categories[0]?.id ?? "");
      setDescription("");
    }
    setError("");
  }, [expense, open, categories]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      setError("Please choose a category.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title,
        amount: Number(amount),
        date,
        categoryId: Number(categoryId),
        description: description || undefined,
      };
      if (expense) {
        await expensesApi.updateExpense(expense.id, payload);
      } else {
        await expensesApi.createExpense(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not save expense.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={expense ? "Edit expense" : "Add expense"}>
      {error ? (
        <div className="mb-4 rounded-xl border border-coral-400/30 bg-coral-400/10 px-4 py-2.5 text-sm text-coral-400">
          {error}
        </div>
      ) : null}
      <form onSubmit={handleSubmit}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Groceries, cab ride…" />
        <Input label="Amount (₹)" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" />
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-mist">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            required
            className="glass-input w-full rounded-xl px-4 py-3 text-ink outline-none [&>option]:bg-nimbus-900"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <Input label="Notes (optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a note" />

        <Button text={expense ? "Save changes" : "Add expense"} type="submit" fullWidth loading={saving} className="mt-1" />
      </form>
    </Modal>
  );
}

function CategoryModal({
  open, onClose, onChanged, categories,
}: {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
  categories: Category[];
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PALETTE[0]);
  const [icon, setIcon] = useState("tag");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const iconOptions = ["utensils", "car", "bag", "receipt", "film", "tag"];

  useEffect(() => {
    if (open) {
      setName("");
      setColor(PALETTE[categories.length % PALETTE.length]);
      setIcon("tag");
      setError("");
    }
  }, [open, categories.length]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await categoriesApi.createCategory({ name, color, icon });
      setName("");
      onChanged();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not add category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category? Its expenses will need a new category.")) return;
    try {
      await categoriesApi.deleteCategory(id);
      onChanged();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not delete category.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage categories">
      {error ? (
        <div className="mb-4 rounded-xl border border-coral-400/30 bg-coral-400/10 px-4 py-2.5 text-sm text-coral-400">
          {error}
        </div>
      ) : null}

      <ul className="mb-5 max-h-52 space-y-2 overflow-y-auto pr-1">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <span className="flex items-center gap-2.5 text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${c.color}26`, color: c.color }}>
                <CategoryIcon icon={c.icon} className="h-4 w-4" />
              </span>
              {c.name}
            </span>
            <button onClick={() => handleDelete(c.id)} className="rounded-full p-1.5 text-mist transition hover:bg-coral-400/15 hover:text-coral-400">
              <IconTrash className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="border-t border-white/10 pt-4">
        <Input label="New category name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Travel" />

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-mist">Color</label>
          <div className="flex flex-wrap gap-2">
            {PALETTE.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setColor(p)}
                className={`h-7 w-7 rounded-full transition ${color === p ? "ring-2 ring-white ring-offset-2 ring-offset-nimbus-900" : ""}`}
                style={{ background: p }}
                aria-label={p}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-mist">Icon</label>
          <div className="flex flex-wrap gap-2">
            {iconOptions.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setIcon(opt)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${icon === opt ? "border-mint-400 text-mint-400 bg-mint-400/10" : "border-white/10 text-mist hover:text-ink"}`}
              >
                <CategoryIcon icon={opt} className="h-4.5 w-4.5" />
              </button>
            ))}
          </div>
        </div>

        <Button text="Add category" type="submit" fullWidth loading={saving} />
      </form>
    </Modal>
  );
}

function BudgetModal({
  open, onClose, onSaved, month, year, current,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  month: number;
  year: number;
  current: number | null;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAmount(current ? String(current) : "");
    setError("");
  }, [current, open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await budgetsApi.setBudget(month, year, Number(amount));
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not save budget.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Budget for ${MONTH_NAMES[month - 1]} ${year}`}>
      {error ? (
        <div className="mb-4 rounded-xl border border-coral-400/30 bg-coral-400/10 px-4 py-2.5 text-sm text-coral-400">
          {error}
        </div>
      ) : null}
      <form onSubmit={handleSubmit}>
        <Input label="Monthly budget (₹)" type="number" min="0" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="e.g. 25000" />
        <Button text="Save budget" type="submit" fullWidth loading={saving} />
      </form>
    </Modal>
  );
}

export default Dashboard;
