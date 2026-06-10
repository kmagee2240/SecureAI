import { BUDGET_CATEGORIES, TOTAL_BUDGET, TOTAL_SPENT } from "../mock/finance";

export default function Budget() {
  const remaining = TOTAL_BUDGET - TOTAL_SPENT;
  const pctUsed = Math.round((TOTAL_SPENT / TOTAL_BUDGET) * 100);

  return (
    <div>
      {/* Summary */}
      <div>
        <div>
          <p>Total budget</p>
          <p>${TOTAL_BUDGET.toLocaleString()}</p>
          <p>June 2026</p>
        </div>
        <div>
          <p>Spent so far</p>
          <p>${TOTAL_SPENT.toLocaleString()}</p>
          <p>{pctUsed}% used · ${remaining} left</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div>
        <p>Category breakdown</p>
        {BUDGET_CATEGORIES.map((b) => {
          const pct = Math.min(Math.round((b.spent / b.limit) * 100), 100);
          const over = b.spent > b.limit;

          return (
            <div key={b.category}>
              <div>
                <span>{b.category}</span>
                <div>
                  <span>
                    ${b.spent} / ${b.limit}
                  </span>
                  <span>{over ? "Over budget" : "On track"}</span>
                </div>
              </div>
              <div>
                <div style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
