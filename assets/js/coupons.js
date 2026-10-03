/* ═══════════════════════════════════════════════════════════
   Coupons Management
═══════════════════════════════════════════════════════════ */

"use strict";

const DEFAULT_COUPONS = [
  {
    id: "cp1",
    code: "SAVE10",
    type: "percent",
    value: 10,
    minOrder: 200,
    uses: 45,
    maxUses: 100,
    start: "2026-01-01",
    end: "2026-12-31",
    status: "active",
  },
  {
    id: "cp2",
    code: "SAVE20",
    type: "percent",
    value: 20,
    minOrder: 500,
    uses: 28,
    maxUses: 50,
    start: "2026-01-01",
    end: "2026-06-30",
    status: "active",
  },
  {
    id: "cp3",
    code: "WELCOME",
    type: "fixed",
    value: 50,
    minOrder: 0,
    uses: 120,
    maxUses: 200,
    start: "2024-12-01",
    end: "2026-12-31",
    status: "active",
  },
  {
    id: "cp4",
    code: "SUMMER25",
    type: "percent",
    value: 25,
    minOrder: 800,
    uses: 15,
    maxUses: 30,
    start: "2024-06-01",
    end: "2024-09-01",
    status: "expired",
  },
  {
    id: "cp5",
    code: "FLASH50",
    type: "fixed",
    value: 100,
    minOrder: 1000,
    uses: 8,
    maxUses: 20,
    start: "2026-01-10",
    end: "2026-01-20",
    status: "active",
  },
];

let coupons = [];
let deleteTargetId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadCoupons();
  renderCoupons();
  initAddCoupon();
  initSaveCoupon();
  initDeleteCoupon();
  initFilters();
  updateStats();
});

function loadCoupons() {
  try {
    coupons = JSON.parse(localStorage.getItem("admin_coupons")) || [
      ...DEFAULT_COUPONS,
    ];
  } catch {
    coupons = [...DEFAULT_COUPONS];
  }
  if (!localStorage.getItem("admin_coupons")) saveCoupons();
}

function saveCoupons() {
  localStorage.setItem("admin_coupons", JSON.stringify(coupons));
}

function updateStats() {
  const active = coupons.filter((c) => c.status === "active").length;
  const expired = coupons.filter((c) => c.status === "expired").length;
  const activeEl = document.getElementById("activeCouponsStat");
  const expiredEl = document.getElementById("expiredCouponsStat");
  if (activeEl) activeEl.textContent = active;
  if (expiredEl) expiredEl.textContent = expired;
}

function renderCoupons(filtered = null) {
  const list = filtered || coupons;
  const tbody = document.getElementById("couponsTableBody");
  const countEl = document.getElementById("couponsCount");
  if (!tbody) return;

  if (countEl) countEl.textContent = coupons.length;

  if (list.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    <i class="fa-solid fa-ticket" style="font-size: 3rem; color: #9ca3af; display: block; margin-bottom: 15px;"></i>
                    <h6 style="color: #6c757d;">لا توجد كوبونات</h6>
                </td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = list
    .map((c) => {
      const discountText =
        c.type === "percent" ? c.value + "%" : c.value + " ج";
      const statusLabel =
        c.status === "active"
          ? "نشط"
          : c.status === "expired"
            ? "منتهي"
            : "معطل";
      const statusClass =
        c.status === "active"
          ? "completed"
          : c.status === "expired"
            ? "cancelled"
            : "pending";

      return `
            <tr>
                <td>
                    <div class="coupon-code-cell">
                        <span class="coupon-code-badge">${c.code}</span>
                        <button class="coupon-copy-btn" onclick="copyCode('${c.code}')" title="نسخ">
                            <i class="fa-regular fa-copy"></i>
                        </button>
                    </div>
                </td>
                <td><span class="discount-value">${discountText}</span></td>
                <td>${c.minOrder > 0 ? c.minOrder + " ج" : "بدون حد"}</td>
                <td>
                    <strong>${c.uses}</strong> / ${c.maxUses}
                </td>
                <td>${c.start}</td>
                <td>${c.end}</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>
                    <button class="action-icon-btn edit" onclick="editCoupon('${c.id}')" title="تعديل">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-icon-btn delete" onclick="askDeleteCoupon('${c.id}')" title="حذف">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  updateStats();
}

function copyCode(code) {
  navigator.clipboard
    .writeText(code)
    .then(() => {
      showToast("📋 تم النسخ", `تم نسخ الكود "${code}"`, "success");
    })
    .catch(() => {
      showToast("⚠️ تنبيه", "لم يتم النسخ، انسخه يدوياً: " + code, "warning");
    });
}

function initAddCoupon() {
  const btn = document.getElementById("addCouponBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    document.getElementById("couponModalTitle").textContent =
      "إضافة كوبون جديد";
    document.getElementById("couponForm").reset();

    // Default dates
    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    document.getElementById("couponId").value = "";
    document.getElementById("couponStartDate").value = today;
    document.getElementById("couponEndDate").value = nextMonth
      .toISOString()
      .split("T")[0];

    new bootstrap.Modal(document.getElementById("couponModal")).show();
  });
}

function editCoupon(id) {
  const c = coupons.find((x) => x.id === id);
  if (!c) return;

  document.getElementById("couponModalTitle").textContent = "تعديل الكوبون";
  document.getElementById("couponId").value = c.id;
  document.getElementById("couponCode").value = c.code;
  document.getElementById("couponType").value = c.type;
  document.getElementById("couponValue").value = c.value;
  document.getElementById("couponMinOrder").value = c.minOrder;
  document.getElementById("couponMaxUses").value = c.maxUses;
  document.getElementById("couponStartDate").value = c.start;
  document.getElementById("couponEndDate").value = c.end;

  const statusRadio = document.querySelector(
    `input[name="couponStatus"][value="${c.status}"]`,
  );
  if (statusRadio) statusRadio.checked = true;

  new bootstrap.Modal(document.getElementById("couponModal")).show();
}

function initSaveCoupon() {
  const btn = document.getElementById("saveCouponBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const form = document.getElementById("couponForm");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const id = document.getElementById("couponId").value;
    const code = document
      .getElementById("couponCode")
      .value.trim()
      .toUpperCase();
    const type = document.getElementById("couponType").value;
    const value = parseFloat(document.getElementById("couponValue").value);
    const minOrder =
      parseFloat(document.getElementById("couponMinOrder").value) || 0;
    const maxUses =
      parseInt(document.getElementById("couponMaxUses").value) || 100;
    const start = document.getElementById("couponStartDate").value;
    const end = document.getElementById("couponEndDate").value;
    const status = document.querySelector(
      'input[name="couponStatus"]:checked',
    ).value;

    if (id) {
      const index = coupons.findIndex((x) => x.id === id);
      if (index > -1) {
        coupons[index] = {
          ...coupons[index],
          code,
          type,
          value,
          minOrder,
          maxUses,
          start,
          end,
          status,
        };
      }
      showToast("✅ تم التحديث", `تم تعديل الكوبون "${code}"`, "success");
    } else {
      if (coupons.some((c) => c.code === code)) {
        showToast("❌ خطأ", "هذا الكود موجود بالفعل", "error");
        return;
      }
      coupons.unshift({
        id: "cp" + Date.now(),
        code,
        type,
        value,
        minOrder,
        maxUses,
        start,
        end,
        status,
        uses: 0,
      });
      showToast("🎉 تم الإضافة", `تم إضافة الكوبون "${code}"`, "success");
    }

    saveCoupons();
    renderCoupons();
    bootstrap.Modal.getInstance(document.getElementById("couponModal")).hide();
  });
}

function askDeleteCoupon(id) {
  const c = coupons.find((x) => x.id === id);
  if (!c) return;

  deleteTargetId = id;
  document.getElementById("deleteCouponCode").textContent = c.code;
  new bootstrap.Modal(document.getElementById("deleteCouponModal")).show();
}

function initDeleteCoupon() {
  const btn = document.getElementById("confirmDeleteCouponBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    coupons = coupons.filter((x) => x.id !== deleteTargetId);
    saveCoupons();
    renderCoupons();
    bootstrap.Modal.getInstance(
      document.getElementById("deleteCouponModal"),
    ).hide();
    showToast("🗑️ تم الحذف", "تم حذف الكوبون بنجاح", "info");
    deleteTargetId = null;
  });
}

function initFilters() {
  const search = document.getElementById("couponSearch");
  const statusFilter = document.getElementById("filterCouponStatus");
  const resetBtn = document.getElementById("resetCouponFilters");

  const applyFilters = () => {
    let filtered = [...coupons];

    const q = (search?.value || "").trim().toLowerCase();
    if (q) filtered = filtered.filter((c) => c.code.toLowerCase().includes(q));

    const st = statusFilter?.value;
    if (st) filtered = filtered.filter((c) => c.status === st);

    renderCoupons(filtered);
  };

  search?.addEventListener("input", applyFilters);
  statusFilter?.addEventListener("change", applyFilters);

  resetBtn?.addEventListener("click", () => {
    if (search) search.value = "";
    if (statusFilter) statusFilter.value = "";
    renderCoupons();
  });
}
