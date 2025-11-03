export function renderNavbar() {
  const nav = document.createElement('nav');
  nav.classList.add('navbar');

  nav.innerHTML = `
    <a href="#home" id="nav-home">Home</a>
    <a href="#borrower" id="nav-borrower">Borrower</a>
    <a href="#lender" id="nav-lender">Lender</a>
    <a href="#admin" id="nav-admin">Admin</a>
  `;

  nav.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      window.location.hash = event.target.getAttribute('href');
    }
  });

  return nav;
}
