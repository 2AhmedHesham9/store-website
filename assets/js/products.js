/* ═══════════════════════════════════════════════════════════
   Products Management - CRUD
═══════════════════════════════════════════════════════════ */

"use strict";

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "تيشيرت قطن أوفر سايز",
    category: "youth",
    price: 240,
    oldPrice: 300,
    stock: 45,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
    status: "active",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "p2",
    name: "قميص كلاسيك رسمي",
    category: "classic",
    price: 450,
    oldPrice: 0,
    stock: 28,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100",
    status: "active",
    sizes: ["M", "L"],
  },
  {
    id: "p3",
    name: "هودي رياضي شتوي",
    category: "sport",
    price: 380,
    oldPrice: 500,
    stock: 3,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100",
    status: "active",
    sizes: ["L", "XL"],
  },
  {
    id: "p4",
    name: "بنطلون جينز كاجوال",
    category: "casual",
    price: 320,
    oldPrice: 0,
    stock: 15,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=100",
    status: "active",
    sizes: ["M", "L", "XL"],
  },
  {
    id: "p5",
    name: "تيشيرت مطبوع",
    category: "youth",
    price: 180,
    oldPrice: 0,
    stock: 1,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100",
    status: "active",
    sizes: ["S", "M"],
  },
  {
    id: "p6",
    name: "كاب رياضي",
    category: "accessories",
    price: 150,
    oldPrice: 0,
    stock: 0,
    image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=100",
    status: "draft",
    sizes: [],
  },
  {
    id: "p7",
    name: "بدلة رسمية كاملة",
    category: "classic",
    price: 550,
    oldPrice: 650,
    stock: 8,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100",
    status: "active",
    sizes: ["M", "L"],
  },
  {
    id: "p8",
    name: "تراكسوت رياضي",
    category: "sport",
    price: 280,
    oldPrice: 0,
    stock: 22,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=100",
    status: "active",
    sizes: ["M", "L", "XL"],
  },
];

const CATEGORY_NAMES = {
  youth: "شبابي",
  classic: "كلاسيك",
  sport: "رياضي",
  casual: "كاجوال",
  accessories: "إكسسوارات",
};

let products = [];
let deleteTargetId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  renderProducts();
  initAddProduct();
  initSaveProduct();
  initFilters();
  initDelete();
  initSelectAll();
});

/* ═══════════════════════════════════════
   1. Storage
═══════════════════════════════════════ */
function loadProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem("admin_products"));

    products = stored && stored.length ? stored : [...DEFAULT_PRODUCTS];
  } catch {
    products = [...DEFAULT_PRODUCTS];
  }
  if (!localStorage.getItem("admin_products")) saveProducts();
}

function saveProducts() {
  localStorage.setItem("admin_products", JSON.stringify(products));
}

/* ═══════════════════════════════════════
   2. Render Products
═══════════════════════════════════════ */
function renderProducts(filtered = null) {
  const list = filtered || products;
  const tbody = document.getElementById("productsTableBody");
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <i class="fa-solid fa-box-open" style="font-size: 3rem; color: #9ca3af; display: block; margin-bottom: 15px;"></i>
                    <h6 style="color: #6c757d;">لا توجد منتجات مطابقة</h6>
                </td>
            </tr>
        `;
    updateCounts(0);
    return;
  }

  tbody.innerHTML = list
    .map((p) => {
      const stockStatus = getStockStatus(p.stock);
      return `
            <tr data-id="${p.id}">
                <td><input type="checkbox" class="product-checkbox"></td>
                <td>
                    <div class="product-cell">
                        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/50'">
                        <div class="product-cell-info">
                            <h6>${p.name}</h6>
                            <span>#${p.id}</span>
                        </div>
                    </div>
                </td>
                <td>${CATEGORY_NAMES[p.category] || p.category}</td>
                <td>
                    <strong>${p.price} ج</strong>
                    ${p.oldPrice ? `<br><small style="text-decoration: line-through; color: #9ca3af;">${p.oldPrice} ج</small>` : ""}
                </td>
                <td>
                    <span class="stock-indicator ${stockStatus.class}">
                        <span class="dot"></span> ${p.stock} قطعة
                    </span>
                </td>
                <td>
                    <span class="status-badge ${p.status === "active" ? "completed" : "pending"}">
                        ${p.status === "active" ? "منشور" : "مسودة"}
                    </span>
                </td>
                <td>
                    <button class="action-icon-btn edit" onclick="editProduct('${p.id}')" title="تعديل">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-icon-btn delete" onclick="askDelete('${p.id}')" title="حذف">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  updateCounts(list.length);
}

function updateCounts(shown) {
  const countEl = document.getElementById("productsCount");
  if (countEl) countEl.textContent = products.length;
  const showingFrom = document.getElementById("showingFrom");
  const showingTo = document.getElementById("showingTo");
  const totalItems = document.getElementById("totalItems");
  if (showingFrom) showingFrom.textContent = shown > 0 ? 1 : 0;
  if (showingTo) showingTo.textContent = shown;
  if (totalItems) totalItems.textContent = products.length;
}

function getStockStatus(stock) {
  if (stock === 0) return { class: "out" };
  if (stock <= 5) return { class: "low" };
  return { class: "in" };
}

/* ═══════════════════════════════════════
   3. Add Product
═══════════════════════════════════════ */
function initAddProduct() {
  const btn = document.getElementById("addProductBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    document.getElementById("productModalTitle").textContent =
      "إضافة منتج جديد";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    new bootstrap.Modal(document.getElementById("productModal")).show();
  });
}

/* ═══════════════════════════════════════
   4. Edit Product
═══════════════════════════════════════ */
function editProduct(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;

  document.getElementById("productModalTitle").textContent = "تعديل المنتج";
  document.getElementById("productId").value = p.id;
  document.getElementById("productName").value = p.name;
  document.getElementById("productCategory").value = p.category;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("productOldPrice").value = p.oldPrice || "";
  document.getElementById("productStock").value = p.stock;
  document.getElementById("productImage").value = p.image;
  document.getElementById("productDesc").value = p.description || "";

  // Sizes
  document.querySelectorAll(".size-check").forEach((cb) => {
    cb.checked = p.sizes?.includes(cb.value);
  });

  // Status
  const statusRadio = document.querySelector(
    `input[name="productStatus"][value="${p.status}"]`,
  );
  if (statusRadio) statusRadio.checked = true;

  new bootstrap.Modal(document.getElementById("productModal")).show();
}

/* ═══════════════════════════════════════
   5. Save Product
═══════════════════════════════════════ */
function initSaveProduct() {
  const btn = document.getElementById("saveProductBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const form = document.getElementById("productForm");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value;
    const price =
      parseFloat(document.getElementById("productPrice").value) || 0;
    const oldPrice =
      parseFloat(document.getElementById("productOldPrice").value) || 0;
    const stock = parseInt(document.getElementById("productStock").value) || 0;
    const image =
      document.getElementById("productImage").value.trim() ||
      "https://via.placeholder.com/300";
    const description = document.getElementById("productDesc").value.trim();
    const status = document.querySelector(
      'input[name="productStatus"]:checked',
    ).value;
    const sizes = Array.from(
      document.querySelectorAll(".size-check:checked"),
    ).map((cb) => cb.value);

    if (id) {
      // Update
      const index = products.findIndex((x) => x.id === id);
      if (index > -1) {
        products[index] = {
          ...products[index],
          name,
          category,
          price,
          oldPrice,
          stock,
          image,
          description,
          status,
          sizes,
        };
      }
      showToast("✅ تم التحديث", `تم تعديل "${name}" بنجاح`, "success");
    } else {
      // Create
      products.unshift({
        id: "p" + Date.now(),
        name,
        category,
        price,
        oldPrice,
        stock,
        image,
        description,
        status,
        sizes,
      });
      showToast("🎉 تم الإضافة", `تم إضافة "${name}" بنجاح`, "success");
    }

    saveProducts();
    renderProducts();
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
  });
}

/* ═══════════════════════════════════════
   6. Delete Product
═══════════════════════════════════════ */
function askDelete(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;

  deleteTargetId = id;
  document.getElementById("deleteProductName").textContent = p.name;
  new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

function initDelete() {
  const btn = document.getElementById("confirmDeleteBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    products = products.filter((x) => x.id !== deleteTargetId);
    saveProducts();
    renderProducts();

    bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
    showToast("🗑️ تم الحذف", "تم حذف المنتج بنجاح", "info");
    deleteTargetId = null;
  });
}

/* ═══════════════════════════════════════
   7. Filters
═══════════════════════════════════════ */
function initFilters() {
  const search = document.getElementById("productSearch");
  const catFilter = document.getElementById("filterCategory");
  const stockFilter = document.getElementById("filterStock");
  const resetBtn = document.getElementById("resetFilters");

  const applyFilters = () => {
    let filtered = [...products];

    const q = (search?.value || "").trim().toLowerCase();
    if (q) filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));

    const cat = catFilter?.value;
    if (cat) filtered = filtered.filter((p) => p.category === cat);

    const stock = stockFilter?.value;
    if (stock === "in") filtered = filtered.filter((p) => p.stock > 5);
    else if (stock === "low")
      filtered = filtered.filter((p) => p.stock > 0 && p.stock <= 5);
    else if (stock === "out") filtered = filtered.filter((p) => p.stock === 0);

    renderProducts(filtered);
  };

  search?.addEventListener("input", applyFilters);
  catFilter?.addEventListener("change", applyFilters);
  stockFilter?.addEventListener("change", applyFilters);

  resetBtn?.addEventListener("click", () => {
    if (search) search.value = "";
    if (catFilter) catFilter.value = "";
    if (stockFilter) stockFilter.value = "";
    renderProducts();
  });
}

/* ═══════════════════════════════════════
   8. Select All
═══════════════════════════════════════ */
function initSelectAll() {
  const selectAll = document.getElementById("selectAll");
  if (!selectAll) return;

  selectAll.addEventListener("change", () => {
    document.querySelectorAll(".product-checkbox").forEach((cb) => {
      cb.checked = selectAll.checked;
    });
  });
}
