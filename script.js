const header = document.getElementById('site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
const contactModal = document.getElementById('contact-modal');
const copyPhoneButton = document.getElementById('copy-phone');
const phoneDisplay = '(630) 307-0200';
const phoneDigits = '6303070200';
let lastFocusedElement = null;

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

function isDesktopCallExperience() {
  return window.matchMedia('(min-width: 961px)').matches;
}

function openContactModal(trigger) {
  if (!contactModal) return;
  lastFocusedElement = trigger || document.activeElement;
  contactModal.hidden = false;
  contactModal.style.display = 'grid';
  document.body.classList.add('contact-modal-open');
  requestAnimationFrame(() => contactModal.classList.add('is-open'));
}

function closeContactModal() {
  if (!contactModal || contactModal.hidden) return;
  contactModal.classList.remove('is-open');
  document.body.classList.remove('contact-modal-open');
  window.setTimeout(() => {
    contactModal.hidden = true;
    contactModal.style.display = 'none';
    lastFocusedElement?.focus?.({ preventScroll: true });
  }, 180);
}

document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', event => {
    if (!isDesktopCallExperience()) return;
    if (link.closest('.contact-modal')) return;
    event.preventDefault();
    event.stopPropagation();
    openContactModal(link);
  });
});

contactModal?.querySelectorAll('[data-contact-close]').forEach(control => {
  control.addEventListener('click', closeContactModal);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && contactModal && !contactModal.hidden) closeContactModal();
});

copyPhoneButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(phoneDigits);
    copyPhoneButton.textContent = 'Copied';
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = phoneDisplay;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    copyPhoneButton.textContent = 'Copied';
  }
  window.setTimeout(() => {
    copyPhoneButton.textContent = 'Copy Number';
  }, 1600);
});

document.getElementById('year').textContent = new Date().getFullYear();
