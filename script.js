// Render'dan aldığın sunucu URL'sini buraya yapıştır
const socket = io("https://yoklama-kw80.onrender.com");

// URL'deki ?room=ders101 kısmını yakalar
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room') || 'genel-oda';

window.onload = function() {
    // Hafızada bu derse özel bir kayıt var mı kontrol et
    // Anahtar örneği: yoklama_kaydi_mat101
    const dersKaydi = JSON.parse(localStorage.getItem('yoklama_' + roomId));
    const simdi = new Date().getTime();
    const birGunMilisaniye = 24 * 60 * 60 * 1000;

    if (dersKaydi && (simdi - dersKaydi.zaman < birGunMilisaniye)) {
        // Eğer bu ders için 24 saat geçmediyse kilitle
        kilitliEkranGoster(dersKaydi.no, roomId);
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

    // Sunucuya gönder
    socket.emit('yoklama-gonder', {
        roomId: roomId,
        ogrenciNo: ogrenciNo
    });

    // DERS BAZLI KİLİT: Sadece bu oda (room) ID'si için kayıt tut
    const kayitVerisi = {
        no: ogrenciNo,
        zaman: new Date().getTime()
    };
    localStorage.setItem('yoklama_' + roomId, JSON.stringify(kayitVerisi));

    status.innerText = "Yoklama iletildi!";
    status.className = "text-green-600";
    
    setTimeout(() => {
        kilitliEkranGoster(ogrenciNo, roomId);
    }, 1500);
}

function kilitliEkranGoster(no, ders) {
    const container = document.querySelector('.bg-white');
    container.innerHTML = `
        <h2 class="text-2xl font-bold text-green-600 mb-4 text-center">İşlem Tamam!</h2>
        <p class="text-center text-gray-700">Bu cihazdan <b>${no}</b> numarası ile <b>${ders}</b> dersi için yoklama alındı.</p>
        <p class="text-center text-sm text-gray-500 mt-4 italic">Bu ders için tekrar yoklama vermek için 24 saat beklemelisiniz. Diğer derslerinizin QR kodlarını okutarak yoklama verebilirsiniz.</p>
    `;
}


// Sunucudan gelen kesin onay mesajı
socket.on('sisteme-islendi-onayi', (res) => {
    const status = document.getElementById('status');
    status.innerText = res.mesaj;
    status.style.color = "#059669"; // Koyu yeşil

    // Kesin onay geldiği için cihazı şimdi kilitleyelim
    const ogrenciNo = document.getElementById('ogrenciNo').value;
    localStorage.setItem('yoklama_' + roomId, JSON.stringify({
        no: ogrenciNo,
        zaman: new Date().getTime()
    }));

    setTimeout(() => {
        kilitliEkranGoster(ogrenciNo, roomId);
    }, 2000);
});


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

