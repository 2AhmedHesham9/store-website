/* ═══════════════════════════════════════════════════════════
   Orders Management
═══════════════════════════════════════════════════════════ */

"use strict";

const DEFAULT_ORDERS = [
  {
    id: "ORD-001",
    customer: "أحمد محمد",
    email: "ahmed@email.com",
    phone: "01097957329",
    address: "القاهرة، مدينة نصر",
    date: "2026-01-15",
    total: 2450,
    payment: "فيزا",
    paymentStatus: "مدفوع",
    status: "pending",
    items: 3,
    products: [
      {
        name: "تيشيرت قطن أوفر سايز",
        qty: 2,
        price: 240,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60",
      },
      {
        name: "هودي رياضي شتوي",
        qty: 1,
        price: 380,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=60",
      },
    ],
  },
  {
    id: "ORD-002",
    customer: "محمود علي",
    email: "mahmoud@email.com",
    phone: "01111111111",
    address: "الجيزة، الدقي",
    date: "2026-01-15",
    total: 850,
    payment: "كاش",
    paymentStatus: "عند التسليم",
    status: "shipped",
    items: 2,
    products: [],
  },
  {
    id: "ORD-003",
    customer: "يوسف إبراهيم",
    email: "youssef@email.com",
    phone: "01222222222",
    address: "الإسكندرية",
    date: "2026-01-14",
    total: 2100,
    payment: "فيزا",
    paymentStatus: "مدفوع",
    status: "completed",
    items: 4,
    products: [],
  },
  {
    id: "ORD-004",
    customer: "سارة أحمد",
    email: "sara@email.com",
    phone: "01333333333",
    address: "المنصورة",
    date: "2026-01-14",
    total: 450,
    payment: "محفظة",
    paymentStatus: "مسترجع",
    status: "cancelled",
    items: 1,
    products: [],
  },
  {
    id: "ORD-005",
    customer: "عمر خالد",
    email: "omar@email.com",
    phone: "01444444444",
    address: "طنطا",
    date: "2026-01-13",
    total: 780,
    payment: "فيزا",
    paymentStatus: "مدفوع",
    status: "pending",
    items: 2,
    products: [],
  },
  {
    id: "ORD-006",
    customer: "خالد محمود",
    email: "khaled@email.com",
    phone: "01555555555",
    address: "أسيوط",
    date: "2026-01-13",
    total: 1200,
    payment: "كاش",
    paymentStatus: "عند التسليم",
    status: "shipped",
    items: 3,
    products: [],
  },
  {
    id: "ORD-007",
    customer: "محمد سامي",
    email: "mohamed@email.com",
    phone: "01666666666",
    address: "القاهرة، المعادي",
    date: "2026-01-12",
    total: 620,
    payment: "فيزا",
    paymentStatus: "مدفوع",
    status: "completed",
    items: 2,
    products: [],
  },
  {
    id: "ORD-008",
    customer: "علي حسن",
    email: "ali@email.com",
    phone: "01777777777",
    address: "الجيزة، المهندسين",
    date: "2026-01-12",
    total: 1900,
    payment: "فيزا",
    paymentStatus: "مدفوع",
    status: "completed",
    items: 5,
    products: [],
  },
];

const STATUS_LABELS = {
  pending: { label: "قيد المعالجة", class: "pending" },
  shipped: { label: "تم الشحن", class: "shipped" },
  completed: { label: "مكتمل", class: "completed" },
  cancelled: { label: "ملغي", class: "cancelled" },
};

let orders = [];
let currentOrderId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
  renderOrders();
  initOrderFilters();
  initStatusUpdate();
});

/* ═══════════════════════════════════════
   1. Storage
═══════════════════════════════════════ */
function loadOrders() {
  try {
    orders = JSON.parse(localStorage.getItem("admin_orders")) || [
      ...DEFAULT_ORDERS,
    ];
  } catch {
    orders = [...DEFAULT_ORDERS];
  }
  if (!localStorage.getItem("admin_orders")) {
    localStorage.setItem("admin_orders", JSON.stringify(orders));
  }
}

function saveOrders() {
  localStorage.setItem("admin_orders", JSON.stringify(orders));
}

/* ═══════════════════════════════════════
   2. Render Orders
═══════════════════════════════════════ */
function renderOrders(filtered = null) {
  const list = filtered || orders;
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    <i class="fa-solid fa-inbox" style="font-size: 3rem; color: #9ca3af; display: block; margin-bottom: 15px;"></i>
                    <h6 style="color: #6c757d;">لا توجد طلبات</h6>
                </td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = list
    .map((o) => {
      const status = STATUS_LABELS[o.status] || STATUS_LABELS.pending;
      const initial = o.customer.charAt(0);
      return `
            <tr>
                <td><span class="order-id">#${o.id}</span></td>
                <td>
                    <div class="customer-cell">
                        <img src="https://i.pravatar.cc/40?u=${o.id}" alt="${o.customer}">
                        <div>
                            <span>${o.customer}</span>
                            <br>
                            <small style="color: #9ca3af; font-size: 0.75rem;">${o.email}</small>
                        </div>
                    </div>
                </td>
                <td>${o.date}</td>
                <td>${o.items} منتج</td>
                <td><strong>${o.total.toLocaleString("ar-EG")} ج</strong></td>
                <td>${o.payment}</td>
                <td><span class="status-badge ${status.class}">${status.label}</span></td>
                <td>
                    <button class="action-icon-btn view" onclick="viewOrder('${o.id}')" title="عرض التفاصيل">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  const totalEl = document.getElementById("totalOrders");
  if (totalEl) totalEl.textContent = orders.length;
}

/* ═══════════════════════════════════════
   3. View Order
═══════════════════════════════════════ */
function viewOrder(id) {
  const o = orders.find((x) => x.id === id);
  if (!o) return;

  currentOrderId = id;

  document.getElementById("orderModalId").textContent = "#" + o.id;
  document.getElementById("modalCustomerName").textContent = o.customer;
  document.getElementById("modalCustomerEmail").textContent = o.email;
  document.getElementById("modalCustomerPhone").textContent = o.phone;
  document.getElementById("modalCustomerAddress").textContent = o.address;
  document.getElementById("modalOrderDate").textContent = o.date;
  document.getElementById("modalPaymentMethod").textContent = o.payment;
  document.getElementById("modalPaymentStatus").textContent = o.paymentStatus;
  document.getElementById("orderStatusSelect").value = o.status;

  // Products
  const productsList = document.getElementById("orderProductsList");
  if (o.products && o.products.length) {
    productsList.innerHTML = o.products
      .map(
        (p) => `
            <div class="order-product-row">
                <img src="${p.image}" alt="${p.name}">
                <div>
                    <h6>${p.name}</h6>
                    <span>الكمية: ${p.qty}</span>
                </div>
                <div class="price">${(p.price * p.qty).toLocaleString("ar-EG")} ج</div>
            </div>
        `,
      )
      .join("");
  } else {
    productsList.innerHTML =
      '<p class="text-muted text-center">لا توجد تفاصيل منتجات</p>';
  }

  new bootstrap.Modal(document.getElementById("orderModal")).show();
}

/* ═══════════════════════════════════════
   4. Update Status
═══════════════════════════════════════ */
function initStatusUpdate() {
  const btn = document.getElementById("updateOrderStatus");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const newStatus = document.getElementById("orderStatusSelect").value;
    const index = orders.findIndex((o) => o.id === currentOrderId);

    if (index > -1) {
      orders[index].status = newStatus;
      saveOrders();
      renderOrders();

      bootstrap.Modal.getInstance(document.getElementById("orderModal")).hide();
      showToast(
        "✅ تم التحديث",
        `تم تغيير حالة الطلب إلى "${STATUS_LABELS[newStatus].label}"`,
        "success",
      );
    }
  });
}

/* ═══════════════════════════════════════
   5. Filters
═══════════════════════════════════════ */
function initOrderFilters() {
  const search = document.getElementById("orderSearch");
  const statusFilter = document.getElementById("filterStatus");
  const dateFilter = document.getElementById("filterDate");

  const applyFilters = () => {
    let filtered = [...orders];

    const q = (search?.value || "").trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q),
      );
    }

    const st = statusFilter?.value;
    if (st) filtered = filtered.filter((o) => o.status === st);

    const dt = dateFilter?.value;
    if (dt) filtered = filtered.filter((o) => o.date === dt);

    renderOrders(filtered);
  };

  search?.addEventListener("input", applyFilters);
  statusFilter?.addEventListener("change", applyFilters);
  dateFilter?.addEventListener("change", applyFilters);
}
