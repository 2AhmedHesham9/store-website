/* ═══════════════════════════════════════════════════════════
   شباب ستايل - الملف الرئيسي للجافاسكريبت
   Shabab Style - Main JavaScript File
═══════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════
   1. تهيئة عند تحميل الصفحة
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initAOS();
    initNavbar();
    initDarkMode();
    initSearch();
    initScrollTop();
    initCountdown();
    initFilterTabs();
    initAddToCart();
    initWishlist();
    initNewsletter();
    updateCartCount();
    updateWishlistCount();
    console.log('%c🚀 شباب ستايل جاهز!', 'color: #e94560; font-size: 16px; font-weight: bold;');
});


/* ═══════════════════════════════════════
   2. Loading Spinner
═══════════════════════════════════════ */
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 600);
    });

    // Fallback: إخفاء اللودر بعد 3 ثواني كحد أقصى
    setTimeout(() => {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }
    }, 3000);
}


/* ═══════════════════════════════════════
   3. AOS Animations
═══════════════════════════════════════ */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 80,
            delay: 0,
            disable: window.innerWidth < 480 ? false : false
        });
    }
}


/* ═══════════════════════════════════════
   4. Navbar Scroll Effect
═══════════════════════════════════════ */
function initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on load

    // إغلاق القائمة عند الضغط على رابط
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    const navbarCollapse = document.getElementById('navbarContent');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });
}


/* ═══════════════════════════════════════
   5. Dark Mode Toggle
═══════════════════════════════════════ */
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'light';

    // تطبيق الوضع المحفوظ
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // التبديل عند الضغط
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        if (icon) {
            icon.classList.toggle('fa-moon', !isDark);
            icon.classList.toggle('fa-sun', isDark);
        }

        showToast(isDark ? '🌙 الوضع الليلي' : '☀️ الوضع النهاري', 'تم تغيير المظهر بنجاح', 'success');
    });
}


/* ═══════════════════════════════════════
   6. Search Overlay
═══════════════════════════════════════ */
function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchClose = document.getElementById('searchClose');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');

    if (!searchToggle || !searchOverlay) return;

    // فتح البحث
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput?.focus(), 300);
    });

    // إغلاق البحث
    const closeSearch = () => {
        searchOverlay.classList.remove('active');
        if (searchInput) searchInput.value = '';
    };

    searchClose?.addEventListener('click', closeSearch);

    // إغلاق بالضغط على الخلفية
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
    });

    // إغلاق بمفتاح ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    // البحث عند الضغط على Enter
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
            }
        }
    });
}


/* ═══════════════════════════════════════
   7. Scroll To Top
═══════════════════════════════════════ */
function initScrollTop() {
    const scrollBtn = document.getElementById('scrollTop');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollBtn.classList.add('active');
        } else {
            scrollBtn.classList.remove('active');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* ═══════════════════════════════════════
   8. Countdown Timer
═══════════════════════════════════════ */
function initCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;

    // نهاية العرض بعد 7 أيام من الآن
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 0);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;

        if (distance < 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}


/* ═══════════════════════════════════════
   9. Filter Tabs (المنتجات)
═══════════════════════════════════════ */
function initFilterTabs() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-item');

    if (!filterBtns.length || !products.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // إزالة active من الكل
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            products.forEach(product => {
                const category = product.dataset.category;

                if (filter === 'all' || category === filter) {
                    product.style.display = '';
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        product.style.display = 'none';
                    }, 300);
                }
            });

            // إعادة تشغيل AOS
            if (typeof AOS !== 'undefined') AOS.refresh();
        });
    });
}


/* ═══════════════════════════════════════
   10. Add To Cart
═══════════════════════════════════════ */
function initAddToCart() {
    const addBtns = document.querySelectorAll('.btn-add-cart');

    addBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const card = this.closest('.product-card');
            if (!card) return;

            // استخراج بيانات المنتج
            const product = {
                id: generateId(),
                title: card.querySelector('.product-title')?.textContent.trim() || 'منتج',
                price: parsePrice(card.querySelector('.new-price')?.textContent || '0'),
                image: card.querySelector('.product-img-wrapper img')?.src || '',
                category: card.querySelector('.product-cat')?.textContent.trim() || '',
                quantity: 1
            };

            addToCart(product);

            // أنيميشن السلة
            const cartBtn = document.getElementById('cartBtn');
            if (cartBtn) {
                cartBtn.classList.add('cart-shake');
                setTimeout(() => cartBtn.classList.remove('cart-shake'), 600);
            }

            // أنيميشن الزر
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check"></i> تم الإضافة';
            this.style.background = '#4ecdc4';
            this.disabled = true;

            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.background = '';
                this.disabled = false;
            }, 1500);

            showToast('✅ تم الإضافة للسلة', product.title, 'success');
        });
    });
}


/* ═══════════════════════════════════════
   11. Wishlist
═══════════════════════════════════════ */
function initWishlist() {
    const wishBtns = document.querySelectorAll('.action-btn[aria-label="المفضلة"]');

    wishBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const icon = this.querySelector('i');

            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                this.style.color = '#e94560';
                showToast('❤️ تم الإضافة للمفضلة', '', 'success');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                this.style.color = '';
                showToast('💔 تم الإزالة من المفضلة', '', 'info');
            }

            // تحديث العداد (تجريبي)
            const count = document.getElementById('wishlistCount');
            if (count) {
                const current = parseInt(count.textContent) || 0;
                count.textContent = icon.classList.contains('fa-solid') ? current + 1 : Math.max(0, current - 1);
            }
        });
    });
}


/* ═══════════════════════════════════════
   12. Newsletter Form
═══════════════════════════════════════ */
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value.trim();

        if (!isValidEmail(email)) {
            showToast('⚠️ خطأ', 'من فضلك أدخل بريد إلكتروني صحيح', 'error');
            return;
        }

        // محاكاة الإرسال
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML(originalText);
            btn.disabled = false;
            form.reset();
            showToast('🎉 تم الاشتراك', 'خصم 10% في انتظارك في إيميلك', 'success');
        }, 1500);
    });
}


/* ═══════════════════════════════════════
   13. Cart Functions
═══════════════════════════════════════ */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.title === product.title);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }

    saveCart(cart);
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    const countEl = document.getElementById('cartCount');
    if (countEl) {
        countEl.textContent = total;
        countEl.style.display = total > 0 ? 'flex' : 'flex';
    }

    // إرسال حدث لتحديث باقي الصفحات
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { total } }));
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const countEl = document.getElementById('wishlistCount');
    if (countEl) countEl.textContent = wishlist.length;
}


/* ═══════════════════════════════════════
   14. Toast Notifications
═══════════════════════════════════════ */
function showToast(title, message = '', type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const colors = {
        success: '#4ecdc4',
        error: '#e94560',
        info: '#4a90e2',
        warning: '#f9c74f'
    };

    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-header" style="border-right: 4px solid ${colors[type]};">
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" onclick="this.closest('.toast').remove()"></button>
        </div>
        ${message ? `<div class="toast-body">${message}</div>` : ''}
    `;

    container.appendChild(toast);

    // إزالة تلقائية
    setTimeout(() => {
        const el = document.getElementById(toastId);
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-100%)';
            el.style.transition = 'all 0.3s ease';
            setTimeout(() => el.remove(), 300);
        }
    }, 3500);
}


/* ═══════════════════════════════════════
   15. Helper Functions
═══════════════════════════════════════ */
function generateId() {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function parsePrice(priceStr) {
    return parseFloat(String(priceStr).replace(/[^\d.]/g, '')) || 0;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function originalHTML(html) {
    return html;
}

function formatPrice(num) {
    return new Intl.NumberFormat('ar-EG').format(num) + ' ج';
}


/* ═══════════════════════════════════════
   16. Smooth Scroll للأقسام الداخلية
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


/* ═══════════════════════════════════════
   17. Lazy Loading Images (احتياطي)
═══════════════════════════════════════ */
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
}