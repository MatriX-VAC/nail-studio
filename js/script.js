(function(){
  "use strict";

  // ---------- ПРЕДЗАГРУЗЧИК ----------
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    preloader.classList.add('hidden');
    document.body.classList.add('loaded');
    initParticles();
    initCounters();
  });

  // ---------- КАСТОМНЫЙ КУРСОР ----------
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, posX = 0, posY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
  });
  function updateCursor() {
    posX += (mouseX - posX) * 0.1;
    posY += (mouseY - posY) * 0.1;
    if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px'; }
    if (follower) { follower.style.left = posX + 'px'; follower.style.top = posY + 'px'; }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('active'); follower.classList.add('active'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('active'); follower.classList.remove('active'); });
  });

  // ---------- 3D-эффект для карточек ----------
  document.querySelectorAll('.card, .gallery-item, .review-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  // ---------- HERO-КАРТОЧКА РЕАГИРУЕТ НА МЫШЬ ВСЕГДА ----------
  const heroCard = document.getElementById('heroCard');
  if (heroCard) {
    window.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / 25;
      const deltaY = (e.clientY - centerY) / 25;
      const rotateY = Math.min(Math.max(deltaX, -10), 10);
      const rotateX = Math.min(Math.max(-deltaY, -10), 10);
      heroCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    window.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  }

  // ---------- ОКНО ЗАПИСИ РЕАГИРУЕТ НА МЫШЬ ВСЕГДА ----------
  const formWrapper = document.getElementById('floatingForm');
  if (formWrapper) {
    window.addEventListener('mousemove', (e) => {
      const rect = formWrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / 30;
      const deltaY = (e.clientY - centerY) / 30;
      const rotateY = Math.min(Math.max(deltaX, -15), 15);
      const rotateX = Math.min(Math.max(-deltaY, -15), 15);
      formWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
  }

  // ---------- ЧАСТИЦЫ (Canvas) ----------
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticlesArray();
    }
    function initParticlesArray() {
      particles = [];
      const count = Math.floor(width * height / 8000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: `rgba(255, 77, 166, ${Math.random() * 0.3 + 0.1})`
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
      });
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  // ---------- АНИМАЦИЯ СЧЁТЧИКОВ ----------
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      let current = 0;
      const increment = target / 50;
      const update = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      };
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { update(); observer.disconnect(); }
      }, { threshold: 0.5 });
      observer.observe(counter);
    });
  }

  // ---------- ПОПАП ТАЙМЕР ----------
  const popup = document.getElementById('popup');
  const timerEl = document.getElementById('timer');
  let timeLeft = 900;
  function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    timerEl.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    if (timeLeft <= 0) timerEl.textContent = "0:00";
  }
  setInterval(() => { if (timeLeft > 0) { timeLeft--; updateTimerDisplay(); } }, 1000);
  document.getElementById('closePopupBtn')?.addEventListener('click', () => popup.style.display = 'none');

  // ---------- ХЕДЕР СКРОЛЛ ----------
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));

  // ---------- SCROLL REVEAL ----------
  const fadeElements = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
      }
    });
  }, { threshold: 0.2 });
  fadeElements.forEach(el => observer.observe(el));

  // ---------- ЛАЙТБОКС ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.dataset.caption || '';
      lightboxImg.src = img.src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });

  // ---------- ФОРМА ----------
  const form = document.getElementById('bookForm');
  const msgDiv = document.getElementById('formMessage');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!name || !phone) {
      msgDiv.textContent = 'Пожалуйста, заполните имя и телефон.';
      msgDiv.style.color = '#ff8080';
      return;
    }
    msgDiv.textContent = '✨ Отправляем...';
    msgDiv.style.color = 'var(--accent)';
    setTimeout(() => {
      msgDiv.textContent = 'Спасибо! Мы свяжемся с тобой в ближайшее время.';
      form.reset();
      setTimeout(() => msgDiv.textContent = '', 3000);
    }, 1500);
  });

  // ---------- ПАРАЛЛАКС ФОНА ----------
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    document.body.style.backgroundPosition = `${x * 2}% ${y * 2}%`;
  });

})();