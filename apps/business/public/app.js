const $ = (id) => document.getElementById(id);
const results = $("results");

function fmtMoney(n) { return "$" + (Number(n).toFixed(2)); }

function calc() {
  const arpu = Number($("arpu").value || 0);
  const cac = Number($("cac").value || 0);
  const gm = Math.min(100, Math.max(0, Number($("grossMargin").value || 0))) / 100; // 0..1
  const churn = Math.min(100, Math.max(0, Number($("churn").value || 0))) / 100; // 0..1
  const fixed = Number($("fixed").value || 0);

  // Simple lifetime in months (1/churn) capped for sanity
  const lifetimeMonths = churn > 0 ? Math.min(60, 1 / churn) : 60;
  const grossARPU = arpu * gm; // contribution after margin
  const LTV = grossARPU * lifetimeMonths; // simple LTV estimate
  const paybackMonths = grossARPU > 0 ? cac / grossARPU : Infinity;

  // Users to break even on fixed costs (at steady state)
  const usersForBreakeven = grossARPU > 0 ? Math.ceil(fixed / grossARPU) : Infinity;

  // Minimal levers
  const targetPayback = 6; // months
  const requiredGrossARPU = cac / targetPayback;
  const requiredMarginAtCurrentPrice = arpu > 0 ? requiredGrossARPU / arpu : Infinity;
  const reduceCAC10 = cac * 0.9;
  const paybackIfReduceCAC10 = grossARPU > 0 ? reduceCAC10 / grossARPU : Infinity;
  const churnDelta = Math.max(0, churn - 0.01); // reduce churn by 1pp
  const lifetimeIfReduceChurn1pp = churnDelta > 0 ? Math.min(60, 1 / churnDelta) : 60;
  const LTVIfReduceChurn1pp = grossARPU * lifetimeIfReduceChurn1pp;

  const rows = [
    [`Gross ARPU`, fmtMoney(grossARPU)],
    [`Simple LTV`, fmtMoney(LTV) + ` (${lifetimeMonths.toFixed(1)} mo)`],
    [`CAC Payback`, isFinite(paybackMonths) ? paybackMonths.toFixed(1) + ' mo' : '—'],
    [`Users to Break Even`, isFinite(usersForBreakeven) ? usersForBreakeven : '—'],
    [`Required gross ARPU for ${targetPayback} mo payback`, fmtMoney(requiredGrossARPU)],
    [`Required margin at current price`, isFinite(requiredMarginAtCurrentPrice) ? (requiredMarginAtCurrentPrice*100).toFixed(1) + '%' : '—'],
    [`If CAC -10%`, `Payback → ${isFinite(paybackIfReduceCAC10) ? paybackIfReduceCAC10.toFixed(1) + ' mo' : '—'}`],
    [`If churn -1pp`, `LTV → ${fmtMoney(LTVIfReduceChurn1pp)} (${lifetimeIfReduceChurn1pp.toFixed(1)} mo)`],
  ];

  results.innerHTML = '';
  for (const [k, v] of rows) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${k}:</strong> ${v}`;
    results.appendChild(li);
  }
}

$("calc").addEventListener('click', calc);
$("reset").addEventListener('click', () => {
  $("arpu").value = 20;
  $("cac").value = 60;
  $("grossMargin").value = 75;
  $("churn").value = 5;
  $("fixed").value = 5000;
  calc();
});

// Initial render
calc();

