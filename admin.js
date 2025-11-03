
import { appState, users } from './state.js';
export function renderAdmin() {
  const container = document.createElement('div');
  container.className = 'container dashboard-admin';
  container.innerHTML = `
    <img class="dash-img" src="https://images.unsplash.com/photo-1515165562835-c094cfc0b3c1?w=600&q=80" alt="Admin"/>
    <h2>Admin Dashboard</h2>
    <div class="test-data">
      <h3>System Overview (Demo)</h3>
      <table class="stats-table">
        <tr><th>Registered Users</th><td>${users.length}</td></tr>
        <tr><th>Total Loans Requested</th><td>${appState.loans.length}</td></tr>
        <tr><th>Approved Loans</th><td>${appState.loans.filter(l=>l.status==='Approved').length}</td></tr>
        <tr><th>Pending Loans</th><td>${appState.loans.filter(l=>l.status==='Pending').length}</td></tr>
        <tr><th>Total Value Requested</th><td>$${appState.loans.reduce((a,b)=>a+Number(b.amount),0)}</td></tr>
      </table>
      <h4>Recent Activity:</h4>
      <ul class="lender-list">
        ${appState.loans.slice(-5).reverse().map(l=>`<li>${l.username}: $${l.amount}, ${l.status}</li>`).join('')}
      </ul>
    </div>
  `;
  return container;
}
