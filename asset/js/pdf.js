  // Hamburger Menu (your existing code)
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    hamburgerBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking links
    document.querySelectorAll('.main-nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
        });
    });

    // ==================== PDF MODAL FUNCTIONS ====================
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
            filepath = 'asset/resume/my resume itsupport.pdf';
        } else {
            alert("Invalid resume type");
            return;
        }

        if (filepath) {
            const link = document.createElement('a');
            link.href = filepath;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            closePDFModal();
        }
    }

    // Close modal when clicking outside
 // Replace your current outside click handler with this:
document.addEventListener('click', function(event) {
    const modal = document.getElementById('pdfModal');
    const modalContent = document.querySelector('.pdf-modal-content');

    if (modal && modal.classList.contains('active') && 
        !modalContent.contains(event.target) && 
        !event.target.closest('.contact-btn')) {
        closePDFModal();
    }
});

    // Close on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closePDFModal();
        }
    });