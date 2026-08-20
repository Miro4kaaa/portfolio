document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Set active link based on current URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Video Modal Logic
    const videoItems = document.querySelectorAll('.video-grid-5 video, .banner-video');
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeModal = document.querySelector('.close-modal');

    if (modal && modalVideo) {
        videoItems.forEach(video => {
            video.addEventListener('click', () => {
                modalVideo.src = video.src;
                modal.classList.add('active');
                modalVideo.play();
            });
        });

        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            modalVideo.pause();
            modalVideo.src = "";
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modalVideo.pause();
                modalVideo.src = "";
            }
        });
    }

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.project-card, .skill-card, .gallery-item, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".long-landing img, .pinterest-grid img");
    images.forEach(img => {
        img.addEventListener("click", () => {
            img.classList.toggle("zoomed");
        });
    });
});

// Force video grid thumbnails to show a specific frame
// Uses data-preview-time attribute (seconds) or falls back to 0.5s
(function() {
    function seekVideos() {
        const gridVideos = document.querySelectorAll('video[data-preview-time]');
        gridVideos.forEach(video => {
            const t = parseFloat(video.dataset.previewTime ?? 0.5);
            const doSeek = () => {
                if (video.readyState >= 1) {
                    video.currentTime = t;
                } else {
                    video.addEventListener('loadedmetadata', () => {
                        video.currentTime = t;
                    }, { once: true });
                }
            };
            doSeek();
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', seekVideos);
    } else {
        seekVideos();
    }
})();
