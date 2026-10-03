const header = document.getElementById('site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
const contactModal = document.getElementById('contact-modal');
const copyPhoneButton = document.getElementById('copy-phone');
const phoneDisplay = '(630) 307-0200';
const phoneDigits = '6303070200';
let lastFocusedElement = null;
let inertedElements = [];

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 30);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function setMenuState(open, { returnFocus = false } = {}) {
  if (!nav || !toggle || !header) return;
  nav.classList.toggle('open', open);
  header.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (returnFocus) toggle.focus({ preventScroll: true });
}

toggle?.setAttribute('aria-label', 'Open navigation');
toggle?.addEventListener('click', () => setMenuState(!nav?.classList.contains('open')));

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuState(false));
});

function isDesktopCallExperience() {
  return window.matchMedia('(min-width: 961px)').matches;
}

function getModalFocusable() {
  if (!contactModal) return [];
  return [...contactModal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.hasAttribute('hidden') && element.offsetParent !== null);
}

function setBackgroundInert(inert) {
  if (inert) {
    inertedElements = [...document.body.children].filter(element => element !== contactModal && element.tagName !== 'SCRIPT');
    inertedElements.forEach(element => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });
  } else {
    inertedElements.forEach(element => {
      element.inert = false;
      element.removeAttribute('aria-hidden');
    });
    inertedElements = [];
  }
}

function openContactModal(trigger) {
  if (!contactModal) return;
  lastFocusedElement = trigger || document.activeElement;
  contactModal.hidden = false;
  contactModal.style.display = 'grid';
  document.body.classList.add('contact-modal-open');
  setBackgroundInert(true);
  requestAnimationFrame(() => {
    contactModal.classList.add('is-open');
    const focusable = getModalFocusable();
    (focusable[0] || contactModal.querySelector('.contact-modal__panel'))?.focus({ preventScroll: true });
  });
}

function closeContactModal() {
  if (!contactModal || contactModal.hidden) return;
  contactModal.classList.remove('is-open');
  document.body.classList.remove('contact-modal-open');
  setBackgroundInert(false);
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
  const modalOpen = contactModal && !contactModal.hidden;

  if (event.key === 'Escape') {
    if (modalOpen) {
      event.preventDefault();
      closeContactModal();
      return;
    }
    if (nav?.classList.contains('open')) {
      event.preventDefault();
      setMenuState(false, { returnFocus: true });
    }
  }

  if (event.key === 'Tab' && modalOpen) {
    const focusable = getModalFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
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

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
