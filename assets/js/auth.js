/* ═══════════════════════════════════════════════════════════
   Auth Pages - Login / Register
═══════════════════════════════════════════════════════════ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggle();
  initLoginForm();
  initRegisterForm();
});

/* ═══════════════════════════════════════
   1. Password Toggle
═══════════════════════════════════════ */
function initPasswordToggle() {
  const toggleBtns = document.querySelectorAll(".toggle-password");

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      const icon = btn.querySelector("i");

      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });
}

/* ═══════════════════════════════════════
   2. Login Form
═══════════════════════════════════════ */
function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    if (!email || !password) {
      showToast("⚠️ تنبيه", "من فضلك أدخل البريد وكلمة المرور", "warning");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> جاري الدخول...';
    btn.disabled = true;

    setTimeout(() => {
      // حفظ المستخدم
      const user = {
        email,
        name: email.split("@")[0],
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("currentUser", JSON.stringify(user));

      if (email === "admin@gmail.com" && password === "admin123") {
        showToast("✅ أهلاً بيك", "تم تسجيل الدخول بنجاح", "success");
        setTimeout(() => {
          window.location.href = "admin/dashboard.html";
        }, 1000);
      } else {
        showToast("✅ أهلاً بيك", "تم تسجيل الدخول بنجاح", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      }
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }, 1500);
  });
}

/* ═══════════════════════════════════════
   3. Register Form
═══════════════════════════════════════ */
function initRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="tel"]',
    );
    const passwordInput = document.getElementById("passwordInput");
    const confirmPassword = document.getElementById("confirmPassword");
    const agreeTerms = document.getElementById("agreeTerms");

    // Validation
    if (passwordInput.value !== confirmPassword.value) {
      showToast("❌ خطأ", "كلمتا المرور غير متطابقتين", "error");
      return;
    }

    if (passwordInput.value.length < 6) {
      showToast("❌ خطأ", "كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
      return;
    }

    if (!agreeTerms.checked) {
      showToast("⚠️ تنبيه", "يجب الموافقة على الشروط والأحكام", "warning");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
    btn.disabled = true;

    setTimeout(() => {
      const user = {
        firstName: inputs[0].value,
        lastName: inputs[1].value,
        email: inputs[2].value,
        phone: inputs[3].value,
        registerTime: new Date().toISOString(),
      };
      localStorage.setItem("currentUser", JSON.stringify(user));

      showToast(
        "🎉 مبروك",
        "تم إنشاء حسابك بنجاح! خصم 10% في انتظارك",
        "success",
      );

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }, 1800);
  });
}
