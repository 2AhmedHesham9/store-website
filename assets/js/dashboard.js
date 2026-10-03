/* ═══════════════════════════════════════════════════════════
   Dashboard - Main JavaScript
═══════════════════════════════════════════════════════════ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initThemeToggle();
  initCharts();
  initLogout();
  checkAuth();
});

/* ═══════════════════════════════════════
   1. Sidebar Toggle (Mobile)
═══════════════════════════════════════ */
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggle");
  const sidebarClose = document.getElementById("sidebarClose");

  if (!sidebar || !menuToggle) return;

  const openSidebar = () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeSidebar = () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  menuToggle.addEventListener("click", openSidebar);
  sidebarClose?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);

  // Close on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 991) closeSidebar();
  });
}

/* ═══════════════════════════════════════
   2. Theme Toggle
═══════════════════════════════════════ */
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const icon = themeToggle.querySelector("i");
  const savedTheme = localStorage.getItem("theme") || "light";

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (icon) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (icon) {
      icon.classList.toggle("fa-moon", !isDark);
      icon.classList.toggle("fa-sun", isDark);
    }
  });
}

/* ═══════════════════════════════════════
   3. Charts
═══════════════════════════════════════ */
function initCharts() {
  if (typeof Chart === "undefined") return;

  const isDark = document.body.classList.contains("dark-mode");
  const textColor = isDark ? "#b0b3b8" : "#6c757d";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  // Sales Chart
  const salesCtx = document.getElementById("salesChart");
  if (salesCtx) {
    const gradient = salesCtx
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(233, 69, 96, 0.4)");
    gradient.addColorStop(1, "rgba(233, 69, 96, 0.02)");

    new Chart(salesCtx, {
      type: "line",
      data: {
        labels: [
          "السبت",
          "الأحد",
          "الاثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
        ],
        datasets: [
          {
            label: "المبيعات (ج)",
            data: [8500, 12000, 9800, 14500, 11200, 16800, 12450],
            borderColor: "#e94560",
            backgroundColor: gradient,
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#e94560",
            pointBorderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1a2e",
            padding: 12,
            titleFont: { family: "Cairo", size: 13 },
            bodyFont: { family: "Cairo", size: 13 },
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              label: (ctx) => ctx.parsed.y.toLocaleString("ar-EG") + " ج",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: "Cairo", size: 11 },
              callback: (v) => v / 1000 + "k",
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              font: { family: "Cairo", size: 12 },
            },
          },
        },
      },
    });
  }

  // Categories Chart (Doughnut)
  const catCtx = document.getElementById("categoriesChart");
  if (catCtx) {
    const categoriesData = [
      { label: "شبابي", value: 35, color: "#e94560" },
      { label: "كلاسيك", value: 25, color: "#4ecdc4" },
      { label: "رياضي", value: 20, color: "#f9c74f" },
      { label: "كاجوال", value: 15, color: "#4a90e2" },
      { label: "إكسسوارات", value: 5, color: "#9b59b6" },
    ];

    new Chart(catCtx, {
      type: "doughnut",
      data: {
        labels: categoriesData.map((c) => c.label),
        datasets: [
          {
            data: categoriesData.map((c) => c.value),
            backgroundColor: categoriesData.map((c) => c.color),
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1a2e",
            padding: 10,
            titleFont: { family: "Cairo" },
            bodyFont: { family: "Cairo" },
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ctx.parsed + "%",
            },
          },
        },
      },
    });

    // Custom Legend
    const legend = document.getElementById("categoriesLegend");
    if (legend) {
      legend.innerHTML = categoriesData
        .map(
          (c) => `
                <div class="legend-item">
                    <span class="legend-label">
                        <span class="legend-color" style="background: ${c.color};"></span>
                        ${c.label}
                    </span>
                    <span class="legend-value">${c.value}%</span>
                </div>
            `,
        )
        .join("");
    }
  }
}

/* ═══════════════════════════════════════
   4. Logout
═══════════════════════════════════════ */
function initLogout() {
  const logoutBtns = document.querySelectorAll("#logoutBtn, #logoutBtn2");

  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
        localStorage.removeItem("adminUser");
        window.location.href = "../index.html";
      }
    });
  });
}

/* ═══════════════════════════════════════
   5. Check Auth (تجريبي)
═══════════════════════════════════════ */
function checkAuth() {
  // ملاحظة: تفعيل الحماية لاحقاً
  // const adminUser = localStorage.getItem('adminUser');
  // if (!adminUser) window.location.href = 'login.html';
}
