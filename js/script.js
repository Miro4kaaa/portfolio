document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Set active link based on current URL
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll(".nav-links a");
    
    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    // Video Modal Logic with Gallery
    const videoItems = Array.from(document.querySelectorAll(".video-wrapper video, .banner-wrapper video, .video-grid-5 video, .banner-video"));
    const modal = document.getElementById("videoModal");
    const modalVideo = document.getElementById("modalVideo");
    const closeModal = document.querySelector(".close-modal");

    if (modal && modalVideo && videoItems.length > 0) {
        let currentVidIndex = 0;
        
        // Add arrows
        const prevBtn = document.createElement("div");
        prevBtn.className = "lightbox-prev";
        prevBtn.innerHTML = "&#10094;";
        const nextBtn = document.createElement("div");
        nextBtn.className = "lightbox-next";
        nextBtn.innerHTML = "&#10095;";
        
        modal.appendChild(prevBtn);
        modal.appendChild(nextBtn);

        function showVideo(index) {
            if (index < 0) index = videoItems.length - 1;
            if (index >= videoItems.length) index = 0;
            currentVidIndex = index;
            modalVideo.src = videoItems[currentVidIndex].src;
            modalVideo.play();
        }

        videoItems.forEach((video, index) => {
            // Need to handle wrappers if any, but the click was registered on video. 
            // In case2.html we wrapped videos. The video is pointer-events auto.
            video.addEventListener("click", (e) => {
                e.stopPropagation();
                modal.classList.add("active");
                showVideo(index);
            });
        });
        
        // Also add click listener to the wrapper to open the corresponding video
        const wrappers = document.querySelectorAll(".video-wrapper, .banner-wrapper");
        wrappers.forEach((wrapper, index) => {
             wrapper.addEventListener("click", (e) => {
                 e.stopPropagation();
                 modal.classList.add("active");
                 showVideo(index);
             });
        });

        closeModal.addEventListener("click", () => {
            modal.classList.remove("active");
            modalVideo.pause();
            modalVideo.src = "";
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
                modalVideo.pause();
                modalVideo.src = "";
            }
        });
        
        prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showVideo(currentVidIndex - 1); });
        nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showVideo(currentVidIndex + 1); });
        
        document.addEventListener("keydown", (e) => {
            if (!modal.classList.contains("active")) return;
            if (e.key === "ArrowLeft") showVideo(currentVidIndex - 1);
            if (e.key === "ArrowRight") showVideo(currentVidIndex + 1);
            if (e.key === "Escape") {
                modal.classList.remove("active");
                modalVideo.pause();
                modalVideo.src = "";
            }
        });
    }

    // Scroll Animations
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".project-card, .skill-card, .gallery-item, .timeline-item");
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        observer.observe(el);
    });

    // Image Lightbox Logic
    const images = Array.from(document.querySelectorAll(".long-landing img, .pinterest-grid img"));
    if (images.length > 0) {
        const lb = document.createElement("div");
        lb.className = "lightbox-overlay";
        lb.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <div class="lightbox-prev">&#10094;</div>
            <img class="lightbox-img" src="" alt="">
            <div class="lightbox-next">&#10095;</div>
        `;
        document.body.appendChild(lb);

        const lbImg = lb.querySelector(".lightbox-img");
        const lbClose = lb.querySelector(".lightbox-close");
        const lbPrev = lb.querySelector(".lightbox-prev");
        const lbNext = lb.querySelector(".lightbox-next");
        let currentImgIndex = 0;

        function showImg(index) {
            if (index < 0) index = images.length - 1;
            if (index >= images.length) index = 0;
            currentImgIndex = index;
            lbImg.src = images[currentImgIndex].src;
        }

        images.forEach((img, index) => {
            // Remove old zoomed logic, we will use this instead
            img.style.cursor = "zoom-in";
            img.addEventListener("click", (e) => {
                e.stopPropagation();
                lb.classList.add("active");
                showImg(index);
            });
        });

        lbClose.addEventListener("click", () => lb.classList.remove("active"));
        lb.addEventListener("click", (e) => {
            if (e.target === lb || e.target === lbImg) lb.classList.remove("active"); // click anywhere to close
        });
        lbPrev.addEventListener("click", (e) => { e.stopPropagation(); showImg(currentImgIndex - 1); });
        lbNext.addEventListener("click", (e) => { e.stopPropagation(); showImg(currentImgIndex + 1); });
        
        document.addEventListener("keydown", (e) => {
            if (!lb.classList.contains("active")) return;
            if (e.key === "ArrowLeft") showImg(currentImgIndex - 1);
            if (e.key === "ArrowRight") showImg(currentImgIndex + 1);
            if (e.key === "Escape") lb.classList.remove("active");
        });
    }
});

// Force video grid thumbnails to show a specific frame
(function() {
    function seekVideos() {
        const gridVideos = document.querySelectorAll("video[data-preview-time]");
        gridVideos.forEach(video => {
            const t = parseFloat(video.dataset.previewTime ?? 0.5);
            const doSeek = () => {
                if (video.readyState >= 1) {
                    video.currentTime = t;
                } else {
                    video.addEventListener("loadedmetadata", () => {
                        video.currentTime = t;
                    }, { once: true });
                }
            };
            doSeek();
        });
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", seekVideos);
    } else {
        seekVideos();
    }
})();
