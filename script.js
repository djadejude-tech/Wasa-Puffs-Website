document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.product-card, .about-section, .contact-card, .feedback-card').forEach(el => {
    observer.observe(el);
  });

  // Header scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.style.padding = window.scrollY > 80 ? '0.7rem 2.5rem' : '1rem 2.5rem';
    header.style.background = window.scrollY > 80 ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.9)';
  });

  // Hero parallax — ✅ FIXED missing `translate(` and backticks
  const hero = document.querySelector('.hero');
  window.addEventListener('mousemove', (e) => {
    if (!hero) return;
    hero.style.transform = `translate(${(e.clientX - window.innerWidth / 2) * 0.015}px, ${(e.clientY - window.innerHeight / 2) * 0.015}px)`;
  });

  // ==========================================
  // FEEDBACK SUBMISSION — Saves to localStorage
  // ==========================================
  const feedbackForm = document.getElementById('feedbackForm');
  if (!feedbackForm) return;

  const stars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('feedbackRating');
  const successMsg = document.getElementById('feedbackSuccess');

  // Star rating
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      ratingInput.value = rating;
      stars.forEach((s, i) => s.classList.toggle('active', i < rating));
    });
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating);
      stars.forEach((s, i) => s.classList.toggle('hovered', i < rating));
    });
  });
  document.querySelector('.rating-stars')?.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('hovered'));
  });

  // Submit
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('feedbackName').value.trim();
    const rating = parseInt(ratingInput.value) || 0;
    const message = document.getElementById('feedbackMessage').value.trim();

    if (!name || !message) {
      alert('Please fill in all fields.');
      return;
    }

    // Get existing + add new
    const saved = localStorage.getItem('wasaFeedback');
    const feedbackList = saved ? JSON.parse(saved) : [];
    feedbackList.unshift({
      id: Date.now().toString(),
      name, rating, message,
      time: new Date().toISOString(),
      read: false
    });

    // SAVE — admin reads this
    localStorage.setItem('wasaFeedback', JSON.stringify(feedbackList));
    localStorage.setItem('wasaFeedbackUpdated', Date.now().toString());

    console.log('✅ Feedback saved! Total:', feedbackList.length);

    // Show success
    if (successMsg) {
      feedbackForm.style.display = 'none';
      successMsg.style.display = 'block';
    } else {
      alert('✅ Feedback sent! Open admin to view.');
    }

    // Reset
    setTimeout(() => {
      feedbackForm.reset();
      stars.forEach(s => s.classList.remove('active'));
      ratingInput.value = '0';
      if (successMsg) {
        feedbackForm.style.display = 'block';
        successMsg.style.display = 'none';
      }
    }, 4000);
  });
});
