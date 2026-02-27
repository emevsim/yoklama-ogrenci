// Render'dan aldığın sunucu URL'sini buraya yapıştır
const socket = io("https://yoklama-kw80.onrender.com");

// URL'deki ?room=ders101 kısmını yakalar
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room') || 'genel-oda';

window.onload = function() {
    const kayitZamani = localStorage.getItem('yoklama_zamani');
    const simdi = new Date().getTime();
    const birGunMilisaniye = 24 * 60 * 60 * 1000; // 24 saat

    // Eğer son yoklamadan bu yana 24 saat geçmediyse ekranı kilitle
    if (kayitZamani && (simdi - kayitZamani < birGunMilisaniye)) {
        kilitliEkranGoster(localStorage.getItem('kayitli_no'));
    }
};

function yoklamaGonder() {
    const ogrenciNo = document.getElementById('ogrenciNo').value;
    const status = document.getElementById('status');
    const btn = document.getElementById('submitBtn');

    if (!ogrenciNo) {
        alert("Lütfen numaranızı girin!");
        return;
    }

    // Sunucuya veriyi gönder
    socket.emit('yoklama-gonder', {
        roomId: roomId,
        ogrenciNo: ogrenciNo
    });

    // 24 SAATLİK KİLİT: Şu anki zamanı ve numarayı kaydet
    localStorage.setItem('yoklama_zamani', new Date().getTime());
    localStorage.setItem('kayitli_no', ogrenciNo);

    status.innerText = "Yoklama bilgisi iletildi!";
    status.className = "text-green-600";
    
    setTimeout(() => {
        kilitliEkranGoster(ogrenciNo);
    }, 1500);
}

function kilitliEkranGoster(no) {
    const container = document.querySelector('.bg-white');
    container.innerHTML = `
        <h2 class="text-2xl font-bold text-green-600 mb-4 text-center">İşlem Tamam!</h2>
        <p class="text-center text-gray-700">Bu cihazdan <b>${no}</b> numarası için yoklama alındı.</p>
        <p class="text-center text-sm text-gray-500 mt-4 italic">Yeni bir yoklama için 24 saat beklemeniz gerekmektedir.</p>
    `;
}

/*
// Render'dan aldığın sunucu URL'sini buraya yapıştır
const socket = io("https://yoklama-kw80.onrender.com");

// URL'deki ?room=ders101 kısmını yakalar
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room') || 'genel-oda';

function yoklamaGonder() {
    const ogrenciNo = document.getElementById('ogrenciNo').value;
    const status = document.getElementById('status');
    const btn = document.getElementById('submitBtn');

    if (!ogrenciNo) {
        alert("Lütfen öğrenci numaranızı girin!");
        return;
    }

    // Butonu geçici olarak devre dışı bırak
    btn.disabled = true;
    status.innerText = "Gönderiliyor...";
    status.className = "text-blue-600";

    // Sunucuya veriyi gönder
    socket.emit('yoklama-gonder', {
        roomId: roomId,
        ogrenciNo: ogrenciNo
    });

    // Başarılı mesajı
    setTimeout(() => {
        status.innerText = "Yoklama bilgisi iletildi!";
        status.className = "text-green-600";
        btn.disabled = false;
    }, 1000);
}
*/

