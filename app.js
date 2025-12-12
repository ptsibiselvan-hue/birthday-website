/* app.js - simple, dependency-free animations and UI behaviors
   Customize: set FRIEND_NAME variable and replace images in assets/
*/

document.addEventListener('DOMContentLoaded', () => {
  const FRIEND_NAME = "***********"; // <-- change this to your friend's name
  // Set names on the pages
  const setNameElems = () => {
    const n1 = document.getElementById('friend-name');
    const n2 = document.getElementById('friend-name-prop');
    if (n1) n1.textContent = FRIEND_NAME;
    if (n2) n2.textContent = FRIEND_NAME;
    // brand links
    document.querySelectorAll('.brand').forEach(el => el.innerHTML = `💫 For ${FRIEND_NAME}`);
  };
  setNameElems();

  /* ---------- Hero particles (light floating dots) ---------- */
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles;
    const initParticles = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = Math.max(window.innerHeight * 0.6, 500);
      particles = [];
      const count = Math.round(W / 18);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.6 + Math.random() * 2.2,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.15 - Math.random()*0.4,
          alpha: 0.1 + Math.random()*0.5
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      // subtle gradient
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, 'rgba(255,235,241,0.18)');
      g.addColorStop(1, 'rgba(255,250,240,0.02)');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.x = Math.random() * W; p.y = H + 10; }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };
    initParticles();
    draw();
    window.addEventListener('resize', initParticles);
  }

  /* ---------- Typewriter effect ---------- */
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    const lines = [
      `May your day compile with joy.`,
      `May your life run with no bugs.`,
      `May we always have infinite loops of laughter ❤️`
    ];
    let lineI = 0, chI = 0;
    const typeSpeed = 40, pause = 900;
    const typeLoop = () => {
      const line = lines[lineI];
      if (chI <= line.length) {
        typeEl.textContent = line.slice(0, chI) + (chI % 2 ? '|' : '');
        chI++;
        setTimeout(typeLoop, typeSpeed);
      } else {
        // finished line
        chI = 0;
        lineI = (lineI + 1) % lines.length;
        setTimeout(typeLoop, pause);
      }
    };
    typeLoop();
  }

  /* ---------- Gallery keyboard navigation + click zoom ---------- */
  const images = document.querySelectorAll('.m-item img');
  images.forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });
    // parallax hover
    img.addEventListener('mousemove', (ev) => {
      const rect = img.getBoundingClientRect();
      const dx = (ev.clientX - rect.left - rect.width/2) / 20;
      const dy = (ev.clientY - rect.top - rect.height/2) / 20;
      img.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
    });
    img.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });

  function openLightbox(src, alt){
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `<div class="lightbox-inner"><img src="${src}" alt="${alt}"><button class="close-lb">✕</button></div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.close-lb').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }

  /* lightbox style inject for simplicity */
  const lbStyle = document.createElement('style');
  lbStyle.innerHTML = `
    .lightbox-overlay{position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(2,6,23,0.65);display:flex;align-items:center;justify-content:center;z-index:120}
    .lightbox-inner{position:relative;max-width:90%;max-height:90%}
    .lightbox-inner img{width:100%;height:auto;border-radius:12px;box-shadow:0 30px 80px rgba(0,0,0,0.6)}
    .close-lb{position:absolute;right:-14px;top:-14px;background:#fff;border-radius:50%;padding:8px 10px;border:0;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,0.2)}
  `;
  document.head.appendChild(lbStyle);

  /* ---------- Secret page: reveal + confetti + hearts ---------- */
  const revealBtn = document.getElementById('reveal-propose');
  if (revealBtn) {
    const msg = document.getElementById('propose-msg');
    const confCanvas = document.getElementById('confetti-canvas');
    let confettiEngine;
    revealBtn.addEventListener('click', () => {
      // show message with animation
      msg.classList.add('show');
      msg.setAttribute('aria-hidden','false');
      // run confetti
      startConfetti(confCanvas);
      // floating hearts
      startHearts();
      // optional: scroll into view
      msg.scrollIntoView({behavior:'smooth', block:'center'});
    });
  }

  function startConfetti(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const confetti = [];
    const colors = ['#ff6b9a','#ffb86b','#ffd56b','#9be6ff','#c1a9ff'];
    for (let i=0;i<120;i++){
      confetti.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height - canvas.height,
        r: 6 + Math.random()*8,
        c: colors[Math.floor(Math.random()*colors.length)],
        vx: (Math.random()-0.5)*4,
        vy: 2 + Math.random()*5,
        rot: Math.random()*360,
        vr: (Math.random()-0.5)*6
      });
    }
    let anim;
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      confetti.forEach(p=>{
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if(p.y > canvas.height + 40) { p.y = -40; p.x = Math.random()*canvas.width; }
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
        ctx.restore();
      });
      anim = requestAnimationFrame(draw);
    }
    draw();
    setTimeout(()=>{ cancelAnimationFrame(anim); ctx.clearRect(0,0,canvas.width,canvas.height); }, 8000);
  }

  function startHearts(){
    const root = document.getElementById('hearts-root');
    if (!root) return;
    let count = 0;
    const intId = setInterval(()=>{
      const h = document.createElement('div');
      h.className = 'floating-heart';
      h.style.position = 'fixed';
      h.style.left = (20 + Math.random() * (window.innerWidth - 60)) + 'px';
      h.style.bottom = '-40px';
      h.style.zIndex = 80;
      h.style.fontSize = (18 + Math.random()*28) + 'px';
      h.textContent = '❤️';
      root.appendChild(h);
      // animate up
      const dur = 4500 + Math.random()*3000;
      h.animate([
        { transform: `translateY(0) scale(1)`, opacity: 0 },
        { transform: `translateY(-${window.innerHeight * (0.6 + Math.random()*0.3)}px) scale(1.2)`, opacity: 1 },
        { transform: `translateY(-${window.innerHeight}px) scale(0.9)`, opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(.2,.9,.2,1)'});
      setTimeout(()=> h.remove(), dur + 50);
      count++;
      if (count > 24) clearInterval(intId);
    }, 220);
  }

  /* ---------- Buttons linking ---------- */
  const openGallery = document.getElementById('open-gallery');
  if (openGallery) openGallery.addEventListener('click', () => location.href='gallery.html');
  const revealSecretCTA = document.getElementById('reveal-secret');
  if (revealSecretCTA) revealSecretCTA.addEventListener('click', () => location.href='secret.html');

  /* ---------- small niceties ---------- */
  // keyboard navigate gallery with left/right to be implemented easily if needed

});
