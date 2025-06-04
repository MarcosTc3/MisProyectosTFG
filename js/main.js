document.addEventListener('DOMContentLoaded', function () {
    // --- MENÚ HAMBURGUESA ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const menuList = document.getElementById('menu-list');

    if (hamburgerButton && menuList) {
        hamburgerButton.addEventListener('click', function () {
            const isActive = menuList.classList.contains('is-active');
            this.classList.toggle('is-active');
            menuList.classList.toggle('is-active');
            if (isActive) {
                this.setAttribute('aria-expanded', 'false');
                this.setAttribute('aria-label', 'Abrir menú');
            } else {
                this.setAttribute('aria-expanded', 'true');
                this.setAttribute('aria-label', 'Cerrar menú');
            }
        });
        // Opcional: Cerrar menú al hacer clic en un enlace en móvil
        menuList.querySelectorAll('a.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768 && menuList.classList.contains('is-active')) { 
                    hamburgerButton.classList.remove('is-active');
                    menuList.classList.remove('is-active');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                    hamburgerButton.setAttribute('aria-label', 'Abrir menú');
                }
            });
        });
    }

    // --- LIGHTBOX GLOBAL CON OPCIÓN DE GALERÍA INTERNA ---
    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxModal) {
        const lightboxImage = document.getElementById('lightbox-imagen');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeLightboxButton = lightboxModal.querySelector('.lightbox-cerrar');
        const imagesToLightbox = document.querySelectorAll('.image-lightboxable');
        
        const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
        const lightboxNextBtn = document.getElementById('lightbox-next-btn');
        let currentGalleryImages = [];
        let currentGalleryIndex = 0;

        const naveActualGalleryData = {
            triggerId: 'nave-actual-gallery-trigger',
            images: [
                { src: 'img/nueva-nave/nave-nueva-vista-frontal-fuera.jpg', alt: 'Fachada de la nueva nave en Parla' },
                { src: 'img/nueva-nave/planta-baja-nave-nueva.jpg', alt: 'Planta baja de la nueva nave' },
                { src: 'img/nueva-nave/planta-baja-nave-nueva2.jpg', alt: 'Otra vista de la planta baja de la nueva nave' },
                { src: 'img/nueva-nave/escaleras-nave-nueva.jpg', alt: 'Escaleras interiores de la nueva nave' },
                { src: 'img/nueva-nave/planta-arriba-nave-nueva.jpg', alt: 'Planta alta de la nueva nave' },
                { src: 'img/nueva-nave/planta-arriba-nave-nueva2.jpg', alt: 'Otra vista de la planta alta de la nueva nave' }
            ]
        };
        const allSpecificGalleries = [naveActualGalleryData];

        function updateLightboxGalleryImage() {
            if (currentGalleryImages.length > 0 && currentGalleryIndex >= 0 && currentGalleryIndex < currentGalleryImages.length) {
                lightboxImage.src = currentGalleryImages[currentGalleryIndex].src;
                lightboxCaption.innerHTML = currentGalleryImages[currentGalleryIndex].alt || `Imagen ${currentGalleryIndex + 1} de ${currentGalleryImages.length}`;
            }
        }

        function openSingleImageLightbox(imageElement) {
            currentGalleryImages = [];
            lightboxImage.src = imageElement.src;
            lightboxCaption.innerHTML = imageElement.alt;
            lightboxModal.classList.remove('has-gallery');
            lightboxModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function openGalleryLightbox(galleryData, clickedImageSrc) {
            currentGalleryImages = galleryData.images;
            const initialIndex = currentGalleryImages.findIndex(imgData => clickedImageSrc.includes(imgData.src.replace(/\\/g, '/'))); // Normalizar separadores
            currentGalleryIndex = (initialIndex !== -1) ? initialIndex : 0; 
            
            updateLightboxGalleryImage();
            lightboxModal.classList.add('has-gallery');
            lightboxModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        if (imagesToLightbox.length > 0 && lightboxImage && closeLightboxButton) {
            imagesToLightbox.forEach(image => {
                if (!image.classList.contains('lightbox-event-attached')) {
                    image.style.cursor = 'pointer'; 
                    image.addEventListener('click', function() {
                        let isSpecificGallery = false;
                        const clickedImageSrcNormalized = this.src.replace(/\\/g, '/'); // Normalizar separadores
                        for (const gallery of allSpecificGalleries) {
                            if (this.id === gallery.triggerId || gallery.images.some(imgData => clickedImageSrcNormalized.includes(imgData.src))) {
                                if (this.id === gallery.triggerId) { // Si es el trigger principal de la galería
                                     openGalleryLightbox(gallery, clickedImageSrcNormalized);
                                     isSpecificGallery = true;
                                     break;
                                } else { // Si es otra imagen que pertenece a una galería definida (ej. galería de trabajos)
                                     // Esta lógica necesitaría que .image-lightboxable tenga data-attributes para identificar su galería
                                     // Por ahora, solo la 'nave-actual-gallery-trigger' inicia una galería interna.
                                     // Las otras .image-lightboxable abrirán como imagen única.
                                }
                            }
                        }
                        if (!isSpecificGallery) {
                            openSingleImageLightbox(this);
                        }
                    });
                    image.classList.add('lightbox-event-attached');
                }
            });

            if (closeLightboxButton && !closeLightboxButton.classList.contains('lightbox-event-attached-close')) {
                closeLightboxButton.addEventListener('click', function() {
                    lightboxModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    lightboxModal.classList.remove('has-gallery');
                    currentGalleryImages = []; 
                });
                closeLightboxButton.classList.add('lightbox-event-attached-close');
            }

            if (!lightboxModal.classList.contains('lightbox-event-attached-bg')) {
                lightboxModal.addEventListener('click', function(event) {
                    if (event.target === lightboxModal) { 
                        lightboxModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        lightboxModal.classList.remove('has-gallery');
                        currentGalleryImages = [];
                    }
                });
                lightboxModal.classList.add('lightbox-event-attached-bg');
            }

            if (lightboxPrevBtn && !lightboxPrevBtn.classList.contains('lightbox-nav-attached')) {
                lightboxPrevBtn.addEventListener('click', function() {
                    if (currentGalleryImages.length > 0) {
                        currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
                        updateLightboxGalleryImage();
                    }
                });
                lightboxPrevBtn.classList.add('lightbox-nav-attached');
            }
            if (lightboxNextBtn && !lightboxNextBtn.classList.contains('lightbox-nav-attached')) {
                lightboxNextBtn.addEventListener('click', function() {
                     if (currentGalleryImages.length > 0) {
                        currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
                        updateLightboxGalleryImage();
                    }
                });
                lightboxNextBtn.classList.add('lightbox-nav-attached');
            }
        }
    }

    // --- SCRIPT PARA EL AÑO DEL COPYRIGHT ---
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- LÓGICA DEL CARRUSEL HERO (de index.html) ---
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const heroSlides = heroSlider.querySelectorAll('.slide');
        const heroNextButton = heroSlider.querySelector('.next');
        const heroPrevButton = heroSlider.querySelector('.prev');
        const heroDotsContainer = heroSlider.querySelector('.slider-dots');
        let heroCurrentSlide = 0;
        let heroSlideInterval;

        function createHeroDots() {
            if (!heroDotsContainer || heroSlides.length === 0) return;
            heroDotsContainer.innerHTML = ''; 
            heroSlides.forEach((slide, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Ir a diapositiva ${index + 1}`);
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToHeroSlide(index);
                    resetHeroInterval();
                });
                heroDotsContainer.appendChild(dot);
            });
        }
        
        function updateHeroDots() {
            if (!heroDotsContainer || !heroSlides[heroCurrentSlide]) return; // Verificación adicional
            const dots = heroDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === heroCurrentSlide);
            });
        }

        function goToHeroSlide(slideIndex) {
            if (heroSlides.length === 0 || !heroSlides[heroCurrentSlide]) return;
            heroSlides[heroCurrentSlide].classList.remove('active');
            heroCurrentSlide = (slideIndex + heroSlides.length) % heroSlides.length;
            if (!heroSlides[heroCurrentSlide]) return; // Verificación adicional
            heroSlides[heroCurrentSlide].classList.add('active');
            updateHeroDots();
        }

        function nextHeroSlide() { goToHeroSlide(heroCurrentSlide + 1); }
        function prevHeroSlide() { goToHeroSlide(heroCurrentSlide - 1); }

        function startHeroSlideShow() {
            if (heroSlides.length <= 1) return;
            heroSlideInterval = setInterval(nextHeroSlide, 5000);
        }

        function resetHeroInterval() {
            if (heroSlides.length <= 1) return;
            clearInterval(heroSlideInterval);
            startHeroSlideShow();
        }

        if (heroSlides.length > 0) {
            if(heroSlides[0]) heroSlides[0].classList.add('active');
            createHeroDots(); 
            updateHeroDots(); 

            if (heroNextButton && heroPrevButton) {
                heroNextButton.addEventListener('click', () => { nextHeroSlide(); resetHeroInterval(); });
                heroPrevButton.addEventListener('click', () => { prevHeroSlide(); resetHeroInterval(); });
            }
            startHeroSlideShow();
        }
    }
    
    // --- LÓGICA DEL CARRUSEL DE TESTIMONIOS (de index.html) ---
    const testimonialSliderEl = document.querySelector('.testimonial-slider-container');
    if (testimonialSliderEl) {
        const slidesContainer = testimonialSliderEl.querySelector('.testimonial-slides');
        const cards = slidesContainer.querySelectorAll('.testimonio-card');
        const prevBtn = testimonialSliderEl.querySelector('.testimonial-prev');
        const nextBtn = testimonialSliderEl.querySelector('.testimonial-next');
        let currentIndex = 0;
        let testimonialAutoPlayInterval;
        const numCards = cards.length;

        function setupTestimonialSlider() {
            if (numCards === 0) return;
            slidesContainer.style.width = `${numCards * 100}%`;
            cards.forEach(card => {
                card.style.width = `${100 / numCards}%`;
                card.style.flexShrink = '0';
                card.style.boxSizing = 'border-box';
            });
        }

        function showCurrentTestimonial() {
            if (numCards === 0) return;
            const offsetPercentage = currentIndex * (100 / numCards);
            slidesContainer.style.transform = `translateX(-${offsetPercentage}%)`;
        }
        
        function nextTestimonialSlide() {
            currentIndex = (currentIndex + 1) % numCards;
            showCurrentTestimonial();
        }
        
        function prevTestimonialSlide() {
            currentIndex = (currentIndex - 1 + numCards) % numCards;
            showCurrentTestimonial();
        }

        function startTestimonialAutoPlay() {
            if (numCards <= 1) {
                if(prevBtn) prevBtn.style.display = 'none';
                if(nextBtn) nextBtn.style.display = 'none';
                return;
            }
            testimonialAutoPlayInterval = setInterval(nextTestimonialSlide, 10000);
        }

        function resetTestimonialAutoPlay() {
            if (numCards <= 1) return;
            clearInterval(testimonialAutoPlayInterval);
            startTestimonialAutoPlay();
        }

        if (numCards > 0) {
            setupTestimonialSlider(); 
            showCurrentTestimonial(); 
            
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => {
                    prevTestimonialSlide();
                    resetTestimonialAutoPlay();
                });
                nextBtn.addEventListener('click', () => {
                    nextTestimonialSlide();
                    resetTestimonialAutoPlay();
                });
            }
            startTestimonialAutoPlay();
        } else {
            if(prevBtn) prevBtn.style.display = 'none';
            if(nextBtn) nextBtn.style.display = 'none';
        }
    }

});