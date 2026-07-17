// ==================== NAV ====================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });

    document.querySelectorAll('.main-nav-links > a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
        });
    });

    // Mobile: tap dropdown toggle to expand submenu instead of navigating
    document.querySelectorAll('.nav-dropdown > .dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 720) {
                e.preventDefault();
                toggle.closest('.nav-dropdown').classList.toggle('open');
            }
        });
    });
}

// ==================== PDF MODAL ====================
function openPDFModal() {
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePDFModal() {
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function downloadResume(type) {
    let filename, filepath;

    if (type === 'developer') {
        filename = 'Developer Resume - James Aries Concepcion.pdf';
        filepath = 'asset/resume/developer resume.pdf';
    } else if (type === 'itsupport') {
        filename = 'IT Support Resume - James Aries Concepcion.pdf';
        filepath = 'asset/resume/IT Support Resume - James Aries Concepcion.pdf';
    } else {
        alert("Invalid resume type");
        return;
    }

    const link = document.createElement('a');
    link.href = filepath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    closePDFModal();
}

document.addEventListener('click', function (event) {
    const modal = document.getElementById('pdfModal');
    const modalContent = document.querySelector('.pdf-modal-content');
    if (modal && modal.classList.contains('active') &&
        modalContent && !modalContent.contains(event.target) &&
        !event.target.closest('.contact-btn')) {
        closePDFModal();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closePDFModal();
        closeViberModal();
        closeContactModal();
    }
});

// ==================== VIBER MODAL ====================
function openViberModal() {
    const m = document.getElementById('viberModal');
    if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeViberModal() {
    const m = document.getElementById('viberModal');
    if (m) { m.classList.remove('active'); document.body.style.overflow = 'auto'; }
}

// ==================== PROJECT SLIDERS ====================
document.querySelectorAll("[data-slider]").forEach(slider => {
    let index = 0;
    const slides = slider.querySelectorAll(".slides");
    const dotsContainer = slider.querySelector(".dots");
    const prev = slider.querySelector(".nav-prev");
    const next = slider.querySelector(".nav-next");

    slides.forEach(() => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".dot");

    function showSlide(i) {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));
        slides[i].classList.add("active");
        dots[i].classList.add("active");
    }
    showSlide(index);

    function nextSlide() { index = (index + 1) % slides.length; showSlide(index); }
    function prevSlide() { index = (index - 1 + slides.length) % slides.length; showSlide(index); }

    let interval = setInterval(nextSlide, 3500);
    next.addEventListener("click", () => { nextSlide(); clearInterval(interval); interval = setInterval(nextSlide, 3500); });
    prev.addEventListener("click", () => { prevSlide(); clearInterval(interval); interval = setInterval(nextSlide, 3500); });
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => { index = i; showSlide(index); clearInterval(interval); interval = setInterval(nextSlide, 3500); });
    });
    slider.addEventListener("mouseover", () => clearInterval(interval));
    slider.addEventListener("mouseout", () => interval = setInterval(nextSlide, 3500));
});

document.querySelectorAll(".card").forEach(card => {
    const desc = card.querySelector(".content p");
    const btn = card.querySelector(".see-more-btn");
    if (!desc || !btn) return;
    btn.addEventListener("click", () => {
        desc.classList.toggle("expanded");
        btn.textContent = desc.classList.contains("expanded") ? "See Less" : "See More";
    });
});

// ==================== THEME (DARK / LIGHT) ====================
(function () {
    const root = document.documentElement;
    const toggleBtns = document.querySelectorAll('.theme-toggle');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        toggleBtns.forEach(btn => btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'));
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('jac-theme', next);
            applyTheme(next);
        });
    });

    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
})();

// ==================== CONTACT MODAL ====================

function openContactModal() {
    const m = document.getElementById('contactModal');
    if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeContactModal() {
    const m = document.getElementById('contactModal');
    if (m) { m.classList.remove('active'); document.body.style.overflow = 'auto'; }
}

(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');
    const submitBtn = form.querySelector('.contact-submit');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // honeypot spam check
        if (form.querySelector('.honeypot-field input').value) return;

        status.className = 'form-status';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const endpoint = form.getAttribute('action');
        const isConfigured = endpoint && !endpoint.includes('REPLACE_WITH_YOUR_FORM_ID');

        if (!isConfigured) {
            status.innerHTML = 'Contact form isn\'t connected yet. Email me directly at <a href="mailto:jamesconcepcion122@gmail.com">jamesconcepcion122@gmail.com</a>.';
            status.classList.add('show', 'err');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            return;
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });
            if (res.ok) {
                status.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
                status.classList.add('show', 'ok');
                form.reset();
            } else {
                throw new Error('Request failed');
            }
        } catch (err) {
            status.innerHTML = 'Something went wrong. Please email me directly at <a href="mailto:jamesconcepcion122@gmail.com">jamesconcepcion122@gmail.com</a>.';
            status.classList.add('show', 'err');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
})();

// ==================== FLOATING ACTION BUTTONS ====================
(function () {
    const topBtn = document.getElementById('fabTop');
    if (!topBtn) return;
    window.addEventListener('scroll', () => {
        topBtn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ==================== NAV SCROLL STATE ====================
const siteHeader = document.querySelector('.main-hedeaer');
if (siteHeader) {
    const onScroll = () => {
        siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ==================== SCROLL REVEAL ====================
(function () {
    const targets = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
        targets.forEach(t => t.classList.add('in-view'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
})();

// ==================== ANIMATED SKILL BARS ====================
(function () {
    const bars = document.querySelectorAll('.progress[data-width]');
    if (!bars.length) return;
    if (!('IntersectionObserver' in window)) {
        bars.forEach(b => { b.style.width = b.dataset.width + '%'; b.classList.add('filled'); });
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.width = el.dataset.width + '%';
                el.classList.add('filled');
                io.unobserve(el);
            }
        });
    }, { threshold: 0.4 });
    bars.forEach(b => io.observe(b));
})();

// ==================== TERMINAL TYPING EFFECT ====================
(function () {
    const body = document.getElementById('termBody');
    if (!body) return;

    const lines = [
        { text: '$ whoami', cls: 'prompt' },
        { text: 'james_aries_concepcion', cls: 'out' },
        { text: '$ cat status.txt', cls: 'prompt' },
        { text: 'open_to_work: true', cls: 'out' },
        { text: 'shift: day | night', cls: 'out' },
        { text: '$ skills --top 3', cls: 'prompt' },
        { text: 'troubleshooting, networking, php/mysql', cls: 'out' },
    ];

    let li = 0, ci = 0;
    const speed = 26;

    function typeNext() {
        if (li >= lines.length) return;
        const current = lines[li];
        if (ci === 0) {
            const lineEl = document.createElement('span');
            lineEl.className = 'term-line ' + current.cls;
            lineEl.dataset.idx = li;
            body.appendChild(lineEl);
        }
        const lineEl = body.querySelector(`.term-line[data-idx="${li}"]`);
        if (ci <= current.text.length) {
            lineEl.textContent = current.text.slice(0, ci);
            ci++;
            setTimeout(typeNext, speed);
        } else {
            li++; ci = 0;
            setTimeout(typeNext, li < lines.length && lines[li].cls === 'out' ? 120 : 380);
        }
    }

    const cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    body.appendChild(cursor);

    if (!('IntersectionObserver' in window)) {
        typeNext();
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeNext();
                io.disconnect();
            }
        });
    }, { threshold: 0.3 });
    io.observe(body);
})();

// ==================== CERTIFICATE MODAL ====================
document.querySelectorAll('.cert-card').forEach(card => {
    const imageWrapper = card.querySelector('.cert-image-wrapper');
    const certImage = imageWrapper.querySelector('img');
    const modal = document.getElementById('certModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');

    imageWrapper.addEventListener('click', () => {
        modal.classList.add('active');
        modalImage.src = certImage.src;
        modalCaption.textContent = certImage.alt;
        document.body.style.overflow = 'hidden';
    });
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
