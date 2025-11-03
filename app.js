// app.js
const users = JSON.parse(localStorage.getItem('loan_app_users')) || [
  { username: "demo", password: "demo", role: "borrower", paid: 0 }
];
let currentUser = JSON.parse(localStorage.getItem('loan_app_current_user')) || null;
function saveUsers() { localStorage.setItem('loan_app_users', JSON.stringify(users)); }
function saveCurrentUser(user) { localStorage.setItem('loan_app_current_user', JSON.stringify(user)); }
function loginPage(isSignup = false) {
  const bg = document.createElement('div');
  bg.className = 'auth-bg';
  const card = document.createElement('div');
  card.className = 'auth-card';
  card.innerHTML = `
    <h2>${isSignup ? "Sign Up" : "Login"}</h2>
    <input id="user" type="text" placeholder="Username" autocomplete="username" required />
    <input id="pass" type="password" placeholder="Password" autocomplete="current-password" required />
    <button id="authBtn">${isSignup ? "Create Account" : "Login"}</button>
    <span class="auth-toggle">
      ${isSignup ? "Already have an account?" : "No account yet?"}
      <b id="toggleAuth" style="text-decoration:underline; cursor:pointer;">
        ${isSignup ? "Login" : "Sign Up"}
      </b>
    </span>
    <div id="authMsg" style="color:red;"></div>
  `;
  bg.appendChild(card);
  card.querySelector('#authBtn').onclick = () => {
    const username = card.querySelector('#user').value.trim();
    const password = card.querySelector('#pass').value;
    const msg = card.querySelector('#authMsg');
    if (!username || !password) { msg.textContent = "Fill all fields."; return; }
    if (isSignup) {
      if (users.find(u => u.username === username)) { msg.textContent = "User exists."; return; }
      users.push({ username, password, role:"borrower", paid:0 }); saveUsers();
      msg.textContent = "Account created! Login now.";
    } else {
      const found = users.find(u => u.username === username && u.password === password);
      if (!found) { msg.textContent = "Invalid credentials."; return; }
      currentUser = found; saveCurrentUser(currentUser);
      root.innerHTML = ''; router();
    }
  };
  card.querySelector('#toggleAuth').onclick = () => {
    root.innerHTML = '';
    root.appendChild(loginPage(!isSignup));
  };
  return bg;
}
function logout() { currentUser=null; saveCurrentUser(null); router(); }
function renderNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <a href="#home"${location.hash==='#home'?' class="active"':''}>Home</a>
    <a href="#borrower"${location.hash==='#borrower'?' class="active"':''}>Borrower</a>
    <a href="#lender"${location.hash==='#lender'?' class="active"':''}>Lender</a>
    <a href="#admin"${location.hash==='#admin'?' class="active"':''}>Admin</a>
    ${currentUser ? `<span style="margin-left:auto;color:#334;font-size:1.01rem;">👤 ${currentUser.username}
      <button style="margin-left:1rem;" onclick="logout()">Logout</button>
    </span>` : ''}
  `;
  return nav;
}
const appState = {
  loans: JSON.parse(localStorage.getItem('loan_app_loans')) || [],
  subscribers: [],
  setState(newState) {
    Object.assign(this, newState);
    this.subscribers.forEach(cb => cb(this));
    localStorage.setItem('loan_app_loans', JSON.stringify(this.loans));
  },
  subscribe(cb) { this.subscribers.push(cb); }
}
function renderHome() {
  const el = document.createElement('div');
  el.style.padding = '1.5rem'; el.style.maxWidth = '600px'; el.style.margin = 'auto';
  el.innerHTML = `
    <div class="hero">
      <div class="logo-title">
        <svg width="62" height="62" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" fill="#2563eb"/>
          <text x="50%" y="58%" text-anchor="middle" fill="#fff" font-size="36" font-family="Arial" dy=".3em">💸</text>
        </svg>
        <h1>Loan Agent System</h1>
      </div>
      <img src="https://undraw.co/api/illustrations/credit-card.svg" alt="Credit Approval Illustration" class="hero-illustration" />
      <p>Welcome! Sign up or login to get started.<br/>
      <b>Borrower:</b> Request and track loans<br/>
      <b>Lender:</b> Approve & review offers<br/>
      <b>Admin:</b> See stats and system health</p>
      <button onclick="window.location.hash='#borrower'" style="margin-top:1.1rem;">Get Started</button>
    </div>
  `;
  return el;
}
function renderBorrower() {
  const container = document.createElement('div');
  container.className = 'container dashboard-borrower';
  let paid = currentUser ? currentUser.paid||0 : 0;
  let totalRequested = appState.loans.filter(l=>l.username===currentUser.username).reduce((a,l)=>a+parseFloat(l.amount),0);
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
    currentUser.paid = (currentUser.paid||0) + 100;
    saveCurrentUser(currentUser);
    router();
  };
  return container;
}
function renderLender() {
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
function renderAdmin() {
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
const root = document.getElementById('root');
function router() {
  root.innerHTML = '';
  if (!currentUser && location.hash !== '#home') {
    root.appendChild(loginPage(false));
    return;
  }
  root.appendChild(renderNavbar());
  const hash = location.hash || '#home';
  let pageElement;
  switch (hash) {
    case '#borrower': pageElement = renderBorrower(); break;
    case '#lender': pageElement = renderLender(); break;
    case '#admin': pageElement = renderAdmin(); break;
    default: pageElement = renderHome();
  }
  root.appendChild(pageElement);
}
window.addEventListener('load', router);
window.addEventListener('hashchange', router);
function initCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);
  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, input')) {
      cursor.style.backgroundColor = 'rgba(59, 130, 246, 0.16)';
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, input')) {
      cursor.style.backgroundColor = 'transparent';
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  });
}
initCursor();
