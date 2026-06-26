window.WiemPortfolio = window.WiemPortfolio || {};

window.WiemPortfolio.initProjectModal = function initProjectModal() {
    const projectModal = document.getElementById('project-modal');
    const projectModalClose = document.getElementById('project-modal-close');
    const tagsContainer = document.getElementById('modal-project-tags');
    const projectDetails = window.WiemPortfolio?.projectDetails ?? {};

    if (!projectModal || !projectModalClose || !tagsContainer) return;

    let lastProjectTrigger = null;

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    const closeProjectModal = () => {
        if (typeof projectModal.close === 'function') {
            projectModal.close();
        } else {
            projectModal.removeAttribute('open');
            if (lastProjectTrigger) lastProjectTrigger.focus();
        }
    };

    document.querySelectorAll('.project-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const project = projectDetails[trigger.dataset.project];
            if (!project) return;

            lastProjectTrigger = trigger;
            setText('modal-project-category', project.category);
            setText('modal-project-title', project.title);
            setText('modal-project-summary', project.summary);
            setText('modal-project-problem', project.problem);
            setText('modal-project-approach', project.approach);
            setText('modal-project-outcome', project.outcome);
            setText('modal-project-role', project.role);
            setText('modal-project-impact', project.impact);
            setText('modal-project-status', project.status);

            tagsContainer.innerHTML = '';
            project.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag px-3 py-1 rounded-full text-xs text-primary';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });

            if (typeof projectModal.showModal === 'function') {
                projectModal.showModal();
            } else {
                projectModal.setAttribute('open', '');
            }

            projectModalClose.focus();
        });
    });

    projectModal.addEventListener('close', () => {
        if (lastProjectTrigger) lastProjectTrigger.focus();
    });

    projectModalClose.addEventListener('click', closeProjectModal);

    projectModal.addEventListener('click', (event) => {
        if (event.target === projectModal) closeProjectModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && projectModal.open) closeProjectModal();
    });
};
