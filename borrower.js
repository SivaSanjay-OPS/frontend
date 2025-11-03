// borrower.js
import { currentUser, appState, saveCurrentUser } from './state.js';
export function renderBorrower() {
  const container = document.createElement('div');
  container.className = 'container dashboard-borrower';
  let paid = currentUser ? currentUser.paid || 0 : 0;
  let totalRequested = appState.loans.filter(l => l.username === currentUser.username).reduce((a,l)=>a+parseFloat(l.amount),0);
  let toPay = totalRequested - paid;
  container.innerHTML = `
    <img class="dash-img" src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80" alt="Borrower"/>
    <h2>Borrower Dashboard</h2>
    <div id="loanPaidInfo">
      <strong>Total Requested:</strong> $${totalRequested} &nbsp;|&nbsp;
      <strong>Paid:</strong> $${paid} &nbsp;|&nbsp;
      <strong>To Pay:</strong> $${toPay}
    </div>
    <div class="benefits">
      <h3>Borrower Benefits</h3>
      <ul>
        <li>Fast loan approval</li>
        <li>Lowest interest rates</li>
        <li>Track all requests, repayments</li>
      </ul>
    </div>
    <form id="loan-form">
      <label>Loan Amount</label>
      <input type="number" id="loan-amount" placeholder="Amount" required min="1"/>
      <label>Purpose</label>
      <input type="text" id="loan-purpose" placeholder="Loan Purpose" required />
      <button type="submit">Request Loan</button>
    </form>
    <h4>Your Loan Requests:</h4>
    <ul class="borrower-list" id="loan-list"></ul>
    <button id="payBtn" style="width:100%;margin-top:10px;">Pay $100</button>
  `;
  const tips = document.createElement('div');
  tips.className = 'floating-tips';
  tips.innerHTML = `
    💡 <strong>Tips for Borrowers:</strong>
    <ul>
      <li>Check status and repayment due for each loan.</li>
      <li>Add accurate details for fastest approval.</li>
      <li>Pay early for extra benefits!</li>
    </ul>
  `;
  container.appendChild(tips);
  function renderLoans() {
    let myLoans = appState.loans.filter(l => l.username === currentUser.username);
    const loanList = container.querySelector('#loan-list');
    loanList.innerHTML = '';
    myLoans.forEach(loan => {
      const li = document.createElement('li');
      li.textContent = `Amount: $${loan.amount}, Purpose: ${loan.purpose}, Status: ${loan.status}`;
      loanList.appendChild(li);
    });
  }
  renderLoans();
  appState.subscribe(() => renderLoans());
  container.querySelector('#loan-form').onsubmit = e => {
    e.preventDefault();
    const amount = container.querySelector('#loan-amount').value;
    const purpose = container.querySelector('#loan-purpose').value;
    if (!amount || !purpose) return;
    appState.setState({
      loans: [...appState.loans, {
        id: Date.now(),
        username: currentUser.username,
        type: 'borrower',
        amount,
        purpose,
        status: 'Pending'
      }]
    });
    container.querySelector('#loan-form').reset();
    renderLoans();
  };
  container.querySelector('#payBtn').onclick = () => {
    currentUser.paid = (currentUser.paid || 0) + 100;
    saveCurrentUser(currentUser);
    window.location.reload();
  };
  return container;
}

