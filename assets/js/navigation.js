window.WiemPortfolio = window.WiemPortfolio || {};

window.WiemPortfolio.initNavigation = function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!navbar || !mobileMenuBtn || !mobileMenu) return;

    const setMobileMenuOpen = (isOpen) => {
        mobileMenu.classList.toggle('hidden', !isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    };

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('glass-strong', window.scrollY > 50);
    });

    mobileMenuBtn.addEventListener('click', () => {
        setMobileMenuOpen(mobileMenu.classList.contains('hidden'));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMobileMenuOpen(false);
        }
    });

    const sectionLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = [...sectionLinks]
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            sectionLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${entry.target.id}`;
                link.classList.toggle('text-white', isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        });
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0.01 });

    sections.forEach(section => activeSectionObserver.observe(section));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function handleAnchorClick(event) {
            event.preventDefault();
            const hash = this.getAttribute('href');

            if (!hash || hash === '#') {
                setMobileMenuOpen(false);
                return;
            }

            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setMobileMenuOpen(false);
            }
        });
    });
};
