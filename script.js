// ==================== SISTEM PROTEKSI ====================

// 1. Enkripsi nomor WhatsApp (Base64)
const encryptedWA = "MDgyMzUxMTMyMjkz"; // 082351132293 dalam base64

// 2. Blokir klik kanan
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showWarning('Klik kanan tidak diizinkan di halaman ini.');
    return false;
});

// 3. Blokir shortcut keyboard untuk inspect
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, F12
    if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'i' || e.key === 'j')) ||
        (e.ctrlKey && e.key === 'u') ||
        e.key === 'F12' ||
        (e.metaKey && e.altKey && e.key === 'I') // Mac
    ) {
        e.preventDefault();
        showWarning('Akses developer tools diblokir untuk keamanan.');
        return false;
    }
});

// 4. Deteksi jika halaman di-embed dalam iframe
if (window.self !== window.top) {
    document.body.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <div class="text-center max-w-md">
                <h1 class="text-3xl font-bold text-red-500 mb-4">⚠️ AKSES DITOLAK!</h1>
                <p class="text-slate-300 mb-6">Website ini tidak dapat di-embed dalam iframe.</p>
                <a href="${window.location.href}" class="px-6 py-3 bg-[#00f2ea] text-slate-900 font-bold rounded-full">
                    Buka di Tab Baru
                </a>
            </div>
        </div>
    `;
}

// 5. Proteksi copy-paste
document.addEventListener('copy', function(e) {
    e.preventDefault();
    showWarning('Konten website ini dilindungi. Copy tidak diizinkan.');
    return false;
});

document.addEventListener('cut', function(e) {
    e.preventDefault();
    return false;
});

// 6. Proteksi drag-drop
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
        e.preventDefault();
        return false;
    }
});

// 7. Tambahkan watermark dinamis
function addDynamicWatermarks() {
    const visitorId = 'visitor-' + Math.random().toString(36).substr(2, 8);
    
    // Tambahkan 15 watermark teks di posisi acak
    for(let i = 0; i < 15; i++) {
        const watermark = document.createElement('div');
        watermark.className = 'dynamic-watermark';
        watermark.textContent = `© AndriEl Store | ${visitorId}`;
        watermark.style.top = `${Math.random() * 100}%`;
        watermark.style.left = `${Math.random() * 100}%`;
        watermark.style.opacity = `${0.05 + Math.random() * 0.1}`;
        document.body.appendChild(watermark);
    }
}

// 8. Fungsi untuk menampilkan peringatan
function showWarning(message) {
    // Hapus toast sebelumnya jika ada
    const existingToast = document.querySelector('.warning-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'warning-toast';
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas fa-shield-alt"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Hapus toast setelah 3 detik
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3000);
}

// 9. Deteksi DevTools (basic)
let devToolsOpen = false;
const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if ((widthThreshold || heightThreshold) && !devToolsOpen) {
        devToolsOpen = true;
        showWarning('Developer tools terdeteksi. Konten dilindungi.');
    }
};

// ==================== LOGIC BISNIS ====================

const services = {
    likes: {
        label: "Like TikTok",
        packages: [
            { name: "100 Like", price: 1000 },
            { name: "200 Like", price: 2000 },
            { name: "300 Like", price: 3000 },
            { name: "400 Like", price: 4000 },
            { name: "500 Like", price: 5000 },
            { name: "1000 Like", price: 10000 }
        ]
    },
    views: {
        label: "View TikTok",
        packages: [
            { name: "1.000 View", price: 2000 },
            { name: "1.500 View", price: 2500 },
            { name: "2.000 View", price: 3500 },
            { name: "5.000 View", price: 8000 },
            { name: "10.000 View", price: 15000 }
        ]
    },
    saves: {
        label: "Tiktok Save",
        packages: [
            { name: "500 Save", price: 1000 },
            { name: "1.000 Save", price: 2000 },
            { name: "1.500 Save", price: 3000 },
            { name: "2.000 Save", price: 4000 }
        ]
    },
    shares: {
        label: "Tiktok Share",
        packages: [
            { name: "500 Share", price: 1200 },
            { name: "1.000 Share", price: 2300 },
            { name: "1.500 Share", price: 3500 }
        ]
    },
    am: {
        label: "Alight Motion Premium",
        packages: [
            { name: "1 Tahun Premium", price: 5000 }
        ]
    }
};

// Fungsi untuk memilih service dari card
function selectService(serviceType) {
    document.getElementById('serviceType').value = serviceType;
    updatePackages();
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

function updatePackages() {
    const serviceType = document.getElementById('serviceType').value;
    const packageContainer = document.getElementById('packageContainer');
    const packageSelect = document.getElementById('packageType');
    const btnOrder = document.getElementById('btnOrder');
    const totalContainer = document.getElementById('totalContainer');
    
    // Reset
    packageSelect.innerHTML = '<option value="" disabled selected>-- Pilih Paket --</option>';
    document.getElementById('totalPrice').innerText = 'Rp0';
    totalContainer.classList.add('hidden');
    btnOrder.disabled = true;
    btnOrder.classList.add('opacity-50', 'cursor-not-allowed');
    
    if (serviceType && services[serviceType]) {
        packageContainer.classList.remove('hidden');
        
        services[serviceType].packages.forEach((pkg, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.text = `${pkg.name} - Rp${pkg.price.toLocaleString('id-ID')}`;
            packageSelect.appendChild(option);
        });
    } else {
        packageContainer.classList.add('hidden');
    }
    
    // Cek apakah button order bisa diaktifkan
    toggleOrderButton();
}

function calculateTotal() {
    const serviceType = document.getElementById('serviceType').value;
    const packageIndex = document.getElementById('packageType').value;
    const btnOrder = document.getElementById('btnOrder');
    const totalContainer = document.getElementById('totalContainer');
    const totalPriceEl = document.getElementById('totalPrice');
    
    if (serviceType && packageIndex !== "") {
        const price = services[serviceType].packages[packageIndex].price;
        totalPriceEl.innerText = `Rp${price.toLocaleString('id-ID')}`;
        totalContainer.classList.remove('hidden');
        
        // Cek apakah button order bisa diaktifkan
        toggleOrderButton();
    }
}

function toggleOrderButton() {
    const serviceType = document.getElementById('serviceType').value;
    const packageIndex = document.getElementById('packageType').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const btnOrder = document.getElementById('btnOrder');
    
    if (serviceType && packageIndex !== "" && agreeTerms) {
        btnOrder.disabled = false;
        btnOrder.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        btnOrder.disabled = true;
        btnOrder.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

function sendWhatsApp() {
    const serviceType = document.getElementById('serviceType').value;
    const packageIndex = document.getElementById('packageType').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!serviceType || packageIndex === "" || !agreeTerms) {
        showWarning('Silakan lengkapi semua data dan setujui persyaratan.');
        return;
    }
    
    // Decode nomor WhatsApp dari base64
    const waNumber = atob(encryptedWA);
    
    const serviceName = services[serviceType].label;
    const pkg = services[serviceType].packages[packageIndex];
    
    // Format pesan WhatsApp
    const message = `Halo Kak Andri El!%0A%0ASaya mau order:%0A*Layanan:* ${serviceName}%0A*Paket:* ${pkg.name}%0A*Harga:* Rp${pkg.price.toLocaleString('id-ID')}%0A%0ASaya sudah membaca dan menyetujui peringatan risiko.%0A%0AMohon diproses ya kak!`;
    
    // Buka WhatsApp
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
}

// ==================== INISIALISASI ====================

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Tambahkan watermark
    addDynamicWatermarks();
    
    // Mulai pengecekan DevTools
    setInterval(checkDevTools, 1000);
    
    // Tambahkan event listener untuk terms checkbox
    document.getElementById('agreeTerms').addEventListener('change', toggleOrderButton);
    
    console.log('Website Jasa TikTok dilindungi oleh sistem keamanan.');
});

// Blokir akses console.log jika DevTools terbuka
const originalConsoleLog = console.log;
console.log = function(...args) {
    // Bisa ditambahkan log khusus atau dibiarkan kosong
    originalConsoleLog.apply(console, ['🔒 Website dilindungi:', ...args]);
};

