export type Category =
  | "Housing"
  | "Food"
  | "Transport"
  | "Subscriptions"
  | "Entertainment"
  | "Health"
  | "Income";

export type TxStatus = "cleared" | "pending";

export interface Transaction {
  id: string;
  description: string;
  category: Category;
  date: string;
  amount: number; // negative = expense, positive = income
  status: TxStatus;
}

export interface BudgetCategory {
  category: Category;
  limit: number;
  spent: number;
}

export const TRANSACTIONS: Transaction[] = [
  { id: "1", description: "Whole Foods", category: "Food", date: "Jun 9", amount: -84, status: "cleared" },
  { id: "2", description: "Electric bill", category: "Housing", date: "Jun 8", amount: -62, status: "cleared" },
  { id: "3", description: "Uber", category: "Transport", date: "Jun 7", amount: -14.5, status: "cleared" },
  { id: "4", description: "Netflix", category: "Subscriptions", date: "Jun 7", amount: -18, status: "cleared" },
  { id: "5", description: "Spotify", category: "Subscriptions", date: "Jun 1", amount: -10, status: "cleared" },
  { id: "6", description: "Paycheck", category: "Income", date: "Jun 1", amount: 3000, status: "cleared" },
  { id: "7", description: "Planet Fitness", category: "Health", date: "Jun 1", amount: -25, status: "pending" },
  { id: "8", description: "Rent", category: "Housing", date: "Jun 1", amount: -850, status: "cleared" },
  { id: "9", description: "Target", category: "Entertainment", date: "May 31", amount: -65, status: "cleared" },
  { id: "10", description: "Chipotle", category: "Food", date: "May 30", amount: -18, status: "cleared" },
];

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { category: "Housing", limit: 900, spent: 850 },
  { category: "Food", limit: 400, spent: 420 },
  { category: "Transport", limit: 300, spent: 210 },
  { category: "Subscriptions", limit: 100, spent: 95 },
  { category: "Entertainment", limit: 150, spent: 180 },
  { category: "Health", limit: 100, spent: 25 },
];

export const WEEKLY_SPENDING = [
  { day: "Mon", amount: 45 },
  { day: "Tue", amount: 120 },
  { day: "Wed", amount: 30 },
  { day: "Thu", amount: 88 },
  { day: "Fri", amount: 62 },
  { day: "Sat", amount: 210 },
  { day: "Sun", amount: 22 },
];

export const CATEGORY_BREAKDOWN = [
  { category: "Housing", amount: 850, color: "#378ADD" },
  { category: "Food", amount: 420, color: "#1D9E75" },
  { category: "Transport", amount: 210, color: "#EF9F27" },
  { category: "Subscriptions", amount: 95, color: "#7F77DD" },
  { category: "Entertainment", amount: 180, color: "#D85A30" },
];

export const TOTAL_BUDGET = 3000;
export const TOTAL_SPENT = 2340;
export const TOTAL_INCOME = 3000;
