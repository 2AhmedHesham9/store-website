/* ═══════════════════════════════════════════════════════════
   Checkout Page - JavaScript
═══════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutItems();
    initPaymentToggle();
    initCheckoutForm();
    initCardFormat();
});


/* ═══════════════════════════════════════
   1. Render Items
═══════════════════════════════════════ */
function renderCheckoutItems() {
    const cart = getCart();
    const container = document.getElementById('checkoutItems');

    if (!container) return;

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-img">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="checkout-item-info">
                <h6>${item.title}</h6>
                <span>الكمية: ${item.quantity}</span>
            </div>
            <div class="checkout-item-price">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `).join('');

    updateCheckoutTotals();
}


/* ═══════════════════════════════════════
   2. Update Totals
═══════════════════════════════════════ */
function updateCheckoutTotals() {
    const totals = JSON.parse(localStorage.getItem('cartTotals')) || {};
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const shipping = subtotal >= 500 ? 0 : 50;
    const discount = totals.discount || 0;
    const total = subtotal + shipping - discount;

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
}


/* ═══════════════════════════════════════
   3. Payment Toggle
═══════════════════════════════════════ */
function initPaymentToggle() {
    const radios = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('cardDetails');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'card' && radio.checked) {
                if (cardDetails) cardDetails.style.display = 'block';
            } else if (radio.checked) {
                if (cardDetails) cardDetails.style.display = 'none';
            }
        });
    });
}


/* ═══════════════════════════════════════
   4. Card Formatting
═══════════════════════════════════════ */
function initCardFormat() {
    const cardInput = document.querySelector('input[placeholder="0000 0000 0000 0000"]');
    const expiryInput = document.querySelector('input[placeholder="MM/YY"]');
    const cvvInput = document.querySelector('input[placeholder="123"]');

    // Card Number
    cardInput?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        value = value.match(/.{1,4}/g)?.join(' ') || '';
        e.target.value = value.slice(0, 19);
    });

    // Expiry
    expiryInput?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // CVV
    cvvInput?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
}


/* ═══════════════════════════════════════
   5. Checkout Form Submit
═══════════════════════════════════════ */
function initCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Button loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري المعالجة...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Generate order number
            const orderNum = 'ORD-' + Date.now().toString().slice(-6);
            const orderNumberEl = document.getElementById('orderNumber');
            if (orderNumberEl) orderNumberEl.textContent = '#' + orderNum;

            // Save order
            const cart = getCart();
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push({
                id: orderNum,
                items: cart,
                date: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear cart
            localStorage.removeItem('cart');
            localStorage.removeItem('cartTotals');
            updateCartCount();

            // Show success modal
            const modal = new bootstrap.Modal(document.getElementById('successModal'));
            modal.show();

            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;

            // Redirect after close
            document.getElementById('successModal').addEventListener('hidden.bs.modal', () => {
                window.location.href = 'index.html';
            });
        }, 2000);
    });
}