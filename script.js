// Dropdown menü için
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    
    dropdown.addEventListener('mouseover', function() {
        this.querySelector('.dropdown-icon').style.transform = 'rotate(180deg)';
    });

    dropdown.addEventListener('mouseout', function() {
        this.querySelector('.dropdown-icon').style.transform = 'rotate(0deg)';
    });

    // Ana slider için
    const mainSlider = document.querySelector('.main-slider');
    const mainSlides = document.querySelectorAll('.main-slide');
    const mainPrevBtn = document.querySelector('.main-prev');
    const mainNextBtn = document.querySelector('.main-next');
    const sliderDots = document.querySelector('.slider-dots');
    let mainCurrentSlide = 0;
    const mainSlideCount = mainSlides.length;

    // Slider noktalarını oluştur
    mainSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            mainCurrentSlide = index;
            updateMainSlider();
        });
        sliderDots.appendChild(dot);
    });

    function updateMainSlider() {
        const offset = -mainCurrentSlide * 100;
        mainSlider.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === mainCurrentSlide);
        });
    }

    function mainNextSlide() {
        mainCurrentSlide = (mainCurrentSlide + 1) % mainSlideCount;
        updateMainSlider();
    }

    function mainPrevSlide() {
        mainCurrentSlide = (mainCurrentSlide - 1 + mainSlideCount) % mainSlideCount;
        updateMainSlider();
    }

    // Touch events için swipe desteği
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;

    mainSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        startPos = touchStartX;
        clearInterval(mainSlideInterval);
    });

    mainSlider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchEndX = e.touches[0].clientX;
        const currentPosition = touchEndX - startPos;
        const translate = currentPosition - (mainCurrentSlide * mainSlider.offsetWidth);
        mainSlider.style.transform = `translateX(${translate}px)`;
    });

    mainSlider.addEventListener('touchend', () => {
        isDragging = false;
        const movedBy = touchStartX - touchEndX;
        if (Math.abs(movedBy) > 100) {
            if (movedBy > 0) {
                mainNextSlide();
            } else {
                mainPrevSlide();
            }
        } else {
            updateMainSlider();
        }
        mainSlideInterval = setInterval(mainNextSlide, 4000);
    });

    // Otomatik slider
    let mainSlideInterval = setInterval(mainNextSlide, 4000);

    // Slider kontrolleri
    mainNextBtn.addEventListener('click', () => {
        clearInterval(mainSlideInterval);
        mainNextSlide();
        mainSlideInterval = setInterval(mainNextSlide, 4000);
    });

    mainPrevBtn.addEventListener('click', () => {
        clearInterval(mainSlideInterval);
        mainPrevSlide();
        mainSlideInterval = setInterval(mainNextSlide, 4000);
    });

    // Mouse hover durumunda otomatik geçişi durdur
    mainSlider.addEventListener('mouseenter', () => {
        clearInterval(mainSlideInterval);
    });

    mainSlider.addEventListener('mouseleave', () => {
        mainSlideInterval = setInterval(mainNextSlide, 4000);
    });

    // Smooth scroll için
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Yukarı çıkma oku için
    const scrollToTop = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });

    scrollToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form işleme
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            console.log('Form verileri:', formData);
            messageForm.reset();
            alert('Mesajınız başarıyla gönderildi!');
        });
    }

    // Modal işlemleri
    const modal = document.getElementById('productModal');
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalClose = modal.querySelector('.modal-close');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');
    const productLinks = document.querySelectorAll('.product-link');
    let currentProductIndex = 0;
    const products = Array.from(productLinks).map(link => ({
        title: link.textContent,
        image: link.getAttribute('data-image'),
        description: link.getAttribute('data-description')
    })).filter(product => product.image); // Sadece görseli olan ürünleri filtrele

    function openModal(index) {
        currentProductIndex = index;
        modal.classList.add('active');
        updateModalContent();
        document.body.style.overflow = 'hidden';
    }

    function updateModalContent() {
        const product = products[currentProductIndex];
        modalTitle.innerHTML = `${product.title}<br><span class="modal-description">${product.description || ''}</span>`;
        modalImage.src = product.image;
    }

    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modalImage.src = '';
            modalTitle.textContent = '';
        }, 300);
        document.body.style.overflow = '';
    }

    function nextProduct() {
        currentProductIndex = (currentProductIndex + 1) % products.length;
        updateModalContent();
    }

    function prevProduct() {
        currentProductIndex = (currentProductIndex - 1 + products.length) % products.length;
        updateModalContent();
    }

    productLinks.forEach((link, index) => {
        if (link.getAttribute('data-image')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const productIndex = products.findIndex(p => p.title === this.textContent);
                if (productIndex !== -1) {
                    openModal(productIndex);
                }
            });
        }
    });

    modalClose.addEventListener('click', closeModal);
    modalNext.addEventListener('click', nextProduct);
    modalPrev.addEventListener('click', prevProduct);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowRight':
                nextProduct();
                break;
            case 'ArrowLeft':
                prevProduct();
                break;
        }
    });

    // Görsel yüklenme animasyonu
    modalImage.addEventListener('load', function() {
        this.style.opacity = '0';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 50);
    });
});

// Görsel grid animasyonu için
const gridItems = document.querySelectorAll('.grid-item');
gridItems.forEach(item => {
    item.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });

    item.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
}); 