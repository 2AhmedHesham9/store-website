/* ═══════════════════════════════════════════════════════════
   Shop Page - JavaScript
═══════════════════════════════════════════════════════════ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initShopFilters();
  initPriceRange();
  initSorting();
  initViewToggle();
  initSidebarToggle();
  initClearFilters();
  initURLParams();
});

/* ═══════════════════════════════════════
   1. Shop Filters
═══════════════════════════════════════ */
function initShopFilters() {
  const categoryRadios = document.querySelectorAll("#categoryFilter input");
  const sizeBtns = document.querySelectorAll("#sizeFilter .size-btn");
  const colorBtns = document.querySelectorAll("#colorFilter .color-btn");
  const products = document.querySelectorAll("#shopGrid .product-item");

  let currentFilters = {
    category: "all",
    size: "all",
    color: "all",
    price: 1000,
  };

  // Category Filter
  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      currentFilters.category = e.target.value;
      applyFilters();
    });
  });

  // Size Filter
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilters.size = btn.dataset.size;
      applyFilters();
    });
  });

  // Color Filter
  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      colorBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilters.color = btn.dataset.color;
      applyFilters();
    });
  });

  // Price Filter
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      currentFilters.price = parseInt(e.target.value);
      if (priceValue) priceValue.textContent = e.target.value + " ج";
      applyFilters();
    });
  }

  function applyFilters() {
    let visibleCount = 0;

    products.forEach((product) => {
      const category = product.dataset.category;
      const price = parseInt(product.dataset.price) || 0;

      const matchesCategory =
        currentFilters.category === "all" ||
        category === currentFilters.category;
      const matchesPrice = price <= currentFilters.price;

      if (matchesCategory && matchesPrice) {
        product.style.display = "";
        visibleCount++;
        setTimeout(() => {
          product.style.opacity = "1";
          product.style.transform = "translateY(0)";
        }, 30);
      } else {
        product.style.opacity = "0";
        product.style.transform = "translateY(20px)";
        setTimeout(() => {
          product.style.display = "none";
        }, 250);
      }
    });

    // Update results count
    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) resultsCount.textContent = visibleCount;

    // Update AOS
    if (typeof AOS !== "undefined") AOS.refresh();

    // Show "No Results" if nothing found
    showNoResults(visibleCount);
  }

  function showNoResults(count) {
    let noResultsEl = document.getElementById("noResults");

    if (count === 0) {
      if (!noResultsEl) {
        noResultsEl = document.createElement("div");
        noResultsEl.id = "noResults";
        noResultsEl.className = "col-12 text-center py-5";
        noResultsEl.innerHTML = `
                    <i class="fa-solid fa-box-open" style="font-size: 4rem; color: var(--text-light); margin-bottom: 20px;"></i>
                    <h4>لا توجد منتجات مطابقة</h4>
                    <p class="text-muted">جرب تغيير الفلاتر أو مسحها</p>
                `;
        document.getElementById("shopGrid").appendChild(noResultsEl);
      }
      noResultsEl.style.display = "block";
    } else if (noResultsEl) {
      noResultsEl.style.display = "none";
    }
  }
}

/* ═══════════════════════════════════════
   2. Price Range
═══════════════════════════════════════ */
function initPriceRange() {
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  if (!priceRange) return;

  priceRange.addEventListener("input", () => {
    if (priceValue) {
      priceValue.textContent = priceRange.value + " ج";
    }
  });
}

/* ═══════════════════════════════════════
   3. Sorting
═══════════════════════════════════════ */
function initSorting() {
  const sortSelect = document.getElementById("sortSelect");
  const grid = document.getElementById("shopGrid");
  if (!sortSelect || !grid) return;

  sortSelect.addEventListener("change", () => {
    const products = Array.from(grid.querySelectorAll(".product-item"));
    const sortBy = sortSelect.value;

    products.sort((a, b) => {
      const priceA = parseInt(a.dataset.price) || 0;
      const priceB = parseInt(b.dataset.price) || 0;
      const ratingA = parseFloat(a.dataset.rating) || 0;
      const ratingB = parseFloat(b.dataset.rating) || 0;

      switch (sortBy) {
        case "cheap":
          return priceA - priceB;
        case "expensive":
          return priceB - priceA;
        case "rating":
          return ratingB - ratingA;
        case "newest":
          return b.dataset.new === "true" ? 1 : -1;
        default:
          return 0;
      }
    });

    // إعادة ترتيب العناصر
    products.forEach((product) => grid.appendChild(product));

    // تأثير أنيميشن
    products.forEach((product, index) => {
      product.style.opacity = "0";
      product.style.transform = "translateY(20px)";
      setTimeout(() => {
        product.style.opacity = "1";
        product.style.transform = "translateY(0)";
        product.style.transition = "all 0.4s ease";
      }, index * 50);
    });

    showToast("🔄 تم الترتيب", "تم ترتيب المنتجات بنجاح", "info");
  });
}

/* ═══════════════════════════════════════
   4. View Toggle (Grid / List)
═══════════════════════════════════════ */
function initViewToggle() {
  const viewBtns = document.querySelectorAll(".view-btn");
  const grid = document.getElementById("shopGrid");
  if (!viewBtns.length || !grid) return;

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      viewBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const view = btn.dataset.view;
      if (view === "list") {
        grid.classList.add("list-view");
      } else {
        grid.classList.remove("list-view");
      }
    });
  });
}

/* ═══════════════════════════════════════
   5. Sidebar Toggle (Mobile)
═══════════════════════════════════════ */
function initSidebarToggle() {
  const toggleBtn = document.getElementById("filterToggle");
  const sidebar = document.getElementById("shopSidebar");
  if (!toggleBtn || !sidebar) return;

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9998;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
  document.body.appendChild(overlay);

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.style.opacity = "1";
    overlay.style.visibility = "visible";
    document.body.style.overflow = "hidden";
  });

  overlay.addEventListener("click", closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
    document.body.style.overflow = "";
  }

  // Close button inside sidebar
  const closeBtn = document.createElement("button");
  closeBtn.className = "sidebar-close";
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--bg-secondary);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
    `;
  closeBtn.addEventListener("click", closeSidebar);
  sidebar.appendChild(closeBtn);
}

/* ═══════════════════════════════════════
   6. Clear Filters
═══════════════════════════════════════ */
function initClearFilters() {
  const clearBtn = document.getElementById("clearFilters");
  if (!clearBtn) return;

  clearBtn.addEventListener("click", () => {
    // Reset categories
    const allCat = document.querySelector('#categoryFilter input[value="all"]');
    if (allCat) allCat.checked = true;

    // Reset sizes
    document.querySelectorAll("#sizeFilter .size-btn").forEach((b, i) => {
      b.classList.toggle("active", i === 0);
    });

    // Reset colors
    document.querySelectorAll("#colorFilter .color-btn").forEach((b, i) => {
      b.classList.toggle("active", i === 0);
    });

    // Reset price
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");
    if (priceRange) priceRange.value = 1000;
    if (priceValue) priceValue.textContent = "1000 ج";

    // Reset brand checkboxes
    document
      .querySelectorAll('.filter-list input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));

    // Show all products
    document.querySelectorAll("#shopGrid .product-item").forEach((p) => {
      p.style.display = "";
      p.style.opacity = "1";
      p.style.transform = "translateY(0)";
    });

    // Update count
    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount)
      resultsCount.textContent = document.querySelectorAll(
        "#shopGrid .product-item",
      ).length;

    showToast("🔄 تم مسح الفلاتر", "تم إعادة تعيين جميع الفلاتر", "info");
  });
}

/* ═══════════════════════════════════════
   7. URL Parameters (من الروابط)
═══════════════════════════════════════ */
function initURLParams() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("cat");
  const search = params.get("search");

  if (category) {
    const radio = document.querySelector(
      `#categoryFilter input[value="${category}"]`,
    );
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event("change"));
    }
  }

  if (search) {
    const searchInput = document.getElementById("sidebarSearch");
    if (searchInput) {
      searchInput.value = search;
      // Filter products by search term
      filterBySearch(search);
    }
  }
}

/* ═══════════════════════════════════════
   8. Search Helper
═══════════════════════════════════════ */
function filterBySearch(term) {
  const products = document.querySelectorAll("#shopGrid .product-item");
  const searchTerm = term.toLowerCase().trim();
  let visibleCount = 0;

  products.forEach((product) => {
    const title =
      product.querySelector(".product-title")?.textContent.toLowerCase() || "";
    const category =
      product.querySelector(".product-cat")?.textContent.toLowerCase() || "";

    if (title.includes(searchTerm) || category.includes(searchTerm)) {
      product.style.display = "";
      visibleCount++;
    } else {
      product.style.display = "none";
    }
  });

  const resultsCount = document.getElementById("resultsCount");
  if (resultsCount) resultsCount.textContent = visibleCount;
}

/* ═══════════════════════════════════════
   9. Sidebar Search Listener
═══════════════════════════════════════ */
const sidebarSearch = document.getElementById("sidebarSearch");
if (sidebarSearch) {
  sidebarSearch.addEventListener("input", (e) => {
    filterBySearch(e.target.value);
  });
}
