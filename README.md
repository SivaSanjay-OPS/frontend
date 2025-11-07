# Loan Management System

A web-based Loan Management System that allows **Borrowers** to request and track loans, **Lenders** to review and approve requests, and **Admins** to monitor system statistics. Built with **Vanilla JavaScript, HTML, and CSS**, the system simulates a React-like architecture with modular components, reactive state management, and data persistence.

---

## Features

### Borrower Dashboard
- Request new loans with amount and purpose.
- Track all requested loans and repayment status.
- Pay installments and see real-time updates.

### Lender Dashboard
- View all pending loan requests.
- Approve loans with a single click.
- Offers table displaying different loan types and rates.

### Admin Dashboard
- View system statistics: total users, total loans, approved/pending loans, and total loan value.
- Recent activity feed showing the latest loan requests.

### Common Features
- Modular, reusable components for each dashboard.
- Centralized state management using `appState`.
- Hash-based routing with a dynamic navbar.
- Data persistence using **Local Storage**.
- Interactive UI with floating tips, active highlights, and responsive design.
- Cursor effect for enhanced UX.

---

## Technical Details

- **State Management:** Central `appState` with subscription mechanism (similar to React `useState`/`useEffect`).
- **Routing:** Hash-based routing for single-page navigation.
- **Persistence:** Local Storage for users, loans, and current user data.
- **UI/UX:** Clean and responsive dashboards, tables, and forms with visual feedback.

---

## How to Run

1. Clone or download the repository.
2. Open `index.html` in a web browser.
3. Use the preloaded demo account or sign up as a new user:
   - Username: `demo`
   - Password: `demo`
4. Navigate between **Home**, **Borrower**, **Lender**, and **Admin** dashboards using the navbar.

---

## Project Structure

