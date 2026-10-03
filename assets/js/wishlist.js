/* ═══════════════════════════════════════════════════════════
   Wishlist Page - JavaScript
═══════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
    initClearWishlist();
});


/* ═══════════════════════════════════════
   1. Render Wishlist
═══════════════════════════════════════ */
function renderWishlist() {
    const wishlist = getWishlist();
    const grid = document.getElementById('wishlistGrid');
    const emptyWishlist = document.getElementById('emptyWishlist');
    const wishlistContent = document.getElementById('wishlistContent');
    const count = document.getElementById('wishlistItemsCount');

    if (!grid) return;

    if (wishlist.length === 0) {
        if (emptyWishlist) emptyWishlist.style.display = 'block';
        if (wishlistContent) wishlistContent.style.display = 'none';
        return;
    }

    if (emptyWishlist) emptyWishlist.style.display = 'none';
    if (wishlistContent) wishlistContent.style.display = 'block';
    if (count) count.textContent = wishlist.length;

    grid.innerHTML = wishlist.map((item, index) => `
        <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="wishlist-item">
                <button class="wishlist-item-remove" data-index="${index}" aria-label="حذف">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="wishlist-item-img">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="wishlist-item-info">
                    <h5>${item.title}</h5>
                    <div class="wishlist-item-price">${formatPrice(item.price)}</div>
                    <button class="btn btn-add-cart w-100 add-to-cart-from-wishlist" data-index="${index}">
                        <i class="fa-solid fa-cart-plus"></i> أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-init AOS
    if (typeof AOS !== 'undefined') AOS.refresh();

    // Event listeners
    grid.querySelectorAll('.wishlist-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            removeFromWishlist(index);
        });
    });

    grid.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            const item = wishlist[index];

            addToCart({ ...item, id: 'id-' + Date.now(), quantity: 1 });

            // أنيميشن السلة
            const cartBtn = document.getElementById('cartBtn');
            if (cartBtn) {
                cartBtn.classList.add('cart-shake');
                setTimeout(() => cartBtn.classList.remove('cart-shake'), 600);
            }

            showToast('✅ تم الإضافة للسلة', item.title, 'success');
        });
    });
}


/* ═══════════════════════════════════════
   2. Get Wishlist
═══════════════════════════════════════ */
function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch {
        return [];
    }
}


/* ═══════════════════════════════════════
   3. Remove From Wishlist
═══════════════════════════════════════ */
function removeFromWishlist(index) {
    const wishlist = getWishlist();
    const item = wishlist[index];

    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    renderWishlist();
    updateWishlistCount();

    showToast('💔 تم الإزالة', `تم حذف "${item.title}" من المفضلة`, 'info');
}


/* ═══════════════════════════════════════
   4. Clear Wishlist
═══════════════════════════════════════ */
function initClearWishlist() {
    const btn = document.getElementById('clearWishlist');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من حذف كل المفضلة؟')) {
            localStorage.removeItem('wishlist');
            renderWishlist();
            updateWishlistCount();
            showToast('🗑️ تم المسح', '', 'info');
        }
    });
}