/* ═══════════════════════════════════════════════════════════
   Customers Management
═══════════════════════════════════════════════════════════ */

"use strict";

const DEFAULT_CUSTOMERS = [
  {
    id: "c1",
    name: "أحمد محمد",
    email: "ahmed@email.com",
    phone: "01097957329",
    orders: 15,
    total: 12450,
    joined: "2024-01-15",
    type: "vip",
  },
  {
    id: "c2",
    name: "محمود علي",
    email: "mahmoud@email.com",
    phone: "01111111111",
    orders: 8,
    total: 5200,
    joined: "2024-03-22",
    type: "regular",
  },
  {
    id: "c3",
    name: "يوسف إبراهيم",
    email: "youssef@email.com",
    phone: "01222222222",
    orders: 22,
    total: 18900,
    joined: "2023-11-10",
    type: "vip",
  },
  {
    id: "c4",
    name: "سارة أحمد",
    email: "sara@email.com",
    phone: "01333333333",
    orders: 1,
    total: 450,
    joined: "2026-01-10",
    type: "new",
  },
  {
    id: "c5",
    name: "عمر خالد",
    email: "omar@email.com",
    phone: "01444444444",
    orders: 6,
    total: 3800,
    joined: "2024-06-05",
    type: "regular",
  },
  {
    id: "c6",
    name: "خالد محمود",
    email: "khaled@email.com",
    phone: "01555555555",
    orders: 3,
    total: 2100,
    joined: "2024-09-18",
    type: "regular",
  },
  {
    id: "c7",
    name: "محمد سامي",
    email: "mohamed@email.com",
    phone: "01666666666",
    orders: 12,
    total: 9500,
    joined: "2023-12-01",
    type: "vip",
  },
  {
    id: "c8",
    name: "علي حسن",
    email: "ali@email.com",
    phone: "01777777777",
    orders: 1,
    total: 620,
    joined: "2026-01-14",
    type: "new",
  },
];

const CUSTOMER_TYPE_LABELS = {
  vip: { label: "VIP", class: "vip" },
  regular: { label: "عادي", class: "regular" },
  new: { label: "جديد", class: "new" },
};

let customers = [];

document.addEventListener("DOMContentLoaded", () => {
  loadCustomers();
  renderCustomers();
  initCustomerFilters();
});

/* ═══════════════════════════════════════
   1. Storage
═══════════════════════════════════════ */
function loadCustomers() {
  try {
    customers = JSON.parse(localStorage.getItem("admin_customers")) || [
      ...DEFAULT_CUSTOMERS,
    ];
  } catch {
    customers = [...DEFAULT_CUSTOMERS];
  }
  if (!localStorage.getItem("admin_customers")) {
    localStorage.setItem("admin_customers", JSON.stringify(customers));
  }
}

/* ═══════════════════════════════════════
   2. Render
═══════════════════════════════════════ */
function renderCustomers(filtered = null) {
  const list = filtered || customers;
  const tbody = document.getElementById("customersTableBody");
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    <i class="fa-solid fa-user-slash" style="font-size: 3rem; color: #9ca3af; display: block; margin-bottom: 15px;"></i>
                    <h6 style="color: #6c757d;">لا يوجد عملاء مطابقون</h6>
                </td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = list
    .map((c) => {
      const type = CUSTOMER_TYPE_LABELS[c.type] || CUSTOMER_TYPE_LABELS.regular;
      return `
            <tr>
                <td>
                    <div class="customer-cell">
                        <img src="https://i.pravatar.cc/40?u=${c.id}" alt="${c.name}">
                        <span>${c.name}</span>
                    </div>
                </td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td><strong>${c.orders}</strong></td>
                <td><strong>${c.total.toLocaleString("ar-EG")} ج</strong></td>
                <td>${c.joined}</td>
                <td><span class="customer-badge ${type.class}">${type.label}</span></td>
                <td>
                    <button class="action-icon-btn view" onclick="viewCustomer('${c.id}')" title="عرض">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");
}

/* ═══════════════════════════════════════
   3. View Customer
═══════════════════════════════════════ */
function viewCustomer(id) {
  const c = customers.find((x) => x.id === id);
  if (!c) return;

  const type = CUSTOMER_TYPE_LABELS[c.type];

  document.getElementById("customerModalImg").src =
    `https://i.pravatar.cc/100?u=${c.id}`;
  document.getElementById("customerModalName").textContent = c.name;
  document.getElementById("customerModalEmail").textContent = c.email;
  document.getElementById("customerModalPhone").textContent = c.phone;
  document.getElementById("customerModalDate").textContent = c.joined;
  document.getElementById("customerModalOrders").textContent =
    c.orders + " طلب";
  document.getElementById("customerModalTotal").textContent =
    c.total.toLocaleString("ar-EG") + " ج";

  const badge = document.querySelector(
    ".customer-profile-header .customer-badge",
  );
  if (badge) {
    badge.textContent = type.label;
    badge.className = "customer-badge " + type.class;
  }

  // Sample recent orders
  const ordersList = document.getElementById("customerOrdersList");
  ordersList.innerHTML = `
        <div class="customer-order-row">
            <span class="order-id">#ORD-00${Math.floor(Math.random() * 9) + 1}</span>
            <span>${c.joined}</span>
            <strong>${(c.total / 3).toFixed(0)} ج</strong>
        </div>
        <div class="customer-order-row">
            <span class="order-id">#ORD-00${Math.floor(Math.random() * 9) + 1}</span>
            <span>${c.joined}</span>
            <strong>${(c.total / 4).toFixed(0)} ج</strong>
        </div>
    `;

  new bootstrap.Modal(document.getElementById("customerModal")).show();
}

/* ═══════════════════════════════════════
   4. Filters
═══════════════════════════════════════ */
function initCustomerFilters() {
  const search = document.getElementById("customerSearch");
  const typeFilter = document.getElementById("filterCustomerType");
  const resetBtn = document.getElementById("resetCustomerFilters");

  const applyFilters = () => {
    let filtered = [...customers];

    const q = (search?.value || "").trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q),
      );
    }

    const type = typeFilter?.value;
    if (type) filtered = filtered.filter((c) => c.type === type);

    renderCustomers(filtered);
  };

  search?.addEventListener("input", applyFilters);
  typeFilter?.addEventListener("change", applyFilters);

  resetBtn?.addEventListener("click", () => {
    if (search) search.value = "";
    if (typeFilter) typeFilter.value = "";
    renderCustomers();
  });
}
