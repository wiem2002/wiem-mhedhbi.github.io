window.WiemPortfolio = window.WiemPortfolio || {};

window.WiemPortfolio.initMotionAndCounters = function initMotionAndCounters() {
    const texts = ['Data Scientist', 'ML Engineer', 'Deep Learning Expert', 'NLP Specialist'];
    const typewriter = document.getElementById('typewriter');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typewriter) {
        if (prefersReducedMotion) {
            typewriter.textContent = texts[0];
        } else {
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            const type = () => {
                const currentText = texts[textIndex];
                typewriter.textContent = isDeleting
                    ? currentText.substring(0, charIndex - 1)
                    : currentText.substring(0, charIndex + 1);

                charIndex += isDeleting ? -1 : 1;
                let typeSpeed = isDeleting ? 50 : 100;

                if (!isDeleting && charIndex === currentText.length) {
                    typeSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    typeSpeed = 500;
                }

                setTimeout(type, typeSpeed);
            };

            type();
        }
    }

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => revealObserver.observe(element));

    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'), 10);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;

                if (current >= target) {
                    counter.textContent = target + (target === 99 ? '%' : '+');
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + (target === 99 ? '%' : '+');
                }
            }, 30);

            counterObserver.unobserve(counter);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
};

window.WiemPortfolio.initSkillFilters = function initSkillFilters() {
    const skillsSection = document.getElementById('skills');
    const skillsGrid = document.getElementById('skills-grid');
    const status = document.getElementById('skills-filter-status');

    if (!skillsSection || !skillsGrid) return;

    const filters = [...skillsSection.querySelectorAll('.skf-pill[data-filter]')];
    const cards = [...skillsGrid.querySelectorAll('.skc[data-category]')];

    if (!filters.length || !cards.length) return;

    const getFilterLabel = (button) => button.textContent.replace(/\s+/g, ' ').trim();

    const updateStatus = (visibleCount, activeFilter) => {
        if (!status) return;

        const label = getFilterLabel(activeFilter);
        status.textContent = activeFilter.dataset.filter === 'all'
            ? `Toutes les categories sont affichees : ${visibleCount} groupes de competences.`
            : `Filtre ${label} actif : ${visibleCount} groupe de competences affiche.`;
    };

    const applyFilter = (activeFilter) => {
        const filterValue = activeFilter.dataset.filter;
        let visibleCount = 0;

        filters.forEach(filter => {
            const isActive = filter === activeFilter;
            filter.classList.toggle('skf-pill--active', isActive);
            filter.setAttribute('aria-pressed', String(isActive));
        });

        cards.forEach(card => {
            const shouldShow = filterValue === 'all' || card.dataset.category === filterValue;
            card.hidden = !shouldShow;
            card.classList.toggle('skc--hidden', !shouldShow);
            card.setAttribute('aria-hidden', String(!shouldShow));

            if (shouldShow) {
                visibleCount += 1;
            }
        });

        updateStatus(visibleCount, activeFilter);
    };

    filters.forEach((filter, index) => {
        filter.addEventListener('click', () => applyFilter(filter));

        filter.addEventListener('keydown', (event) => {
            const lastIndex = filters.length - 1;
            let nextIndex = null;

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextIndex = index === lastIndex ? 0 : index + 1;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                nextIndex = index === 0 ? lastIndex : index - 1;
            } else if (event.key === 'Home') {
                nextIndex = 0;
            } else if (event.key === 'End') {
                nextIndex = lastIndex;
            }

            if (nextIndex === null) return;

            event.preventDefault();
            filters[nextIndex].focus();
            applyFilter(filters[nextIndex]);
        });
    });

    const initiallyActive = filters.find(filter => filter.getAttribute('aria-pressed') === 'true') || filters[0];
    applyFilter(initiallyActive);
};
