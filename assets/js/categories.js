/* ═══════════════════════════════════════════════════════════
   Categories Management
═══════════════════════════════════════════════════════════ */

'use strict';

const DEFAULT_CATEGORIES = [
    { id: 'cat1', name: 'ملابس شبابي', slug: 'youth', icon: 'fa-shirt', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500', desc: 'تيشيرتات، بناطيل، جاكيتات', products: 120, status: 'active' },
    { id: 'cat2', name: 'ملابس كلاسيك', slug: 'classic', icon: 'fa-user-tie', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', desc: 'قمصان، بدل رسمية', products: 85, status: 'active' },
    { id: 'cat3', name: 'ملابس رياضية', slug: 'sport', icon: 'fa-dumbbell', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500', desc: 'تراكسوت، شورتات، هودي', products: 95, status: 'active' },
    { id: 'cat4', name: 'كاجوال', slug: 'casual', icon: 'fa-tshirt', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=500', desc: 'ملابس كاجوال يومية', products: 150, status: 'active' },
    { id: 'cat5', name: 'إكسسوارات', slug: 'accessories', icon: 'fa-hat-cowboy', image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=500', desc: 'كابات، أحزمة، محافظ', products: 48, status: 'active' }
];

let categories = [];
let deleteTargetId = null;


document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    renderCategories();
    initAddCategory();
    initSaveCategory();
    initDeleteCategory();
});


function loadCategories() {
    try {
        categories = JSON.parse(localStorage.getItem('admin_categories')) || [...DEFAULT_CATEGORIES];
    } catch {
        categories = [...DEFAULT_CATEGORIES];
    }
    if (!localStorage.getItem('admin_categories')) saveCategories();
}

function saveCategories() {
    localStorage.setItem('admin_categories', JSON.stringify(categories));
}


function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    const countEl = document.getElementById('categoriesCount');
    if (!grid) return;

    if (countEl) countEl.textContent = categories.length;

    if (categories.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-layer-group" style="font-size: 4rem; color: #9ca3af; display: block; margin-bottom: 20px;"></i>
                <h4 style="color: #6c757d;">لا توجد أقسام</h4>
                <p class="text-muted">ابدأ بإضافة قسم جديد</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = categories.map(c => `
        <div class="col-lg-4 col-md-6">
            <div class="category-admin-card">
                <div class="category-admin-img">
                    ${c.image ? `<img src="${c.image}" alt="${c.name}">` : `<i class="fa-solid ${c.icon || 'fa-layer-group'}"></i>`}
                </div>
                <div class="category-admin-info">
                    <h5>${c.name}</h5>
                    <p>${c.desc || 'بدون وصف'}</p>
                    <div class="category-admin-stats">
                        <div>
                            <span>المنتجات</span>
                            <strong>${c.products || 0}</strong>
                        </div>
                        <div>
                            <span>الرابط</span>
                            <strong>/${c.slug}</strong>
                        </div>
                    </div>
                    <div class="category-admin-actions">
                        <button class="btn btn-outline-secondary" onclick="editCategory('${c.id}')">
                            <i class="fa-solid fa-pen"></i> تعديل
                        </button>
                        <button class="btn btn-outline-danger" onclick="askDeleteCategory('${c.id}')" style="border-color: #e94560; color: #e94560;">
                            <i class="fa-solid fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}


function initAddCategory() {
    const btn = document.getElementById('addCategoryBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        document.getElementById('categoryModalTitle').textContent = 'إضافة قسم جديد';
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
        new bootstrap.Modal(document.getElementById('categoryModal')).show();
    });
}


function editCategory(id) {
    const c = categories.find(x => x.id === id);
    if (!c) return;

    document.getElementById('categoryModalTitle').textContent = 'تعديل القسم';
    document.getElementById('categoryId').value = c.id;
    document.getElementById('categoryName').value = c.name;
    document.getElementById('categorySlug').value = c.slug || '';
    document.getElementById('categoryImage').value = c.image || '';
    document.getElementById('categoryIcon').value = c.icon || '';
    document.getElementById('categoryDesc').value = c.desc || '';

    new bootstrap.Modal(document.getElementById('categoryModal')).show();
}


function initSaveCategory() {
    const btn = document.getElementById('saveCategoryBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const form = document.getElementById('categoryForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }

        const id = document.getElementById('categoryId').value;
        const name = document.getElementById('categoryName').value.trim();
        const slug = document.getElementById('categorySlug').value.trim() || name.toLowerCase().replace(/\s+/g, '-');
        const image = document.getElementById('categoryImage').value.trim();
        const icon = document.getElementById('categoryIcon').value.trim() || 'fa-layer-group';
        const desc = document.getElementById('categoryDesc').value.trim();

        if (id) {
            const index = categories.findIndex(x => x.id === id);
            if (index > -1) {
                categories[index] = { ...categories[index], name, slug, image, icon, desc };
            }
            showToast('✅ تم التحديث', `تم تعديل "${name}" بنجاح`, 'success');
        } else {
            categories.push({
                id: 'cat' + Date.now(),
                name, slug, image, icon, desc,
                products: 0,
                status: 'active'
            });
            showToast('🎉 تم الإضافة', `تم إضافة "${name}" بنجاح`, 'success');
        }

        saveCategories();
        renderCategories();
        bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
    });
}


function askDeleteCategory(id) {
    const c = categories.find(x => x.id === id);
    if (!c) return;

    deleteTargetId = id;
    document.getElementById('deleteCategoryName').textContent = c.name;
    new bootstrap.Modal(document.getElementById('deleteCategoryModal')).show();
}


function initDeleteCategory() {
    const btn = document.getElementById('confirmDeleteCategoryBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        categories = categories.filter(x => x.id !== deleteTargetId);
        saveCategories();
        renderCategories();
        bootstrap.Modal.getInstance(document.getElementById('deleteCategoryModal')).hide();
        showToast('🗑️ تم الحذف', 'تم حذف القسم بنجاح', 'info');
        deleteTargetId = null;
    });
}