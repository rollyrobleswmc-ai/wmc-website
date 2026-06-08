document.addEventListener('DOMContentLoaded', () => {

  /* Nav scroll */
  const nav = document.querySelector('.nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

  /* Mobile menu */
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => { menu.classList.toggle('open'); toggle.classList.toggle('active'); });
    document.querySelectorAll('.nav__item').forEach(item => {
      const link = item.querySelector('.nav__link');
      const drop = item.querySelector('.nav__dropdown');
      if (drop && link) link.addEventListener('click', e => { if (window.innerWidth <= 768) { e.preventDefault(); item.classList.toggle('open'); } });
    });
  }

  /* Fade-up */
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

  /* Counter animation */
  const cobs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cobs.unobserve(e.target); } }), { threshold: 0.5 });
  document.querySelectorAll('.stat__num[data-count]').forEach(el => cobs.observe(el));
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    const upd = now => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(ease * target).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(upd);
    };
    requestAnimationFrame(upd);
  }

  /* Testimonials show more */
  const btn = document.getElementById('show-more-testimonials');
  if (btn) {
    btn.addEventListener('click', () => {
      const hidden = document.querySelectorAll('.tcard.hidden');
      if (hidden.length === 0) {
        document.querySelectorAll('.tcard').forEach((c,i) => { if (i >= 6) c.classList.add('hidden'); });
        btn.textContent = 'View All Testimonials';
      } else {
        hidden.forEach(c => c.classList.remove('hidden'));
        btn.textContent = 'Show Less';
      }
    });
  }

  /* Gallery lightbox */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (lb && lbImg) {
    document.querySelectorAll('.gallery__item img').forEach(img => {
      img.addEventListener('click', () => { lbImg.src = img.src; lb.classList.add('active'); });
    });
    document.getElementById('lightbox-close').addEventListener('click', () => lb.classList.remove('active'));
    lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('active'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('active'); });
  }

  /* Alumni search + filter */
  const alumniSearch = document.getElementById('alumni-search');
  const alumniFilter = document.querySelectorAll('.filter-btn[data-desig]');
  const alumniRows   = document.querySelectorAll('.alumni-row');
  const alumniCountEl = document.getElementById('alumni-count');

  function filterAlumni() {
    const q = alumniSearch ? alumniSearch.value.toLowerCase() : '';
    const activeDesig = [...alumniFilter].find(b => b.classList.contains('active'))?.dataset.desig || 'all';
    let count = 0;
    alumniRows.forEach(row => {
      const name  = row.dataset.name || '';
      const desig = row.dataset.desig || '';
      const matchQ = name.includes(q);
      const matchD = activeDesig === 'all' || desig.includes(activeDesig.toLowerCase());
      const show = matchQ && matchD;
      row.style.display = show ? '' : 'none';
      if (show) count++;
    });
    if (alumniCountEl) alumniCountEl.innerHTML = `Showing <span>${count}</span> alumni`;
  }

  if (alumniSearch) alumniSearch.addEventListener('input', filterAlumni);
  alumniFilter.forEach(btn => {
    btn.addEventListener('click', () => {
      alumniFilter.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterAlumni();
    });
  });

  /* Contact form */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const sb = form.querySelector('[type=submit]');
      sb.textContent = 'Message Sent ✓';
      sb.style.background = 'var(--deep-teal)';
      sb.style.color = 'var(--ivory)';
      setTimeout(() => { sb.textContent = 'Send Message'; sb.style.background = ''; sb.style.color = ''; form.reset(); }, 3000);
    });
  }
});
