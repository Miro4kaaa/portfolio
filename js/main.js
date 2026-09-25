/**
 * Main JavaScript File for Portfolio Landing Page
 * Features include: Mobile Menu, Sticky Nav, Smooth Scroll, Scroll Spy, 
 * Reveal Animations, Portfolio Filter, Lightbox, Back to Top, Marquee Pause, 
 * YouTube Lazy Load, Contact Form Validation, Preloader, and Service Item Hover.
 */

// 12. PRELOADER
// Run on window load to ensure all resources are loaded
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        
        // Wait for the CSS fade-out transition to complete before setting display: none
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.site-nav a');

    const updateMenuToggleState = (isOpen) => {
        if (!menuToggle) return;
        menuToggle.textContent = isOpen ? '✕' : '☰';
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    if (menuToggle) {
        updateMenuToggleState(false);
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            body.classList.toggle('nav-open');
            updateMenuToggleState(body.classList.contains('nav-open'));
        });
    }

    // Seek video cards to a representative thumbnail frame once metadata is ready.
    document.querySelectorAll('video[data-preview-time]').forEach(video => {
        let seekAttempts = 0;
        const seekToPreview = () => {
            const requestedTime = Number.parseFloat(video.dataset.previewTime || '0.5');
            const safeTime = Number.isFinite(requestedTime)
                ? Math.min(requestedTime, Math.max(0, (video.duration || requestedTime) - 0.05))
                : 0.5;
            video.currentTime = Math.max(0, safeTime);

            // Safari/Chromium may reset the first early seek while media data is loading.
            if (seekAttempts < 4 && Math.abs(video.currentTime - safeTime) > 0.05) {
                seekAttempts += 1;
                window.setTimeout(seekToPreview, seekAttempts * 250);
            }
        };

        // Some browsers reset currentTime while the first frame is still loading,
        // so seek again as soon as decoded image data becomes available.
        video.addEventListener('loadedmetadata', seekToPreview, { once: true });
        video.addEventListener('loadeddata', seekToPreview, { once: true });
        if (video.readyState >= 2) {
            requestAnimationFrame(seekToPreview);
        } else if (video.readyState >= 1) {
            seekToPreview();
        }
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('nav-open');
            updateMenuToggleState(false);
        });
    });

    // Close menu when clicking outside the nav
    document.addEventListener('click', (e) => {
        if (body.classList.contains('nav-open') && 
            !e.target.closest('.site-nav') && 
            !e.target.closest('.menu-toggle')) {
            body.classList.remove('nav-open');
            updateMenuToggleState(false);
        }
    });

    // 2. STICKY NAV WITH BACKGROUND
    const siteNav = document.querySelector('.site-nav');
    if (siteNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                siteNav.classList.add('scrolled');
            } else {
                siteNav.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 3. SMOOTH SCROLL
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = 64;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. ACTIVE NAV LINK ON SCROLL
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        const sectionObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // 5. SCROLL REVEAL ANIMATIONS
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (prefersReducedMotion) {
        // If user prefers reduced motion, show everything immediately without animation
        revealElements.forEach(el => el.classList.add('visible'));
    } else {
        const revealObserverOptions = {
            root: null,
            rootMargin: '-50px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Observe once
                }
            });
        }, revealObserverOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // 5.1 METRICS COUNT-UP ANIMATION
    const metricValues = document.querySelectorAll('.metric-value[data-counter]');
    if (metricValues.length > 0) {
        const animateCount = (el) => {
            const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1800; // ms
            const startTime = performance.now();

            const updateNumber = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out expo / cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeOut * target);
                
                el.textContent = `${prefix}${currentVal}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    el.textContent = `${prefix}${target}${suffix}`;
                }
            };
            requestAnimationFrame(updateNumber);
        };

        if (prefersReducedMotion) {
            metricValues.forEach(el => {
                const target = el.getAttribute('data-counter');
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                el.textContent = `${prefix}${target}${suffix}`;
            });
        } else {
            const metricsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.25
            });

            metricValues.forEach(el => metricsObserver.observe(el));
        }
    }

    // 6. PORTFOLIO FILTER
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and add to the clicked one
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // 7. LIGHTBOX
    let lightboxOverlay = document.querySelector('.lightbox-overlay');
    if (!lightboxOverlay) {
        lightboxOverlay = document.createElement('div');
        lightboxOverlay.className = 'lightbox-overlay';
        lightboxOverlay.setAttribute('aria-hidden', 'true');
        lightboxOverlay.innerHTML = `
            <button class="lightbox-close" aria-label="Закрыть">&times;</button>
            <button class="lightbox-nav prev" aria-label="Предыдущее">&#10094;</button>
            <img class="lightbox-img" src="" alt="Просмотр">
            <button class="lightbox-nav next" aria-label="Следующее">&#10095;</button>
        `;
        document.body.appendChild(lightboxOverlay);
    }

    const lightboxImg = lightboxOverlay.querySelector('.lightbox-img');
    const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');
    const lightboxPrev = lightboxOverlay.querySelector('.lightbox-nav.prev');
    const lightboxNext = lightboxOverlay.querySelector('.lightbox-nav.next');
    
    let currentLightboxIndex = 0;
    let visibleGalleryItems = [];

    function updateLightboxImage() {
        if (visibleGalleryItems.length > 0 && visibleGalleryItems[currentLightboxIndex]) {
            const imgElement = visibleGalleryItems[currentLightboxIndex].tagName === 'IMG' 
                ? visibleGalleryItems[currentLightboxIndex] 
                : visibleGalleryItems[currentLightboxIndex].querySelector('img');
                
            if (imgElement && lightboxImg) {
                lightboxImg.src = imgElement.src;
            }
        }
    }

    function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightboxImage();
        if (lightboxOverlay) {
            lightboxOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    function closeLightbox() {
        if (lightboxOverlay) {
            lightboxOverlay.classList.remove('active');
        }
        document.body.style.overflow = ''; // Restore body scroll
    }

    function showNextImage() {
        if (visibleGalleryItems.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % visibleGalleryItems.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        if (visibleGalleryItems.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
        updateLightboxImage();
    }

    const caseImageSelector = '.gallery-img, .lightbox-trigger, .case-showcase-column img, .case-bento-card img, .case-blender-card img, .case-gallery img, .zoomable, .long-landing img, .pinterest-grid img';

    // Event delegation for opening the lightbox on gallery images
    document.addEventListener('click', (e) => {
        const clickedImg = e.target.closest(caseImageSelector);
        if (clickedImg && !clickedImg.closest('.case-page-btn') && !clickedImg.closest('.nav-logo')) {
            e.preventDefault();
            
            const allPossibleItems = document.querySelectorAll(caseImageSelector);
            visibleGalleryItems = Array.from(allPossibleItems).filter(el => {
                return !el.classList.contains('hidden') && el.style.display !== 'none' && !el.closest('.nav-logo');
            });
            
            const index = visibleGalleryItems.indexOf(clickedImg);
            if (index > -1) {
                openLightbox(index);
            }
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    // 7b. VIDEO MODAL (FOR CASE 2)
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeVideoModal = document.querySelector('.close-modal');

    if (videoModal && modalVideo) {
        document.querySelectorAll('.case-video-card, .case-banner-card, .video-wrapper').forEach(card => {
            card.addEventListener('click', () => {
                const vid = card.querySelector('video');
                if (vid && vid.src) {
                    modalVideo.src = vid.src;
                    videoModal.classList.add('active');
                    modalVideo.play().catch(() => {});
                }
            });
        });

        if (closeVideoModal) {
            closeVideoModal.addEventListener('click', () => {
                videoModal.classList.remove('active');
                modalVideo.pause();
                modalVideo.src = '';
            });
        }

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                modalVideo.pause();
                modalVideo.src = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                videoModal.classList.remove('active');
                modalVideo.pause();
                modalVideo.src = '';
            }
        });
    }

    // 8. BACK TO TOP BUTTON
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 9. MARQUEE PAUSE ON HOVER
    const marqueeSection = document.querySelector('.marquee-section');
    const marqueeTrack = document.querySelector('.marquee-track');

    if (marqueeSection && marqueeTrack) {
        marqueeSection.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        
        marqueeSection.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }

    // 10. CLIP PREVIEW FACADE PLAY (KINESCOPE)
    const clipFacade = document.getElementById('clipFacade');
    const clipIframe = document.getElementById('clipIframe');
    if (clipFacade && clipIframe) {
        clipFacade.addEventListener('click', () => {
            const dataSrc = clipIframe.getAttribute('data-src');
            if (dataSrc && !clipIframe.getAttribute('src')) {
                clipIframe.setAttribute('src', dataSrc);
            }
            clipFacade.classList.add('hidden');
        });
    }

    // 11. CONTACT FORM
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const successRedirect = contactForm.querySelector('input[name="_next"]');
        if (successRedirect) {
            successRedirect.value = new URL('success.html', window.location.href).href;
        }

        contactForm.addEventListener('submit', (e) => {
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Пожалуйста, заполните все обязательные поля.');
                return;
            }

            // Visual feedback upon successful submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'not-allowed';
            }
        });
    }

    // 13. SERVICE ITEM HOVER
    const serviceItems = document.querySelectorAll('.service-item');
    if (serviceItems.length > 0) {
        serviceItems.forEach(item => {
            const preview = item.querySelector('.service-preview');
            if (!preview) return;

            let isHovering = false;
            let targetX = 0;
            let targetY = 0;
            let currentX = 0;
            let currentY = 0;
            let animationFrameId;

            const updatePosition = () => {
                if (!isHovering) return;
                
                // Ease movement logic for smooth cursor tracking
                currentX += (targetX - currentX) * 0.15;
                currentY += (targetY - currentY) * 0.15;
                
                // Center the preview image on the cursor (assuming offset adjustments are needed)
                // The translation depends on CSS, often absolute positioned relative to the item
                preview.style.transform = `translate(${currentX}px, ${currentY}px)`;
                
                animationFrameId = requestAnimationFrame(updatePosition);
            };

            item.addEventListener('mouseenter', (e) => {
                isHovering = true;
                preview.classList.add('visible');
                
                const rect = item.getBoundingClientRect();
                targetX = e.clientX - rect.left;
                targetY = e.clientY - rect.top;
                currentX = targetX;
                currentY = targetY;
                
                animationFrameId = requestAnimationFrame(updatePosition);
            });

            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                targetX = e.clientX - rect.left;
                targetY = e.clientY - rect.top;
            });

            item.addEventListener('mouseleave', () => {
                isHovering = false;
                preview.classList.remove('visible');
                cancelAnimationFrame(animationFrameId);
            });
        });
    }

    // 14. MANIFESTO BACKGROUND VIDEO AUTOPLAY ASSURANCE
    const manifestoVideo = document.querySelector('.manifesto-bg-video');
    if (manifestoVideo) {
        manifestoVideo.muted = true;
        const playPromise = manifestoVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay was prevented, retry on first interaction
                const startPlay = () => {
                    manifestoVideo.play();
                    window.removeEventListener('scroll', startPlay);
                    window.removeEventListener('click', startPlay);
                    window.removeEventListener('touchstart', startPlay);
                };
                window.addEventListener('scroll', startPlay, { passive: true });
                window.addEventListener('click', startPlay, { once: true });
                window.addEventListener('touchstart', startPlay, { once: true });
            });
        }
    }

    // 15. POSITION STAR OVER VIDEO WATERMARK IN MANIFESTO
    const positionWatermarkStar = () => {
        const section = document.getElementById('clip') || document.getElementById('manifesto') || document.querySelector('.manifesto');
        const star = document.querySelector('.manifesto-watermark-cover');
        if (!section || !star) return;
        const w = section.offsetWidth;
        const h = section.offsetHeight;
        if (w === 0 || h === 0) return;
        const sectionRatio = w / h;
        const videoRatio = 16 / 9;
        let vw, vh, vx, vy;
        if (sectionRatio > videoRatio) {
            vw = w;
            vh = w / videoRatio;
            vx = 0;
            vy = (h - vh) / 2;
        } else {
            vh = h;
            vw = h * videoRatio;
            vx = (w - vw) / 2;
            vy = 0;
        }
        // Exact center of watermark star in 1280x720 video: X = 1149.5, Y = 612.5
        const markX = vx + vw * (1149.5 / 1280);
        const markY = vy + vh * (612.5 / 720);
        star.style.left = `${Math.round(markX)}px`;
        star.style.top = `${Math.round(markY)}px`;
        star.style.transform = 'translate(-50%, -50%)';
    };
    positionWatermarkStar();
    window.addEventListener('resize', positionWatermarkStar, { passive: true });
    window.addEventListener('orientationchange', positionWatermarkStar, { passive: true });
    window.addEventListener('load', positionWatermarkStar);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(positionWatermarkStar);
    }

    const manifestoSection = document.getElementById('clip') || document.getElementById('manifesto') || document.querySelector('.manifesto');
    if (manifestoSection && window.ResizeObserver) {
        const ro = new ResizeObserver(() => positionWatermarkStar());
        ro.observe(manifestoSection);
    }

    if (manifestoVideo) {
        manifestoVideo.addEventListener('loadedmetadata', positionWatermarkStar);
        manifestoVideo.addEventListener('play', positionWatermarkStar);
    }
});
