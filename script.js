(() => {
  'use strict';

  const MAIL = 'hp@sangkuriang.co.id';
  const WA = '6285111371042';

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Filters ---------- */
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.job-card');
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      cards.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.cat === f); });
    });
  });

  /* ---------- Job dialog ---------- */
  const dialog = document.getElementById('job-dialog');
  const dTitle = document.getElementById('dialog-title');
  const dCat = document.getElementById('dialog-cat');
  const dBody = document.getElementById('dialog-body');
  const dMail = document.getElementById('dialog-mail');
  const dWa = document.getElementById('dialog-wa');
  const catLabel = { tech: 'Technology', business: 'Business', people: 'People' };

  const openJob = (card) => {
    const title = card.dataset.title;
    dTitle.textContent = title;
    dCat.textContent = `${catLabel[card.dataset.cat] || 'Open'} · Open position`;
    dBody.innerHTML = card.querySelector('.job-detail').innerHTML;
    dMail.href = `mailto:${MAIL}?subject=${encodeURIComponent('Job Application - ' + title)}&body=${encodeURIComponent('Dear Sangkuriang Internasional HR Team,\n\nI would like to apply for the position of ' + title + '. Please find my CV & portfolio attached.\n\nBest regards,')}`;
    dWa.href = `https://wa.me/${WA}?text=${encodeURIComponent('Hello, I would like to ask about the ' + title + ' position at Sangkuriang Internasional.')}`;
    dialog.showModal();
    dBody.scrollTop = 0;
  };

  cards.forEach((card) => {
    card.addEventListener('click', (e) => { if (!e.target.closest('a')) openJob(card); });
  });

  document.getElementById('dialog-close').addEventListener('click', () => dialog.close());

  // Light-dismiss fallback for browsers without <dialog closedby> (e.g. Safari)
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      const inside = r.top <= event.clientY && event.clientY <= r.top + r.height &&
                     r.left <= event.clientX && event.clientX <= r.left + r.width;
      if (!inside) dialog.close();
    });
  }

  // Lock page scroll while open
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  new MutationObserver(() => { document.body.style.overflow = dialog.open ? 'hidden' : ''; })
    .observe(dialog, { attributes: true, attributeFilter: ['open'] });

  /* ---------- Hero role chips → open matching job ---------- */
  document.querySelectorAll('[data-open]').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const card = document.querySelector(`.job-card[data-id="${chip.dataset.open}"]`);
      // reset filter to "all" so the card is visible
      document.querySelector('.filter[data-filter="all"]').click();
      document.getElementById('positions').scrollIntoView({ behavior: 'smooth' });
      if (card) setTimeout(() => openJob(card), 500);
    });
  });

  /* ---------- Reveal fallback (no scroll-driven animation support) ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!CSS.supports('animation-timeline: view()') && !reduce && 'IntersectionObserver' in window) {
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => { el.style.opacity = '0'; el.style.translate = '0 36px'; el.style.transition = 'opacity .7s ease, translate .7s cubic-bezier(.2,.8,.2,1)'; });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.style.opacity = '1';
        en.target.style.translate = '0 0';
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }
})();
