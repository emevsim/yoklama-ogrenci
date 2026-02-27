const socket = io("https://yoklama-kw80.onrender.com");

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room') || 'genel-oda';

window.onload = function() {
    const dersKaydi = JSON.parse(localStorage.getItem('yoklama_' + roomId));
    const simdi = new Date().getTime();
    const birGunMilisaniye = 24 * 60 * 60 * 1000;

    if (dersKaydi && (simdi - dersKaydi.zaman < birGunMilisaniye)) {
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

    // Butonu geçici olarak devre dışı bırakalım (tekrar tekrar basılmasın)
    btn.disabled = true;
    btn.innerText = "Gönderiliyor...";

    // Sunucuya gönder
    socket.emit('yoklama-gonder', {
        roomId: roomId,
        ogrenciNo: ogrenciNo
    });

    status.innerText = "Sistem onayı bekleniyor... Lütfen sayfayı kapatmayın.";
    status.className = "text-blue-600";
}

// Sunucudan gelen KESİN ONAY mesajı (Öğretmen butona tıkladığında tetiklenir)
socket.on('sisteme-islendi-onayi', (res) => {
    const status = document.getElementById('status');
    const ogrenciNo = document.getElementById('ogrenciNo').value;

    status.innerText = res.mesaj;
    status.style.color = "#059669"; 

    // KİLİTLEME ŞİMDİ YAPILIYOR: Sadece onay gelirse hafızaya kaydet
    const kayitVerisi = {
        no: ogrenciNo,
        zaman: new Date().getTime()
    };
    localStorage.setItem('yoklama_' + roomId, JSON.stringify(kayitVerisi));

    setTimeout(() => {
        kilitliEkranGoster(ogrenciNo, roomId);
    }, 2000);
});

function kilitliEkranGoster(no, ders) {
    const container = document.querySelector('.bg-white');
    if (container) {
        container.innerHTML = `
            <h2 class="text-2xl font-bold text-green-600 mb-4 text-center">İşlem Tamam!</h2>
            <p class="text-center text-gray-700">Bu cihazdan <b>${no}</b> numarası ile <b>${ders}</b> dersi için yoklama alındı.</p>
            <p class="text-center text-sm text-gray-500 mt-4 italic">Bu ders için tekrar yoklama vermek için 24 saat beklemelisiniz.</p>
        `;
    }
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

