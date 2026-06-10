import { useState } from "react";
import { TRANSACTIONS, type Transaction, type TxStatus } from "../mock/finance";

export default function Transactions() {
  const [filter, setFilter] = useState<TxStatus | "all">("all");

  const filtered =
    filter === "all" ? TRANSACTIONS : TRANSACTIONS.filter((tx) => tx.status === filter);

  return (
    <div>
      {/* Toolbar */}
      <div>
        <div>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("cleared")}>Cleared</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>
        <button>Add transaction</button>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((tx: Transaction) => (
            <tr key={tx.id}>
              <td>{tx.description}</td>
              <td>{tx.category}</td>
              <td>{tx.date}</td>
              <td>
                {tx.amount > 0
                  ? `+$${tx.amount.toFixed(2)}`
                  : `-$${Math.abs(tx.amount).toFixed(2)}`}
              </td>
              <td>{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
