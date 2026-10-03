const header = document.getElementById('site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 30);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

toggle?.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  header.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    header.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
