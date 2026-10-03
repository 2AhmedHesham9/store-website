/* ═══════════════════════════════════════════════════════════
   Reports Page
═══════════════════════════════════════════════════════════ */

'use strict';

let revenueChart, topCategoriesChart, orderStatusChart;


document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    initPeriodBtns();
    initExport();
});


function initCharts() {
    if (typeof Chart === 'undefined') return;

    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#b0b3b8' : '#6c757d';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

    // Revenue Chart
    const revCtx = document.getElementById('revenueChart');
    if (revCtx) {
        const grad = revCtx.getContext('2d').createLinearGradient(0, 0, 0, 350);
        grad.addColorStop(0, 'rgba(233, 69, 96, 0.4)');
        grad.addColorStop(1, 'rgba(233, 69, 96, 0.02)');

        revenueChart = new Chart(revCtx, {
            type: 'line',
            data: {
                labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
                datasets: [
                    {
                        label: 'هذا الشهر',
                        data: [25000, 32000, 28000, 39500],
                        borderColor: '#e94560',
                        backgroundColor: grad,
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#e94560',
                        pointBorderWidth: 3
                    },
                    {
                        label: 'الشهر الماضي',
                        data: [20000, 25000, 22000, 30000],
                        borderColor: '#4ecdc4',
                        borderWidth: 2,
                        borderDash: [6, 6],
                        tension: 0.4,
                        fill: false,
                        pointRadius: 4,
                        pointBackgroundColor: '#4ecdc4'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: 'Cairo', size: 12 },
                            color: textColor,
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a1a2e',
                        padding: 12,
                        titleFont: { family: 'Cairo' },
                        bodyFont: { family: 'Cairo' },
                        cornerRadius: 10,
                        callbacks: {
                            label: (ctx) => ctx.dataset.label + ': ' + ctx.parsed.y.toLocaleString('ar-EG') + ' ج'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: {
                            color: textColor,
                            font: { family: 'Cairo', size: 11 },
                            callback: (v) => (v / 1000) + 'k'
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { family: 'Cairo', size: 12 } }
                    }
                }
            }
        });
    }

    // Top Categories
    const catCtx = document.getElementById('topCategoriesChart');
    if (catCtx) {
        topCategoriesChart = new Chart(catCtx, {
            type: 'bar',
            data: {
                labels: ['شبابي', 'كلاسيك', 'رياضي', 'كاجوال', 'إكسسوارات'],
                datasets: [{
                    label: 'المبيعات (ج)',
                    data: [35000, 28000, 22000, 18000, 8000],
                    backgroundColor: [
                        'rgba(233, 69, 96, 0.85)',
                        'rgba(78, 205, 196, 0.85)',
                        'rgba(249, 199, 79, 0.85)',
                        'rgba(74, 144, 226, 0.85)',
                        'rgba(155, 89, 182, 0.85)'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1a1a2e',
                        padding: 12,
                        titleFont: { family: 'Cairo' },
                        bodyFont: { family: 'Cairo' },
                        cornerRadius: 10,
                        callbacks: {
                            label: (ctx) => ctx.parsed.y.toLocaleString('ar-EG') + ' ج'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: {
                            color: textColor,
                            font: { family: 'Cairo', size: 11 },
                            callback: (v) => (v / 1000) + 'k'
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { family: 'Cairo', size: 12 } }
                    }
                }
            }
        });
    }

    // Order Status
    const statusCtx = document.getElementById('orderStatusChart');
    if (statusCtx) {
        orderStatusChart = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['مكتمل', 'قيد المعالجة', 'تم الشحن', 'ملغي'],
                datasets: [{
                    data: [65, 15, 12, 8],
                    backgroundColor: ['#4ecdc4', '#f9c74f', '#4a90e2', '#e94560'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Cairo', size: 12 },
                            color: textColor,
                            usePointStyle: true,
                            padding: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a1a2e',
                        padding: 10,
                        titleFont: { family: 'Cairo' },
                        bodyFont: { family: 'Cairo' },
                        cornerRadius: 8,
                        callbacks: {
                            label: (ctx) => ctx.label + ': ' + ctx.parsed + '%'
                        }
                    }
                }
            }
        });
    }
}


function initPeriodBtns() {
    const btns = document.querySelectorAll('.period-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const period = parseInt(btn.dataset.period);
            updateChartsForPeriod(period);
        });
    });
}


function updateChartsForPeriod(period) {
    if (!revenueChart) return;

    let labels, thisMonth, lastMonth;

    if (period === 7) {
        labels = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
        thisMonth = [8500, 12000, 9800, 14500, 11200, 16800, 12450];
        lastMonth = [7200, 10500, 8500, 12000, 9800, 14200, 11000];
    } else if (period === 30) {
        labels = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'];
        thisMonth = [25000, 32000, 28000, 39500];
        lastMonth = [20000, 25000, 22000, 30000];
    } else if (period === 90) {
        labels = ['يناير', 'فبراير', 'مارس'];
        thisMonth = [85000, 92000, 105000];
        lastMonth = [72000, 80000, 88000];
    } else {
        labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        thisMonth = [280000, 320000, 300000, 380000];
        lastMonth = [240000, 280000, 260000, 320000];
    }

    revenueChart.data.labels = labels;
    revenueChart.data.datasets[0].data = thisMonth;
    revenueChart.data.datasets[1].data = lastMonth;
    revenueChart.update();

    showToast('📊 تم التحديث', `تم عرض تقارير ${period === 365 ? 'سنة' : period + ' يوم'}`, 'info');
}


function initExport() {
    const excelBtn = document.getElementById('exportExcelBtn');
    const pdfBtn = document.getElementById('exportPdfBtn');

    excelBtn?.addEventListener('click', () => {
        // Create CSV
        const rows = [
            ['المنتج', 'الكمية المباعة', 'الإيرادات'],
            ['هودي رياضي شتوي', '240', '91200'],
            ['تيشيرت قطن أوفر سايز', '185', '44400'],
            ['قميص كلاسيك رسمي', '140', '63000'],
            ['بنطلون جينز كاجوال', '95', '30400'],
            ['تراكسوت رياضي', '78', '21840']
        ];

        const csv = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'تقرير-المبيعات.csv';
        a.click();
        URL.revokeObjectURL(url);

        showToast('📊 تم التصدير', 'تم تصدير التقرير بصيغة Excel/CSV', 'success');
    });

    pdfBtn?.addEventListener('click', () => {
        window.print();
        showToast('📄 PDF', 'اختر "حفظ كـ PDF" من نافذة الطباعة', 'info');
    });
}