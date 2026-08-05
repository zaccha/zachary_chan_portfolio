// Highlights the current section's link in the header nav.
// Purely a nice-to-have — the page works fully without this file.

const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

// Clearing this on a real user scroll (wheel/touch/key) rather than any scroll
// event matters: smooth-scrolling after a click fires scroll events too, and
// we don't want those to yank the highlight off the link the user just picked.
let holdOnClick = false;

function setActive(id) {
  navLinks.forEach(link => {
    link.classList.toggle('is-current', link.getAttribute('href') === `#${id}`);
  });
}

function updateActive() {
  if (holdOnClick || !sections.length) return;

  const atBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

  // The last few sections are short enough to share one screen, so at the
  // bottom of the page scroll position can't tell them apart — pick the last.
  if (atBottom) {
    setActive(sections[sections.length - 1].id);
    return;
  }

  const line = window.scrollY + 100; // just below the sticky header
  let current = sections[0];
  sections.forEach(section => {
    if (section.offsetTop <= line) current = section;
  });
  setActive(current.id);
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const id = link.getAttribute('href').slice(1);
    setActive(id);
    holdOnClick = true;
  });
});

['wheel', 'touchmove', 'keydown'].forEach(evt => {
  window.addEventListener(evt, () => {
    if (!holdOnClick) return;
    holdOnClick = false;
    updateActive();
  }, { passive: true });
});

window.addEventListener('scroll', updateActive, { passive: true });
window.addEventListener('resize', updateActive);
updateActive();

// Sections/cards gently rise into view the first time they're scrolled to.
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // No IntersectionObserver support — just show everything.
  revealEls.forEach(el => el.classList.add('is-visible'));
}
