// lender.js
import { appState } from './state.js';
export function renderLender() {
  const container = document.createElement('div');
  container.className = 'container dashboard-lender';
  container.innerHTML = `
    <img class="dash-img" src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&q=80" alt="Lender"/>
    <h2>Lender Dashboard</h2>
    <div class="offers">
      <h3>Current Loan Offers</h3>
      <table class="offers-table">
        <thead>
          <tr><th>Type</th><th>Interest Rate</th><th>Duration</th><th>Discount</th><th>Max Amount</th></tr>
        </thead>
        <tbody>
          <tr><td>Short-term</td><td>6%</td><td>3 months</td><td>2% off first loan</td><td>$5,000</td></tr>
          <tr><td>Medium-term</td><td>8%</td><td>6 months</td><td>Spring bonus</td><td>$10,000</td></tr>
          <tr><td>Long-term</td><td>10%</td><td>12 months</td><td>Loyalty rewards</td><td>$20,000</td></tr>
          <tr><td>Instant</td><td>12%</td><td>6 weeks</td><td>Top up benefits</td><td>$2,000</td></tr>
          <tr><td>Special</td><td>5% + Prime</td><td>Flexible</td><td>Negotiable</td><td>$50,000</td></tr>
        </tbody>
      </table>
    </div>
    <h4>All Pending Loans</h4>
    <ul class="lender-list" id="pending-loans"></ul>
  `;
  function renderLoans() {
    const list = container.querySelector('#pending-loans');
    list.innerHTML = '';
    let pendingLoans = appState.loans.filter(l => l.status === 'Pending');
    pendingLoans.forEach(loan => {
      const li = document.createElement('li');
      li.innerHTML = `
        <b>${loan.username}</b><span> requested </span>
        <b>$${loan.amount}</b> for <i>${loan.purpose}</i>
        <button data-id="${loan.id}" style="float:right;">Approve</button>
      `;
      list.appendChild(li);
    });
    list.querySelectorAll('button[data-id]').forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.getAttribute('data-id'));
        const updatedLoans = appState.loans.map(l => l.id === id ? {...l, status: 'Approved'} : l);
        appState.setState({ loans: updatedLoans });
        renderLoans();
      };
    });
  }
  renderLoans();
  appState.subscribe(() => renderLoans());
  return container;
}

