/* ═══════════════════════════════════════════════════════════
   Cart Page - JavaScript
═══════════════════════════════════════════════════════════ */

'use strict';

const SHIPPING_COST = 50;
const FREE_SHIPPING_THRESHOLD = 500;
let appliedCoupon = null;

const COUPONS = {
    'SAVE10': { type: 'percent', value: 10 },
    'SAVE20': { type: 'percent', value: 20 },
    'WELCOME': { type: 'fixed', value: 50 }
};


document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    initClearCart();
    initCoupon();
    initQtyEvents();
});


/* ═══════════════════════════════════════
   1. Render Cart
═══════════════════════════════════════ */
function renderCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const itemsCount = document.getElementById('cartItemsCount');

    if (!cartItems) return;

    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'flex';
    if (itemsCount) itemsCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-info">
                <span class="cart-item-cat">${item.category || 'منتج'}</span>
                <h5>${item.title}</h5>
                ${item.size ? `<small class="text-muted">المقاس: ${item.size}</small>` : ''}
                ${item.color ? `<small class="text-muted d-block">اللون: ${item.color}</small>` : ''}
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-minus" data-index="${index}">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <input type="number" value="${item.quantity}" min="1" max="10" data-index="${index}" class="qty-input">
                <button class="qty-plus" data-index="${index}">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
            <button class="cart-item-remove" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateCartTotals();
    updateCartCount();
}


/* ═══════════════════════════════════════
   2. Qty Events
═══════════════════════════════════════ */
function initQtyEvents() {
    document.addEventListener('click', (e) => {
        // Minus
        if (e.target.closest('.qty-minus')) {
            const index = parseInt(e.target.closest('.qty-minus').dataset.index);
            changeQty(index, -1);
        }
        // Plus
        if (e.target.closest('.qty-plus')) {
            const index = parseInt(e.target.closest('.qty-plus').dataset.index);
            changeQty(index, 1);
        }
        // Remove
        if (e.target.closest('.cart-item-remove')) {
            const index = parseInt(e.target.closest('.cart-item-remove').dataset.index);
            removeItem(index);
        }
    });

    // Qty input change
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('qty-input')) {
            const index = parseInt(e.target.dataset.index);
            let val = parseInt(e.target.value) || 1;
            if (val < 1) val = 1;
            if (val > 10) val = 10;
            setQty(index, val);
        }
    });
}


function changeQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;

    const newQty = cart[index].quantity + delta;
    if (newQty < 1) return;
    if (newQty > 10) {
        showToast('⚠️ الحد الأقصى', 'لا يمكن إضافة أكثر من 10 قطع', 'warning');
        return;
    }

    cart[index].quantity = newQty;
    saveCart(cart);
    renderCart();
}

function setQty(index, qty) {
    const cart = getCart();
    if (!cart[index]) return;

    cart[index].quantity = qty;
    saveCart(cart);
    renderCart();
}

function removeItem(index) {
    const cart = getCart();
    const item = cart[index];

    cart.splice(index, 1);
    saveCart(cart);
    renderCart();

    showToast('🗑️ تم الحذف', `تم حذف "${item.title}" من السلة`, 'info');
}


/* ═══════════════════════════════════════
   3. Update Totals
═══════════════════════════════════════ */
function updateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
    let discount = 0;

    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = subtotal * (appliedCoupon.value / 100);
        } else {
            discount = appliedCoupon.value;
        }
    }

    const total = subtotal + shipping - discount;

    // Update DOM
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const discountEl = document.getElementById('discount');
    const discountRow = document.getElementById('discountRow');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'مجاني' : formatPrice(shipping);
    if (discountEl) discountEl.textContent = '- ' + formatPrice(discount);
    if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';
    if (totalEl) totalEl.textContent = formatPrice(total);

    // Save totals for checkout
    localStorage.setItem('cartTotals', JSON.stringify({ subtotal, shipping, discount, total }));
}


/* ═══════════════════════════════════════
   4. Coupon
═══════════════════════════════════════ */
function initCoupon() {
    const btn = document.getElementById('applyCoupon');
    const input = document.getElementById('couponInput');

    if (!btn || !input) return;

    btn.addEventListener('click', () => {
        const code = input.value.trim().toUpperCase();

        if (!code) {
            showToast('⚠️ تنبيه', 'من فضلك أدخل كود الخصم', 'warning');
            return;
        }

        if (COUPONS[code]) {
            appliedCoupon = COUPONS[code];
            updateCartTotals();
            showToast('🎉 كوبون صحيح', `تم تطبيق خصم ${COUPONS[code].value}${COUPONS[code].type === 'percent' ? '%' : ' ج'}`, 'success');
            input.value = '';
        } else {
            showToast('❌ كوبون غير صحيح', 'الكود الذي أدخلته غير موجود', 'error');
            appliedCoupon = null;
            updateCartTotals();
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btn.click();
    });
}


/* ═══════════════════════════════════════
   5. Clear Cart
═══════════════════════════════════════ */
function initClearCart() {
    const btn = document.getElementById('clearCart');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من حذف كل المنتجات من السلة؟')) {
            localStorage.removeItem('cart');
            appliedCoupon = null;
            renderCart();
            updateCartCount();
            showToast('🗑️ تم مسح السلة', '', 'info');
        }
    });
}