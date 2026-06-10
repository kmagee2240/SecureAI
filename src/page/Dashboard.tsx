import {
  CATEGORY_BREAKDOWN,
  TOTAL_BUDGET,
  TOTAL_INCOME,
  TOTAL_SPENT,
  TRANSACTIONS,
  WEEKLY_SPENDING,
} from "../mock/finance";

export default function Dashboard() {
  const remaining = TOTAL_BUDGET - TOTAL_SPENT;
  const txCount = TRANSACTIONS.length;
  const recent = TRANSACTIONS.slice(0, 4);
  const maxWeekly = Math.max(...WEEKLY_SPENDING.map((d) => d.amount));

  return (
    <div>
      {/* Metric cards */}
      <div>
        <div>
          <p>Total spent</p>
          <p>${TOTAL_SPENT.toLocaleString()}</p>
          <p>+8% vs last month</p>
        </div>
        <div>
          <p>Remaining</p>
          <p>${remaining.toLocaleString()}</p>
          <p>of ${TOTAL_BUDGET.toLocaleString()} budget</p>
        </div>
        <div>
          <p>Transactions</p>
          <p>{txCount}</p>
          <p>this month</p>
        </div>
        <div>
          <p>Income</p>
          <p>${TOTAL_INCOME.toLocaleString()}</p>
          <p>Received Jun 1</p>
        </div>
      </div>

      {/* Spending chart */}
      <div>
        <div>
          <p>Spending this week</p>
          <div>
            {WEEKLY_SPENDING.map((d) => (
              <div key={d.day}>
                <div
                  style={{ height: `${Math.round((d.amount / maxWeekly) * 100)}%` }}
                  title={`${d.day}: $${d.amount}`}
                />
                <span>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div>
          <p>By category</p>
          {CATEGORY_BREAKDOWN.map((c) => (
            <div key={c.category}>
              <div>
                <span>{c.category}</span>
                <span>${c.amount}</span>
              </div>
              <div>
                <div style={{ width: `${Math.round((c.amount / TOTAL_SPENT) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <div>
          <p>Recent transactions</p>
          <span>View all</span>
        </div>
        {recent.map((tx) => (
          <div key={tx.id}>
            <div>
              <p>{tx.description}</p>
              <p>{tx.category}</p>
            </div>
            <div>
              <p>{tx.amount > 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}</p>
              <p>{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
