/* ═══════════════════════════════════════════════════════════
   Settings Page
═══════════════════════════════════════════════════════════ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initSettingsTabs();
  initSettingsForm();
  initResetButton();
  loadSettings();
});

function initSettingsTabs() {
  const tabs = document.querySelectorAll(".settings-tab");
  const panels = document.querySelectorAll(".settings-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      panels.forEach((p) => {
        p.classList.toggle("active", p.dataset.panel === target);
      });
    });
  });
}

function initSettingsForm() {
  const form = document.getElementById("settingsForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect all form data
    const settings = {
      siteName: document.getElementById("siteName")?.value || "",
      siteTagline: document.getElementById("siteTagline")?.value || "",
      siteEmail: document.getElementById("siteEmail")?.value || "",
      sitePhone: document.getElementById("sitePhone")?.value || "",
      siteAddress: document.getElementById("siteAddress")?.value || "",
      siteDesc: document.getElementById("siteDesc")?.value || "",
      siteLogo: document.getElementById("siteLogo")?.value || "",
      primaryColor: document.getElementById("primaryColor")?.value || "#e94560",
      shippingCost: document.getElementById("shippingCost")?.value || 50,
      freeShippingMin: document.getElementById("freeShippingMin")?.value || 500,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("admin_settings", JSON.stringify(settings));

    // Apply primary color
    if (settings.primaryColor) {
      document.documentElement.style.setProperty(
        "--secondary",
        settings.primaryColor,
      );
    }

    showToast("✅ تم الحفظ", "تم حفظ الإعدادات بنجاح", "success");
  });
}

function loadSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem("admin_settings"));
    if (!settings) return;

    Object.keys(settings).forEach((key) => {
      const el = document.getElementById(key);
      if (el && settings[key]) el.value = settings[key];
    });

    if (settings.primaryColor) {
      document.documentElement.style.setProperty(
        "--secondary",
        settings.primaryColor,
      );
    }
  } catch (e) {
    console.warn("فشل تحميل الإعدادات", e);
  }
}

function initResetButton() {
  const btn = document.getElementById("resetSettingsBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (!confirm("هل أنت متأكد من استعادة الإعدادات الافتراضية؟")) return;

    localStorage.removeItem("admin_settings");
    document.getElementById("settingsForm").reset();

    // Default values
    document.getElementById("siteName").value = "شباب ستايل";
    document.getElementById("siteTagline").value =
      "متجرك المفضل لأحدث صيحات الموضة";
    document.getElementById("siteEmail").value = "admin@gmail.com";
    document.getElementById("sitePhone").value = "01097957329";
    document.getElementById("siteAddress").value = "القاهرة، مصر";
    document.getElementById("primaryColor").value = "#e94560";
    document.getElementById("shippingCost").value = "50";
    document.getElementById("freeShippingMin").value = "500";

    showToast("🔄 تم الاستعادة", "تم استعادة الإعدادات الافتراضية", "info");
  });
}
