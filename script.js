// Highlights the current section's link in the header nav while scrolling.
// Purely a nice-to-have — the page works fully without this file.

const navLinks = document.querySelectorAll('.site-nav a');
const sections = Array.from(navLinks)
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--ink)' : '';
        link.style.borderBottomColor = link.getAttribute('href') === `#${id}` ? 'var(--pine)' : '';
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
}

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
