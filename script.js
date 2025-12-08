// ==================== KONFIGURASI PROMO OTOMATIS ====================
const PROMO_CONFIG = {
    isPromoActive: true,              // Set true untuk nyalakan sistem promo
    discountPercent: 10,              // Besar diskon (contoh: 10%)
    promoEndDate: "2025-12-15 23:59", // Format: TAHUN-BULAN-TANGGAL JAM:MENIT
};

// ==================== SISTEM PROTEKSI & UTILITY ====================
const encryptedWA = "MDgyMzUxMTMyMjkz"; // Ganti dengan Base64 nomor WA Anda

// Helper: Cek apakah promo masih berlaku berdasarkan waktu
function getCurrentPromo() {
    if (!PROMO_CONFIG.isPromoActive) return 0;
    
    const now = new Date();
    const endDate = new Date(PROMO_CONFIG.promoEndDate);
    
    // Jika waktu sekarang kurang dari waktu berakhir, kembalikan persen diskon
    if (now < endDate) {
        return PROMO_CONFIG.discountPercent;
    } else {
        return 0; // Promo sudah habis
    }
}

// ==================== DATABASE HARGA LENGKAP ====================
const services = {
    likes: {
        label: "Like TikTok",
        icon: "fa-heart",
        color: "text-red-500",
        packages: [
            // Harga Normal (Belum Diskon)
            { qty: "100", price: 1000 },
            { qty: "200", price: 2000 },
            { qty: "300", price: 3000 },
            { qty: "400", price: 4000 },
            { qty: "500", price: 5000 },
            { qty: "600", price: 6000 },
            { qty: "700", price: 7000 },
            { qty: "800", price: 8000 },
            { qty: "900", price: 9000 },
            { qty: "1.000", price: 10000 },
            { qty: "1.100", price: 11000 },
            { qty: "1.200", price: 12000 },
            { qty: "1.300", price: 13000 },
            { qty: "1.400", price: 14000 },
            { qty: "1.500", price: 15000 },
            { qty: "1.600", price: 16000 },
            { qty: "1.700", price: 17000 },
            { qty: "1.800", price: 18000 },
            { qty: "1.900", price: 19000 },
            { qty: "2.000", price: 20000 }
        ]
    },
    views: {
        label: "View TikTok",
        icon: "fa-eye",
        color: "text-cyan-400",
        packages: [
            { qty: "1.000", price: 2000 },
            { qty: "2.000", price: 4000 },
            { qty: "3.000", price: 6000 },
            { qty: "4.000", price: 8000 },
            { qty: "5.000", price: 10000 },
            { qty: "6.000", price: 12000 },
            { qty: "7.000", price: 14000 },
            { qty: "8.000", price: 16000 },
            { qty: "9.000", price: 18000 },
            { qty: "10.000", price: 20000 }
        ]
    },
    saves: {
        label: "Tiktok Save",
        icon: "fa-bookmark",
        color: "text-yellow-400",
        packages: [
            { qty: "500", price: 1000 },
            { qty: "1.000", price: 2000 },
            { qty: "2.000", price: 4000 },
            { qty: "3.000", price: 6000 },
            { qty: "4.000", price: 8000 },
            { qty: "5.000", price: 10000 },
            { qty: "6.000", price: 12000 },
            { qty: "7.000", price: 14000 },
            { qty: "8.000", price: 16000 },
            { qty: "9.000", price: 18000 },
            { qty: "10.000", price: 20000 }
        ]
    },
    shares: {
        label: "Tiktok Share",
        icon: "fa-share-alt",
        color: "text-green-400",
        packages: [
            { qty: "500", price: 1200 },
            { qty: "1.000", price: 2300 },
            { qty: "2.000", price: 4600 },
            { qty: "5.000", price: 11500 },
            { qty: "8.000", price: 18400 },
            { qty: "9.000", price: 20700 }
        ]
    },
    am: {
        label: "Alight Motion Premium",
        icon: "fa-video",
        color: "text-purple-400",
        packages: [
            { qty: "1 Tahun", price: 5000 },
            { qty: "Reseller (5 Akun)", price: 20000 }
        ]
    }
};

// ==================== RENDER OTOMATIS KE HTML ====================
// Fungsi ini akan mengisi list harga di halaman Home secara otomatis
function renderPricingLists() {
    const discountPercent = getCurrentPromo();
    const isDiscounted = discountPercent > 0;

    // Tampilkan Banner Promo jika aktif
    const promoBanner = document.getElementById('promoBanner');
    if(promoBanner) {
        if(isDiscounted) {
            promoBanner.innerHTML = `PROMO DISKON ${discountPercent}% HINGGA ${new Date(PROMO_CONFIG.promoEndDate).toLocaleDateString('id-ID')}! 🔥`;
            promoBanner.classList.remove('hidden');
        } else {
            promoBanner.classList.add('hidden');
        }
    }

    // Render List Harga
    ['likes', 'views', 'saves', 'shares'].forEach(service => {
        const listContainer = document.getElementById(`list-${service}`);
        if (!listContainer) return;

        let htmlContent = '';
        services[service].packages.forEach(pkg => {
            const originalPrice = pkg.price;
            let displayPrice = '';

            if (isDiscounted) {
                // Tampilan Diskon: Coret harga lama, tampilkan harga baru
                const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
                displayPrice = `
                    <div class="text-right">
                        <span class="block text-[10px] text-slate-500 line-through">Rp${originalPrice.toLocaleString('id-ID')}</span>
                        <span class="font-bold text-[#00f2ea]">Rp${finalPrice.toLocaleString('id-ID')}</span>
                    </div>
                `;
            } else {
                // Tampilan Normal
                displayPrice = `<span class="font-bold text-white">Rp${originalPrice.toLocaleString('id-ID')}</span>`;
            }

            htmlContent += `
                <li class="flex justify-between items-center border-b border-slate-700/50 pb-2">
                    <span>${pkg.qty} ${services[service].label.split(" ")[1]}</span>
                    ${displayPrice}
                </li>
            `;
        });
        listContainer.innerHTML = htmlContent;
    });
}


// ==================== LOGIC ORDER FORM ====================

function selectServiceUI(serviceType, element) {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => card.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('serviceType').value = serviceType;
    updatePackages();
}

function updatePackages() {
    const serviceType = document.getElementById('serviceType').value;
    const packageContainer = document.getElementById('packageContainer');
    const packageSelect = document.getElementById('packageType');
    const discountPercent = getCurrentPromo();
    
    // Reset UI
    packageSelect.innerHTML = '<option value="" disabled selected>-- Pilih Paket --</option>';
    document.getElementById('totalContainer').classList.add('hidden');
    
    if (serviceType && services[serviceType]) {
        packageContainer.classList.remove('hidden');
        
        services[serviceType].packages.forEach((pkg, index) => {
            const originalPrice = pkg.price;
            let optionText = `${pkg.qty} ${services[serviceType].label.split(" ")[1]}`; // Contoh: 100 Like
            
            if (discountPercent > 0) {
                const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
                optionText += ` - Rp${finalPrice.toLocaleString('id-ID')} (Hemat ${discountPercent}%)`;
            } else {
                optionText += ` - Rp${originalPrice.toLocaleString('id-ID')}`;
            }
            
            const option = document.createElement('option');
            option.value = index;
            option.text = optionText;
            packageSelect.appendChild(option);
        });
    }
    toggleOrderButton();
}

function calculateTotal() {
    const serviceType = document.getElementById('serviceType').value;
    const packageIndex = document.getElementById('packageType').value;
    const discountPercent = getCurrentPromo();
    
    if (serviceType && packageIndex !== "") {
        const pkg = services[serviceType].packages[packageIndex];
        const originalPrice = pkg.price;
        const totalContainer = document.getElementById('totalContainer');
        const totalPriceEl = document.getElementById('totalPrice');
        const originalPriceEl = document.getElementById('originalPrice');
        const savingTextEl = document.getElementById('savingText');

        if (discountPercent > 0) {
            const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
            originalPriceEl.innerText = `Rp${originalPrice.toLocaleString('id-ID')}`;
            originalPriceEl.classList.remove('hidden');
            totalPriceEl.innerText = `Rp${finalPrice.toLocaleString('id-ID')}`;
            savingTextEl.innerText = `Hemat ${discountPercent}%!`;
            savingTextEl.classList.remove('hidden');
        } else {
            originalPriceEl.classList.add('hidden');
            savingTextEl.classList.add('hidden');
            totalPriceEl.innerText = `Rp${originalPrice.toLocaleString('id-ID')}`;
        }
        
        totalContainer.classList.remove('hidden');
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
    const discountPercent = getCurrentPromo();
    
    if (!serviceType || packageIndex === "") return;

    const waNumber = atob(encryptedWA);
    const serviceName = services[serviceType].label;
    const pkg = services[serviceType].packages[packageIndex];
    const originalPrice = pkg.price;
    
    let message = `Halo Kak Andri El!%0A%0ASaya mau order:%0A*Layanan:* ${serviceName}%0A*Paket:* ${pkg.qty}%0A`;
    
    if (discountPercent > 0) {
        const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
        message += `*Harga Normal:* ~Rp${originalPrice.toLocaleString('id-ID')}~%0A*Harga Promo:* Rp${finalPrice.toLocaleString('id-ID')}%0A`;
    } else {
        message += `*Harga:* Rp${originalPrice.toLocaleString('id-ID')}%0A`;
    }
    
    message += `%0ASaya setuju dengan syarat dan ketentuan.`;
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
}

// Init
document.addEventListener('DOMContentLoaded', function() {
    renderPricingLists(); // Jalankan render otomatis
    document.getElementById('agreeTerms').addEventListener('change', toggleOrderButton);
    
    // Watermark & Proteksi
    const visitorId = 'visitor-' + Math.random().toString(36).substr(2, 8);
    for(let i = 0; i < 15; i++) {
        const d = document.createElement('div');
        d.className = 'dynamic-watermark';
        d.textContent = `AndriEl | ${visitorId}`;
        d.style.top = Math.random()*100+'%'; d.style.left = Math.random()*100+'%';
        document.body.appendChild(d);
    }
    document.addEventListener('contextmenu', e => e.preventDefault());
});