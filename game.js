/* ============================================
   Zehra'nın Sihirli Bahçesi — game.js
   Sprint 3: Toplama/Çıkarma + bölge zorluk kademesi
   ============================================ */

(function () {
  'use strict';

  /* --------------------------------------------
     Bölge ayarları (ad, tema, zorluk)
     1-10 arası toplama-çıkarma; sonuçlar bölgeye göre kademeli artar
     -------------------------------------------- */

  const BOLGE_TEMA = {
    1: { ad: 'Tomurcuk Vadisi', emoji: '🌱', objeler: ['🌼', '🌸', '🌷'] },
    2: { ad: 'Çiçek Tarlası',   emoji: '🌷', objeler: ['🌷', '🌹', '🌺'] },
    3: { ad: 'Meyve Bahçesi',   emoji: '🍎', objeler: ['🍎', '🍓', '🍇'] },
    4: { ad: 'Kelebek Çayırı',  emoji: '🦋', objeler: ['🦋', '🐞', '🐝'] },
    5: { ad: 'Sihirli Orman',   emoji: '🌳', objeler: ['🍄', '🌳', '⭐'] }
  };

  // 30 bölüm: 5 bölge x 6 bölüm. Sadece toplama ve çıkarma; kademeli zorluk.
  const BOLUMLER = [
    // BÖLGE 1 — Kolay Toplama (sonuçlar 3 → 6)
    { kod: '1.1', bolge: 1, no: 1, ad: 'İlk Toplama',     tip: 'klasik',     islem: '+',       maxSonuc: 3,  problemSayisi: 3, ogretici: 'toplama' },
    { kod: '1.2', bolge: 1, no: 2, ad: 'Biraz Daha',      tip: 'klasik',     islem: '+',       maxSonuc: 4,  problemSayisi: 4 },
    { kod: '1.3', bolge: 1, no: 3, ad: 'Beşe Kadar',      tip: 'klasik',     islem: '+',       maxSonuc: 5,  problemSayisi: 4 },
    { kod: '1.4', bolge: 1, no: 4, ad: 'Sürükle-Topla',   tip: 'surukle',    islem: '+',       maxSonuc: 5,  problemSayisi: 3 },
    { kod: '1.5', bolge: 1, no: 5, ad: 'Eşleştir Ekle',   tip: 'eslestirme', islem: '+',       maxSonuc: 6,  problemSayisi: 3 },
    { kod: '1.6', bolge: 1, no: 6, ad: 'Vadi Bossu ⭐',    tip: 'klasik',     islem: '+',       maxSonuc: 7,  problemSayisi: 5 },

    // BÖLGE 2 — Kolay Çıkarma (sonuçlar 4 → 8)
    { kod: '2.1', bolge: 2, no: 1, ad: 'İlk Çıkarma',     tip: 'klasik',     islem: '-',       maxSonuc: 4,  problemSayisi: 3, ogretici: 'cikarma' },
    { kod: '2.2', bolge: 2, no: 2, ad: 'Az Eksilen',      tip: 'klasik',     islem: '-',       maxSonuc: 5,  problemSayisi: 4 },
    { kod: '2.3', bolge: 2, no: 3, ad: 'Çıkar Say',       tip: 'klasik',     islem: '-',       maxSonuc: 6,  problemSayisi: 4 },
    { kod: '2.4', bolge: 2, no: 4, ad: 'Sürükle Eksilt',  tip: 'surukle',    islem: '-',       maxSonuc: 7,  problemSayisi: 3 },
    { kod: '2.5', bolge: 2, no: 5, ad: 'Eşleştir',        tip: 'eslestirme', islem: '-',       maxSonuc: 8,  problemSayisi: 3 },
    { kod: '2.6', bolge: 2, no: 6, ad: 'Tarla Bossu ⭐',   tip: 'klasik',     islem: '-',       maxSonuc: 9,  problemSayisi: 5 },

    // BÖLGE 3 — Toplama + Çıkarma karışık (orta, 6 → 10)
    { kod: '3.1', bolge: 3, no: 1, ad: 'Karışık Başlar',  tip: 'klasik',     islem: 'karisik', maxSonuc: 6,  problemSayisi: 4, ogretici: 'karisik' },
    { kod: '3.2', bolge: 3, no: 2, ad: 'Balon Patlat',    tip: 'balon',      islem: 'karisik', maxSonuc: 7,  problemSayisi: 4 },
    { kod: '3.3', bolge: 3, no: 3, ad: 'Hızlı Düşün',     tip: 'klasik',     islem: 'karisik', maxSonuc: 8,  problemSayisi: 4 },
    { kod: '3.4', bolge: 3, no: 4, ad: 'Sepete Koy',      tip: 'surukle',    islem: 'karisik', maxSonuc: 9,  problemSayisi: 3 },
    { kod: '3.5', bolge: 3, no: 5, ad: 'Eşleştir Pro',    tip: 'eslestirme', islem: 'karisik', maxSonuc: 10, problemSayisi: 3 },
    { kod: '3.6', bolge: 3, no: 6, ad: 'Bahçe Bossu ⭐',   tip: 'klasik',     islem: 'karisik', maxSonuc: 10, problemSayisi: 5 },

    // BÖLGE 4 — Zor 1-10 karışık
    { kod: '4.1', bolge: 4, no: 1, ad: 'On Sayıları',     tip: 'klasik',     islem: 'karisik', maxSonuc: 10, problemSayisi: 4 },
    { kod: '4.2', bolge: 4, no: 2, ad: 'Balon Yarışı',    tip: 'balon',      islem: 'karisik', maxSonuc: 10, problemSayisi: 4 },
    { kod: '4.3', bolge: 4, no: 3, ad: 'Eşleştir Hızlı',  tip: 'eslestirme', islem: 'karisik', maxSonuc: 10, problemSayisi: 3 },
    { kod: '4.4', bolge: 4, no: 4, ad: 'Hızlı Sepet',     tip: 'surukle',    islem: 'karisik', maxSonuc: 10, problemSayisi: 4 },
    { kod: '4.5', bolge: 4, no: 5, ad: 'Karışık Hız',     tip: 'klasik',     islem: 'karisik', maxSonuc: 10, problemSayisi: 5 },
    { kod: '4.6', bolge: 4, no: 6, ad: 'Çayır Bossu ⭐',   tip: 'klasik',     islem: 'karisik', maxSonuc: 10, problemSayisi: 5 },

    // BÖLGE 5 — Master 1-15 karışık (en zor)
    { kod: '5.1', bolge: 5, no: 1, ad: 'Onun Üstü',       tip: 'klasik',     islem: 'karisik', maxSonuc: 12, problemSayisi: 4 },
    { kod: '5.2', bolge: 5, no: 2, ad: 'Süper Balon',     tip: 'balon',      islem: 'karisik', maxSonuc: 13, problemSayisi: 4 },
    { kod: '5.3', bolge: 5, no: 3, ad: 'Sürükle Master', tip: 'surukle',    islem: 'karisik', maxSonuc: 13, problemSayisi: 4 },
    { kod: '5.4', bolge: 5, no: 4, ad: 'Eşleştir Master', tip: 'eslestirme', islem: 'karisik', maxSonuc: 14, problemSayisi: 3 },
    { kod: '5.5', bolge: 5, no: 5, ad: 'On Beşe Çık',     tip: 'klasik',     islem: 'karisik', maxSonuc: 15, problemSayisi: 5 },
    { kod: '5.6', bolge: 5, no: 6, ad: 'Sihirli Boss ⭐⭐', tip: 'klasik',     islem: 'karisik', maxSonuc: 15, problemSayisi: 6 }
  ];

  // Geriye uyumluluk için BOLGELER (skor/istatistik kayıtları bunu kullanır)
  const BOLGELER = [1, 2, 3, 4, 5].map((id) => ({
    id, ...BOLGE_TEMA[id], tip: 'mixed', maxSonuc: 10, problemSayisi: 5
  }));

  const OBJE_ADLARI = {
    '🌼': 'papatya', '🌸': 'çiçek', '🌷': 'lale', '🌹': 'gül', '🌺': 'çiçek',
    '🍎': 'elma',    '🍓': 'çilek',  '🍇': 'üzüm',
    '🦋': 'kelebek', '🐞': 'uğur böceği', '🐝': 'arı',
    '🌳': 'ağaç',    '🍄': 'mantar', '🪻': 'sümbül'
  };

  /* --------------------------------------------
     localStorage
     -------------------------------------------- */

  const KAYIT_ANAHTAR = 'zehra_bahce_v1';

  const VARSAYILAN_DURUM = {
    surum: 2,
    olusturuldu: null,
    sonGuncelleme: null,
    kullanici: { ad: 'Zehra', avatar: '🌸' },
    kaynaklar: { tohum: 0, su: 0, gunes: 0 },
    ilerleme: {
      karsilamaGosterildi: false,
      tamamlananProblem: 0,
      dogruCevap: 0,
      bolgeler: { 1: { acik: true, yildiz: 0, tamamlandi: false } },
      bolumler: { '1.1': { acik: true, yildiz: 0, tamamlandi: false } },
      ogreticiGorulen: {}
    },
    bahce: {
      alanlar: [
        { id: 0, slot: 6, acik: true },
        { id: 1, slot: 6, acik: false, kilit: { tip: 'bolge', deger: 3 } }
      ],
      bitkiler: []
    },
    dolap: { sapka: null, gozluk: null, taki: null },
    hayvanlar: { aktif: 'pitircik', isimler: {} },
    istatistik: { toplam: 0, dogru: 0, yanlis: 0, ortalamaSure: 0, sonProblemler: [], gunluk: {}, bolge: {} },
    ayarlar: { ses: true, muzik: false, zorlukModu: 'otomatik' }
  };

  function durumYukle() {
    try {
      const ham = localStorage.getItem(KAYIT_ANAHTAR);
      if (!ham) return klonla(VARSAYILAN_DURUM);
      return birlestir(klonla(VARSAYILAN_DURUM), JSON.parse(ham));
    } catch (e) {
      console.warn('[Sihirli Bahçe] Kayıt okunamadı:', e);
      return klonla(VARSAYILAN_DURUM);
    }
  }

  function durumKaydet(d) {
    try {
      d.sonGuncelleme = new Date().toISOString();
      if (!d.olusturuldu) d.olusturuldu = d.sonGuncelleme;
      localStorage.setItem(KAYIT_ANAHTAR, JSON.stringify(d));
    } catch (e) {
      console.warn('[Sihirli Bahçe] Kayıt yazılamadı:', e);
    }
  }

  function durumSifirla() {
    try { localStorage.removeItem(KAYIT_ANAHTAR); } catch (_) {}
    return klonla(VARSAYILAN_DURUM);
  }

  function klonla(o) { return JSON.parse(JSON.stringify(o)); }

  function birlestir(hedef, kaynak) {
    if (!kaynak || typeof kaynak !== 'object') return hedef;
    for (const k of Object.keys(kaynak)) {
      const v = kaynak[k];
      if (v && typeof v === 'object' && !Array.isArray(v) &&
          hedef[k] && typeof hedef[k] === 'object' && !Array.isArray(hedef[k])) {
        hedef[k] = birlestir(hedef[k], v);
      } else {
        hedef[k] = v;
      }
    }
    return hedef;
  }

  /* --------------------------------------------
     Ses (Web Audio API ile basit beep)
     -------------------------------------------- */

  let _ctx = null;
  function sesContext() {
    if (!_ctx) {
      try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (_) { return null; }
    }
    return _ctx;
  }

  function ses(frekans, sure, tip) {
    const ctx = sesContext();
    if (!ctx || !OYUN.durum.ayarlar.ses) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tip || 'sine';
    osc.frequency.value = frekans;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + sure);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + sure + 0.05);
  }

  function sesTik()    { ses(660, 0.08, 'triangle'); }
  function sesDogru()  {
    // Yukarı doğru üçlü akor — neşeli
    ses(660, 0.12, 'triangle');
    setTimeout(() => ses(880, 0.16, 'triangle'), 100);
    setTimeout(() => ses(1175, 0.22, 'triangle'), 220);
  }
  function sesYanlis() {
    // Aşağı kayan ikili — yumuşak hata
    ses(330, 0.14, 'sine');
    setTimeout(() => ses(247, 0.18, 'sine'), 130);
  }
  function sesYildiz() { ses(1320, 0.1, 'sine'); setTimeout(() => ses(1760, 0.18, 'sine'), 80); }
  function sesPop()    {
    // Balon patlama — kısa bir çok-frekanslı çıngırak
    ses(1500, 0.04, 'square');
    setTimeout(() => ses(900, 0.08, 'square'), 30);
    setTimeout(() => ses(1300, 0.12, 'sine'), 70);
  }
  function sesSayfaAcma() { ses(880, 0.1, 'sine'); setTimeout(() => ses(1100, 0.12, 'sine'), 70); }

  /* --------------------------------------------
     Ekran yöneticisi
     -------------------------------------------- */

  function showScreen(hedefId) {
    let bulundu = false;
    document.querySelectorAll('.screen').forEach((e) => {
      if (e.id === hedefId) { e.classList.add('aktif'); bulundu = true; }
      else { e.classList.remove('aktif'); }
    });
    if (!bulundu) { console.warn('[Sihirli Bahçe] Ekran bulunamadı:', hedefId); return false; }
    if (hedefId === 'screen-harita')   haritaCiz();
    if (hedefId === 'screen-bahce')    bahceCiz();
    if (hedefId === 'screen-dolap')    dolapCiz();
    if (hedefId === 'screen-hayvanlar') hayvanlarCiz();
    if (hedefId === 'screen-ebeveyn')  ebeveynCiz();
    return true;
  }

  function arayuzGuncelle() {
    const k = OYUN.durum.kaynaklar;
    const t = document.getElementById('kaynak-tohum');
    const s = document.getElementById('kaynak-su');
    const g = document.getElementById('kaynak-gunes');
    if (t) t.textContent = k.tohum;
    if (s) s.textContent = k.su;
    if (g) g.textContent = k.gunes;
  }

  /* --------------------------------------------
     Harita
     -------------------------------------------- */

  function haritaCiz() {
    const liste = document.getElementById('bolge-listesi');
    if (!liste) return;
    liste.innerHTML = '';

    // Migration: eski şemada bolumler yoksa, açık bölgelere göre uygun bölümleri aç
    if (!OYUN.durum.ilerleme.bolumler) OYUN.durum.ilerleme.bolumler = {};
    if (!OYUN.durum.ilerleme.bolumler['1.1']) {
      OYUN.durum.ilerleme.bolumler['1.1'] = { acik: true, yildiz: 0, tamamlandi: false };
    }
    // Eski bölge tamamlandıysa o bölgenin bölümleri açılsın
    BOLUMLER.forEach((b) => {
      const ipBolge = OYUN.durum.ilerleme.bolgeler[b.bolge];
      if (ipBolge && ipBolge.acik) {
        if (b.no === 1 && !OYUN.durum.ilerleme.bolumler[b.kod]) {
          OYUN.durum.ilerleme.bolumler[b.kod] = { acik: true, yildiz: 0, tamamlandi: false };
        }
      }
    });

    let mevcutBolge = -1;
    BOLUMLER.forEach((b) => {
      if (b.bolge !== mevcutBolge) {
        mevcutBolge = b.bolge;
        const tema = BOLGE_TEMA[b.bolge];
        const baslik = document.createElement('div');
        baslik.className = 'bolge-grup-baslik';
        const tamamlananSay = BOLUMLER.filter((x) => x.bolge === b.bolge).filter(
          (x) => OYUN.durum.ilerleme.bolumler[x.kod] && OYUN.durum.ilerleme.bolumler[x.kod].tamamlandi
        ).length;
        const toplamBolum = BOLUMLER.filter((x) => x.bolge === b.bolge).length;
        baslik.innerHTML = `
          <span class="bgb-emoji">${tema.emoji}</span>
          <span class="bgb-ad">Bölge ${b.bolge} — ${tema.ad}</span>
          <span class="bgb-ilerleme">${tamamlananSay}/${toplamBolum}</span>
        `;
        liste.appendChild(baslik);
      }

      const ip = OYUN.durum.ilerleme.bolumler[b.kod];
      const acik = ip && ip.acik;
      const bitti = ip && ip.tamamlandi;
      const yildiz = ip ? ip.yildiz : 0;

      const kart = document.createElement('button');
      kart.className = 'harita-bolum ' +
        (acik ? (bitti ? 'bitti' : 'acik') : 'kilitli') +
        ` bolge-${b.bolge}`;
      // Bölge başına son bölüm (boss): bölgenin son no'su
      const bolgeSonNo = BOLUMLER.filter((x) => x.bolge === b.bolge).length;
      if (b.no === bolgeSonNo) kart.classList.add('boss');
      kart.disabled = !acik;

      const yildizSimge = bitti
        ? '⭐'.repeat(yildiz) + '☆'.repeat(Math.max(0, 3 - yildiz))
        : (acik ? '▶' : '🔒');

      const islemSimge = ({ '+': '➕', '-': '➖', '×': '✖️', '÷': '➗', 'karisik': '🔄', 'cdkarisik': '🎲' })[b.islem] || '✨';

      kart.innerHTML = `
        <span class="hb-no">${b.kod}</span>
        <span class="hb-islem">${islemSimge}</span>
        <span class="hb-ad">${b.ad}</span>
        <span class="hb-yildiz">${yildizSimge}</span>
      `;
      if (acik) {
        kart.addEventListener('click', () => { sesTik(); oyunBaslat(b.kod); });
      }
      liste.appendChild(kart);
    });
  }

  /* --------------------------------------------
     Problem üretimi (toplama / çıkarma karışık)
     -------------------------------------------- */

  function rastgele(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function problemUret(bolge) {
    const obje = bolge.objeler[rastgele(0, bolge.objeler.length - 1)];
    const islemAyari = bolge.islem || 'karisik';
    const islem = islemSec(islemAyari);
    let a, b, sonuc;

    if (islem === '+') {
      sonuc = rastgele(2, Math.max(2, bolge.maxSonuc));
      a = rastgele(1, sonuc - 1);
      b = sonuc - a;
    } else if (islem === '-') {
      a = rastgele(2, Math.max(2, bolge.maxSonuc));
      b = rastgele(1, a - 1);
      sonuc = a - b;
    } else if (islem === '×') {
      // Basit çarpım: a, b ∈ [1, 4], sonuc <= maxSonuc
      const ayarSonuc = Math.max(4, bolge.maxSonuc);
      let denemeler = 0;
      do {
        a = rastgele(2, 4);
        b = rastgele(2, 4);
        sonuc = a * b;
      } while (sonuc > ayarSonuc && denemeler++ < 20);
      if (sonuc > ayarSonuc) { a = 2; b = 2; sonuc = 4; }
    } else if (islem === '÷') {
      // Bölme: önce sonucu seç, b değeri (bölen) seç, sonra a'yı hesapla
      sonuc = rastgele(1, Math.max(2, Math.min(5, bolge.maxSonuc)));
      b = rastgele(2, 3);
      a = sonuc * b;
    }
    return { a, b, islem, sonuc, obje };
  }

  function islemSec(ayar) {
    if (ayar === '+' || ayar === '-' || ayar === '×' || ayar === '÷') return ayar;
    if (ayar === 'karisik')   return Math.random() < 0.5 ? '+' : '-';
    if (ayar === 'cdkarisik') return Math.random() < 0.5 ? '×' : '÷';
    return Math.random() < 0.5 ? '+' : '-';
  }

  function problemleriUret(bolge) {
    const tabanMax = akilliZorluk(bolge);
    const N = bolge.problemSayisi;
    const liste = [];
    const kullanilanSonuclar = new Set();
    let sonIslem = null;

    // Kademeli zorluk: ilk problem en kolay, son problem hedef zorlukta.
    // Çarpma ve bölme için zorluk skalası daha düşük tutulur.
    const kademeOranlari = N <= 1 ? [1] : Array.from({ length: N }, (_, i) => {
      // 0.55 → 1.0 arası lineer kademe
      return 0.55 + (i / (N - 1)) * 0.45;
    });

    for (let i = 0; i < N; i++) {
      const oran = kademeOranlari[i];
      const minMax = (bolge.islem === '×' || bolge.islem === '÷' || bolge.islem === 'cdkarisik') ? 4 : 2;
      const dinamikMax = Math.max(minMax, Math.round(tabanMax * oran));
      const dinamik = { ...bolge, maxSonuc: dinamikMax };

      let p, deneme = 0;
      do {
        p = problemUret(dinamik);
        deneme++;
      } while (kullanilanSonuclar.has(p.sonuc) && deneme < 20 && N <= 5);

      // Toplama/çıkarma karışık ayarında üst üste aynı işlem 3 kez gelmesin
      if (bolge.islem === 'karisik' && i >= 2 && p.islem === sonIslem && liste[i - 1].islem === sonIslem) {
        p = problemUretSabit(dinamik, sonIslem === '+' ? '-' : '+');
      }

      sonIslem = p.islem;
      kullanilanSonuclar.add(p.sonuc);
      liste.push(p);
    }
    return liste;
  }

  function problemUretSabit(bolge, islem) {
    return problemUret({ ...bolge, islem });
  }

  /* --------------------------------------------
     Talimat metni (rastgele)
     -------------------------------------------- */

  function talimatMetni(p) {
    const ad = OBJE_ADLARI[p.obje] || 'şey';
    if (p.islem === '+') {
      return rastgeleSec([
        `Bahçede ${p.a} ${ad} vardı. ${p.b} tane daha geldi. Şimdi kaç tane?`,
        `${p.a} ${ad} ve ${p.b} ${ad} — hepsi kaç eder?`,
        `${p.a} ${ad} ile ${p.b} ${ad}: toplam kaç?`
      ]);
    }
    if (p.islem === '-') {
      return rastgeleSec([
        `${p.a} ${ad} vardı. ${p.b} tanesi gitti. Kaç tane kaldı?`,
        `${p.a} ${ad} vardı, ${p.b} tanesi yok oldu. Kalanı say!`,
        `${p.a} ${ad}, ${p.b} tanesi uçtu. Geriye kaç tane kaldı?`
      ]);
    }
    if (p.islem === '×') {
      return rastgeleSec([
        `${p.a} grup, her grupta ${p.b} ${ad}. Toplam kaç tane?`,
        `${p.a} kere ${p.b} ${ad} — hepsi kaç eder?`,
        `${p.a} × ${p.b} = ?`
      ]);
    }
    if (p.islem === '÷') {
      return rastgeleSec([
        `${p.a} ${ad}'ı ${p.b} eşit gruba böl. Her grupta kaç olur?`,
        `${p.a} ${ad}, ${p.b} arkadaşa eşit dağıt. Herkese kaç düşer?`,
        `${p.a} ÷ ${p.b} = ?`
      ]);
    }
    return `${p.a} ${p.islem} ${p.b} = ?`;
  }

  function rastgeleSec(liste) { return liste[rastgele(0, liste.length - 1)]; }

  /* --------------------------------------------
     Pıtırcık tepkileri
     -------------------------------------------- */

  const TEPKI_DOGRU = ['Aferin!', 'Süper!', 'Harika!', 'Bravo!', 'Çok iyi!', 'Müthiş!'];
  const TEPKI_YANLIS = ['Tekrar dene!', 'Yine bir bak!', 'Sayıp tekrar dene!', 'Aman canım, tekrar!'];
  function rastgeleTepki(liste) { return liste[rastgele(0, liste.length - 1)]; }

  /* --------------------------------------------
     Mini Oyun
     -------------------------------------------- */

  const oyunDurum = {
    bolge: null,
    problemler: [],
    problemIndex: 0,
    aktif: null,
    tiklandi: 0,
    cevapAcik: false,
    yildizlar: []
  };

  function oyunBaslat(bolumKodu) {
    // Geriye uyumluluk: eskiden bolgeId int alırdı, şimdi kod (string) ya da int
    if (typeof bolumKodu === 'number') {
      bolumKodu = bolumKodu + '.1';
    }
    const bolum = BOLUMLER.find((b) => b.kod === bolumKodu);
    if (!bolum) return;
    const bolge = { id: bolum.bolge, ...BOLGE_TEMA[bolum.bolge] };

    // Bölümü, "geçici bölge" gibi davransın diye genişlet
    const aktifBolum = {
      ...bolge,
      ...bolum,
      objeler: BOLGE_TEMA[bolum.bolge].objeler
    };
    oyunDurum.bolge = aktifBolum;
    oyunDurum.bolumKodu = bolumKodu;
    oyunDurum.problemler = problemleriUret(aktifBolum);
    oyunDurum.problemIndex = 0;
    oyunDurum.yildizlar = new Array(aktifBolum.problemSayisi).fill(false);
    istatistikBolgeBaslat(aktifBolum);

    document.getElementById('oyun-baslik').textContent =
      `${bolge.emoji} Bölüm ${bolum.kod} — ${bolum.ad}`;

    yildizPaneliKur(aktifBolum.problemSayisi);
    oyunTipiniGoster(aktifBolum.tip);
    showScreen('screen-oyun');

    const bolumOyunBaslat = () => {
      if (aktifBolum.tip === 'balon')           balonBolumBaslat();
      else if (aktifBolum.tip === 'eslestirme') eslestirmeBolumBaslat();
      else if (aktifBolum.tip === 'surukle')    surukleBolumBaslat();
      else if (aktifBolum.tip === 'karisik')    karisikBolumBaslat();
      else                                      problemBaslat();
    };

    // Öğretici akış — bu konsept ilk kez görülüyorsa Pıtırcık öğretmen modu
    if (bolum.ogretici && !OYUN.durum.ilerleme.ogreticiGorulen[bolum.ogretici]) {
      ogreticiGoster(bolum.ogretici, () => {
        OYUN.durum.ilerleme.ogreticiGorulen[bolum.ogretici] = true;
        durumKaydet(OYUN.durum);
        bolumOyunBaslat();
      });
    } else {
      bolumOyunBaslat();
    }
  }

  function oyunTipiniGoster(tip) {
    const tipler = ['klasik', 'balon', 'eslestirme', 'surukle'];
    // 'karisik' tipi her problemde alt-tipi belirler; o yüzden kendi içinde gösterir
    let goster = tip;
    if (tip === 'karisik') goster = 'klasik'; // varsayılan, karışık alt-tip değiştirebilir
    tipler.forEach((t) => {
      const el = document.getElementById('oyun-' + t);
      if (el) el.hidden = (t !== goster);
    });
  }

  function yildizPaneliKur(adet) {
    const panel = document.getElementById('yildiz-paneli');
    if (!panel) return;
    panel.innerHTML = '';
    for (let i = 0; i < adet; i++) {
      const el = document.createElement('span');
      el.className = 'yildiz-slot';
      el.dataset.i = String(i);
      el.textContent = '⭐';
      panel.appendChild(el);
    }
  }

  function yildizPaneliGuncelle() {
    document.querySelectorAll('#yildiz-paneli .yildiz-slot').forEach((slot, i) => {
      slot.classList.toggle('kazanildi', oyunDurum.yildizlar[i] === true);
    });
  }

  function problemBaslat() {
    oyunDurum.aktif = oyunDurum.problemler[oyunDurum.problemIndex];
    oyunDurum.aktif._ilkDeneme = oyunDurum.aktif._ilkDeneme !== false;
    oyunDurum.tiklandi = 0;
    oyunDurum.cevapAcik = false;

    const rozet = document.getElementById('ilerleme-rozet');
    if (rozet) rozet.textContent = `${oyunDurum.problemIndex + 1}/${oyunDurum.problemler.length}`;

    document.getElementById('oyun-talimat').innerHTML = `<p>${talimatMetni(oyunDurum.aktif)}</p>`;

    const p = oyunDurum.aktif;
    const sembol = { '+': '+', '-': '−', '×': '×', '÷': '÷' }[p.islem] || p.islem;
    document.getElementById('islem-yazi').textContent = `${p.a} ${sembol} ${p.b} = ?`;

    sahneCiz(p);
    cevapPaneliniGoster();
  }

  function sahneCiz(p) {
    const alan = document.getElementById('sayma-alani');
    if (!alan) return;
    alan.innerHTML = '';
    alan.classList.toggle('toplama', p.islem === '+');
    alan.classList.toggle('cikarma', p.islem === '-');
    alan.classList.toggle('carpma',  p.islem === '×');
    alan.classList.toggle('bolme',   p.islem === '÷');

    if (p.islem === '+') {
      const grupA = grupOlustur(p.obje, p.a);
      const isaret = document.createElement('div');
      isaret.className = 'islem-isaret-buyuk';
      isaret.textContent = '+';
      const grupB = grupOlustur(p.obje, p.b);
      alan.appendChild(grupA);
      alan.appendChild(isaret);
      alan.appendChild(grupB);
    } else if (p.islem === '-') {
      const grup = document.createElement('div');
      grup.className = 'islem-grup tekli';
      for (let i = 0; i < p.a; i++) {
        grup.appendChild(objeOlustur(p.obje, i < p.b));
      }
      alan.appendChild(grup);
    } else if (p.islem === '×') {
      // a grup, her grupta b obje
      for (let g = 0; g < p.a; g++) {
        const grup = grupOlustur(p.obje, p.b);
        alan.appendChild(grup);
        if (g < p.a - 1) {
          const isaret = document.createElement('div');
          isaret.className = 'islem-isaret-buyuk';
          isaret.textContent = '×';
          alan.appendChild(isaret);
        }
      }
    } else if (p.islem === '÷') {
      // p.a obje, p.b eşit gruba bölünmüş — her grupta sonuc obje
      const wrapper = document.createElement('div');
      wrapper.className = 'bolme-wrap';
      for (let g = 0; g < p.b; g++) {
        const grup = grupOlustur(p.obje, p.sonuc);
        grup.classList.add('bolme-grup');
        wrapper.appendChild(grup);
      }
      alan.appendChild(wrapper);
    }
  }

  function grupOlustur(emoji, adet) {
    const grup = document.createElement('div');
    grup.className = 'islem-grup';
    for (let i = 0; i < adet; i++) {
      grup.appendChild(objeOlustur(emoji, false));
    }
    return grup;
  }

  function objeOlustur(emoji, cikmis) {
    const obje = document.createElement('button');
    obje.type = 'button';
    obje.className = 'sayma-obje' + (cikmis ? ' cikan' : '');
    obje.textContent = emoji;
    if (!cikmis) {
      obje.addEventListener('click', () => objeTikla(obje));
    }
    return obje;
  }

  function objeTikla(obje) {
    if (obje.classList.contains('tiklandi') || obje.classList.contains('cikan')) return;
    obje.classList.add('tiklandi');
    oyunDurum.tiklandi++;
    sesTik();
    const num = document.createElement('span');
    num.className = 'sayma-numara';
    num.textContent = String(oyunDurum.tiklandi);
    obje.appendChild(num);
  }

  function cevapPaneliniGoster() {
    oyunDurum.cevapAcik = true;
    const dogru = oyunDurum.aktif.sonuc;
    const secenekler = secenekUret(dogru);

    const panel = document.getElementById('cevap-secenekleri');
    if (!panel) return;
    panel.innerHTML = '';
    secenekler.forEach((deger) => {
      const btn = document.createElement('button');
      btn.className = 'cevap-buton';
      btn.type = 'button';
      btn.textContent = String(deger);
      btn.addEventListener('click', () => cevapVer(deger, btn));
      panel.appendChild(btn);
    });

    document.getElementById('cevap-paneli').hidden = false;
  }

  function secenekUret(dogru) {
    const set = new Set([dogru]);
    let guvenlik = 0;
    while (set.size < 3 && guvenlik++ < 50) {
      const offset = (Math.random() < 0.5 ? -1 : 1) * rastgele(1, 2);
      const aday = dogru + offset;
      if (aday >= 1 && aday <= 10) set.add(aday);
    }
    while (set.size < 3) set.add(rastgele(1, 10));
    return [...set].sort(() => Math.random() - 0.5);
  }

  function cevapVer(deger, btn) {
    if (!oyunDurum.cevapAcik) return;
    oyunDurum.cevapAcik = false;

    const dogru = deger === oyunDurum.aktif.sonuc;
    if (dogru) {
      btn.classList.add('dogru');
      sesDogru();
      if (oyunDurum.aktif._ilkDeneme) {
        oyunDurum.yildizlar[oyunDurum.problemIndex] = true;
        setTimeout(yildizPaneliGuncelle, 200);
        setTimeout(sesYildiz, 350);
      }
      istatistikKaydet(oyunDurum.aktif, true);
      const r = btn.getBoundingClientRect();
      const oy = document.getElementById('screen-oyun').getBoundingClientRect();
      konfetiYagdir(r.left - oy.left + r.width / 2, r.top - oy.top + r.height / 2, document.getElementById('screen-oyun'));
      geriBildirim('🎉', rastgeleTepki(TEPKI_DOGRU));
      setTimeout(() => { gizleGeriBildirim(); sonrakiProblem(); }, 1500);
    } else {
      btn.classList.add('yanlis');
      sesYanlis();
      oyunDurum.aktif._ilkDeneme = false;
      istatistikKaydet(oyunDurum.aktif, false);
      geriBildirim('🤔', rastgeleTepki(TEPKI_YANLIS));
      setTimeout(() => {
        gizleGeriBildirim();
        // Pedagojik anlatım — sonra cevap panelini yeniden aç
        pedagojiAnlat(oyunDurum.aktif, () => {
          oyunDurum.cevapAcik = true;
          btn.classList.remove('yanlis');
          btn.disabled = true;
        });
      }, 1100);
    }
  }

  function geriBildirim(emoji, yazi) {
    const kat = document.getElementById('geri-bildirim');
    if (!kat) return;
    document.getElementById('gb-emoji').textContent = emoji;
    document.getElementById('gb-yazi').textContent = yazi;
    kat.hidden = false;
  }

  function gizleGeriBildirim() {
    const kat = document.getElementById('geri-bildirim');
    if (kat) kat.hidden = true;
  }

  function sonrakiProblem() {
    oyunDurum.problemIndex++;
    if (oyunDurum.problemIndex >= oyunDurum.problemler.length) bolumBitir();
    else if (oyunDurum.bolge && oyunDurum.bolge.tip === 'karisik') karisikSonrakiProblem();
    else problemBaslat();
  }

  /* --------------------------------------------
     Balon Patlatma (Bölge 3)
     -------------------------------------------- */

  const BALON_RENKLERI = ['balon-pembe', 'balon-mor', 'balon-sari', 'balon-yesil', 'balon-mavi'];

  function balonBolumBaslat() {
    oyunDurum.problemIndex = 0;
    balonProblemBaslat();
  }

  function balonProblemBaslat() {
    const p = oyunDurum.problemler[oyunDurum.problemIndex];
    p._ilkDeneme = p._ilkDeneme !== false;
    oyunDurum.aktif = p;

    document.getElementById('ilerleme-rozet').textContent =
      `${oyunDurum.problemIndex + 1}/${oyunDurum.problemler.length}`;
    const sembol = { '+': '+', '-': '−', '×': '×', '÷': '÷' }[p.islem] || p.islem;
    document.getElementById('balon-islem').textContent = `${p.a} ${sembol} ${p.b} = ?`;
    document.getElementById('oyun-talimat').innerHTML =
      `<p>Doğru cevabın yazdığı balonu patlat! 🎈</p>`;

    balonRender(p);
  }

  function balonRender(p) {
    const alan = document.getElementById('balon-alani');
    if (!alan) return;
    alan.innerHTML = '';

    const secenekler = secenekUret(p.sonuc);
    const renkler = BALON_RENKLERI.slice().sort(() => Math.random() - 0.5);

    secenekler.forEach((deger, i) => {
      const balon = document.createElement('button');
      balon.type = 'button';
      balon.className = 'balon ' + renkler[i % renkler.length];

      const sek = document.createElement('div');
      sek.className = 'balon-sekli';
      sek.textContent = String(deger);
      const ip = document.createElement('div');
      ip.className = 'balon-ip';

      balon.appendChild(sek);
      balon.appendChild(ip);
      balon.style.setProperty('--balon-y-offset', rastgele(0, 60) + 'px');
      balon.style.animationDelay = (i * 0.25) + 's';

      balon.addEventListener('click', () => balonTıkla(balon, deger));
      alan.appendChild(balon);
    });
  }

  function balonTıkla(balon, deger) {
    if (balon.classList.contains('patladi')) return;
    const p = oyunDurum.aktif;
    const dogru = deger === p.sonuc;

    if (dogru) {
      sesPop();
      setTimeout(sesDogru, 80);
      balon.classList.add('patladi');
      const rect = balon.getBoundingClientRect();
      const alanRect = document.getElementById('balon-alani').getBoundingClientRect();
      konfetiYagdir(rect.left - alanRect.left + rect.width / 2, rect.top - alanRect.top + rect.height / 2, document.getElementById('balon-alani'));
      if (p._ilkDeneme) {
        oyunDurum.yildizlar[oyunDurum.problemIndex] = true;
        setTimeout(yildizPaneliGuncelle, 200);
        setTimeout(sesYildiz, 350);
      }
      istatistikKaydet(p, true);
      geriBildirim('🎉', rastgeleTepki(TEPKI_DOGRU));
      setTimeout(() => {
        gizleGeriBildirim();
        balonSonrakiProblem();
      }, 1400);
    } else {
      sesYanlis();
      balon.classList.add('yanlis');
      p._ilkDeneme = false;
      istatistikKaydet(p, false);
      setTimeout(() => balon.classList.remove('yanlis'), 600);
      geriBildirim('🤔', rastgeleTepki(TEPKI_YANLIS));
      setTimeout(gizleGeriBildirim, 1100);
    }
  }

  function balonSonrakiProblem() {
    oyunDurum.problemIndex++;
    if (oyunDurum.problemIndex >= oyunDurum.problemler.length) bolumBitir();
    else if (oyunDurum.bolge && oyunDurum.bolge.tip === 'karisik') karisikSonrakiProblem();
    else balonProblemBaslat();
  }

  /* --------------------------------------------
     Eşleştirme (Bölge 4)
     -------------------------------------------- */

  const eslestirmeDurum = { secili: null, esler: 0, beklenen: 0 };

  function eslestirmeBolumBaslat() {
    document.getElementById('ilerleme-rozet').textContent = `0/${oyunDurum.problemler.length}`;
    document.getElementById('oyun-talimat').innerHTML =
      `<p>Üstteki işlemi, alttaki sonucuyla birleştir!</p>`;

    eslestirmeDurum.secili = null;
    eslestirmeDurum.esler = 0;
    eslestirmeDurum.beklenen = oyunDurum.problemler.length;

    eslestirmeRender();
  }

  function eslestirmeRender() {
    const ust = document.getElementById('eslestirme-ust');
    const alt = document.getElementById('eslestirme-alt');
    const cizgi = document.getElementById('eslestirme-cizgi');
    if (!ust || !alt) return;
    ust.innerHTML = '';
    alt.innerHTML = '';
    if (cizgi) cizgi.innerHTML = '';

    const sonuclar = oyunDurum.problemler.map((p) => p.sonuc).slice().sort(() => Math.random() - 0.5);
    const ustSira = oyunDurum.problemler.slice().sort(() => Math.random() - 0.5);

    ustSira.forEach((p) => {
      const k = document.createElement('button');
      k.type = 'button';
      k.className = 'eslestirme-kart islem-kart';
      k.dataset.cevap = String(p.sonuc);
      k.dataset.id = `i-${p.a}-${p.islem}-${p.b}`;
      k.textContent = `${p.a} ${p.islem === '+' ? '+' : '−'} ${p.b}`;
      k.addEventListener('click', () => eslestirmeKartTikla(k, 'islem'));
      ust.appendChild(k);
    });

    sonuclar.forEach((s) => {
      const k = document.createElement('button');
      k.type = 'button';
      k.className = 'eslestirme-kart sonuc-kart';
      k.dataset.deger = String(s);
      k.textContent = String(s);
      k.addEventListener('click', () => eslestirmeKartTikla(k, 'sonuc'));
      alt.appendChild(k);
    });
  }

  function eslestirmeKartTikla(kart, tip) {
    if (kart.classList.contains('eslesti')) return;

    const onceki = eslestirmeDurum.secili;

    if (!onceki) {
      kart.classList.add('secili');
      eslestirmeDurum.secili = { kart, tip };
      sesTik();
      return;
    }

    if (onceki.kart === kart) {
      kart.classList.remove('secili');
      eslestirmeDurum.secili = null;
      return;
    }

    if (onceki.tip === tip) {
      onceki.kart.classList.remove('secili');
      kart.classList.add('secili');
      eslestirmeDurum.secili = { kart, tip };
      sesTik();
      return;
    }

    const islemKart = onceki.tip === 'islem' ? onceki.kart : kart;
    const sonucKart = onceki.tip === 'sonuc' ? onceki.kart : kart;
    const beklenen = parseInt(islemKart.dataset.cevap, 10);
    const verilen = parseInt(sonucKart.dataset.deger, 10);

    if (beklenen === verilen) {
      sesDogru();
      islemKart.classList.remove('secili');
      sonucKart.classList.remove('secili');
      islemKart.classList.add('eslesti');
      sonucKart.classList.add('eslesti');
      eslestirmeCizgiCiz(islemKart, sonucKart);
      eslestirmeDurum.secili = null;
      eslestirmeDurum.esler++;
      const yildiz = oyunDurum.yildizlar.findIndex((y) => y === false);
      if (yildiz >= 0) oyunDurum.yildizlar[yildiz] = true;
      setTimeout(yildizPaneliGuncelle, 200);
      setTimeout(sesYildiz, 320);
      const p = { sonuc: beklenen, _ilkDeneme: true };
      istatistikKaydet(p, true);
      const rozet = document.getElementById('ilerleme-rozet');
      if (rozet) rozet.textContent = `${eslestirmeDurum.esler}/${eslestirmeDurum.beklenen}`;
      if (eslestirmeDurum.esler === eslestirmeDurum.beklenen) {
        setTimeout(bolumBitir, 900);
      }
    } else {
      sesYanlis();
      kart.classList.add('yanlis');
      onceki.kart.classList.add('yanlis');
      eslestirmeDurum.secili = null;
      istatistikKaydet({ sonuc: beklenen, _ilkDeneme: false }, false);
      setTimeout(() => {
        kart.classList.remove('yanlis', 'secili');
        onceki.kart.classList.remove('yanlis', 'secili');
      }, 600);
    }
  }

  function eslestirmeCizgiCiz(islemKart, sonucKart) {
    const svg = document.getElementById('eslestirme-cizgi');
    const alan = document.querySelector('.eslestirme-alan');
    if (!svg || !alan) return;
    const r1 = islemKart.getBoundingClientRect();
    const r2 = sonucKart.getBoundingClientRect();
    const a = alan.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${a.width} ${a.height}`);
    svg.setAttribute('width', a.width);
    svg.setAttribute('height', a.height);
    const x1 = r1.left + r1.width / 2 - a.left;
    const y1 = r1.bottom - a.top;
    const x2 = r2.left + r2.width / 2 - a.left;
    const y2 = r2.top - a.top;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'rgba(168, 230, 161, 0.8)');
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-dasharray', '6 4');
    svg.appendChild(line);
  }

  /* --------------------------------------------
     Konfeti efekti
     -------------------------------------------- */

  const KONFETI_EMOJI = ['✨', '🌟', '💖', '🎉', '🌸', '⭐'];

  function konfetiYagdir(x, y, kapsayici) {
    const kat = kapsayici && kapsayici.querySelector('.konfeti-katman');
    const hedef = kat || document.getElementById('konfeti-katman');
    if (!hedef) return konfetiBelgeyeYag(x, y);
    hedef.hidden = false;
    hedef.innerHTML = '';
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.className = 'konfeti-parca';
      p.textContent = KONFETI_EMOJI[rastgele(0, KONFETI_EMOJI.length - 1)];
      p.style.left = (x - 12) + 'px';
      p.style.top  = (y - 12) + 'px';
      p.style.setProperty('--dx', rastgele(-120, 120) + 'px');
      p.style.setProperty('--dy', rastgele(80, 220) + 'px');
      p.style.setProperty('--dr', rastgele(-360, 360) + 'deg');
      p.style.fontSize = (16 + rastgele(0, 14)) + 'px';
      p.style.animationDelay = (i * 0.02) + 's';
      hedef.appendChild(p);
    }
    setTimeout(() => { hedef.innerHTML = ''; hedef.hidden = true; }, 1700);
  }

  function konfetiBelgeyeYag(x, y) {
    const oyun = document.getElementById('konfeti-katman');
    if (oyun) konfetiYagdir(x, y, document.getElementById('screen-oyun'));
  }

  /* --------------------------------------------
     Öğretici (Pıtırcık öğretmen modu)
     -------------------------------------------- */

  const OGRETICI_ICERIK = {
    toplama: {
      baslik: '➕ Toplama Öğreniyoruz!',
      adimlar: [
        { tip: 'metin', icerik: 'Merhaba Zehra! Ben Pıtırcık 🐰. Bugün <strong>toplama</strong> öğreneceğiz!' },
        { tip: 'sahne', a: 2, b: 1, islem: '+', obje: '🍎', icerik: '<strong>2</strong> elma var. <strong>1</strong> elma daha geliyor.' },
        { tip: 'sahne', a: 2, b: 1, islem: '+', obje: '🍎', sayim: true, icerik: 'Şimdi birlikte sayalım: 1, 2, 3! 🎉 Toplam <strong>3</strong> elma!' },
        { tip: 'metin', icerik: 'Toplama "ekleme" demek. <br/>İki sayıyı topladığında daha büyük bir sayı olur. <br/>Hadi şimdi sen dene!' }
      ]
    },
    cikarma: {
      baslik: '➖ Çıkarma Öğreniyoruz!',
      adimlar: [
        { tip: 'metin', icerik: 'Süpersin! Şimdi <strong>çıkarma</strong>yı öğrenelim.' },
        { tip: 'sahne', a: 4, b: 1, islem: '-', obje: '🦋', icerik: '<strong>4</strong> kelebek var. <strong>1</strong> tanesi uçtu gitti.' },
        { tip: 'sahne', a: 4, b: 1, islem: '-', obje: '🦋', sayim: true, icerik: 'Geriye kaç kaldı? Sayalım: 1, 2, 3! 🌟 <strong>3</strong> kelebek kaldı.' },
        { tip: 'metin', icerik: 'Çıkarma "azaltma" demek. <br/>Bir sayıdan başka bir sayı çıkardığında daha küçük bir sayı olur.' }
      ]
    },
    karisik: {
      baslik: '🤔 Karışık Sorular!',
      adimlar: [
        { tip: 'metin', icerik: 'Artık hem toplama hem çıkarma yapıyorsun! 💪' },
        { tip: 'metin', icerik: 'Bu bölgede <strong>+</strong> ve <strong>−</strong> karışık gelecek. <br/>Dikkatli oku, doğru işlemi yap!' }
      ]
    }
  };

  function ogreticiGoster(konu, callback) {
    const icerik = OGRETICI_ICERIK[konu];
    if (!icerik) { callback && callback(); return; }

    // Pedagoji katmanını yeniden kullan
    const kat = document.getElementById('pedagoji-katman');
    const baslikEl = document.getElementById('pedagoji-baslik');
    const sahneEl = document.getElementById('pedagoji-sahne');
    const cevapY = document.getElementById('pedagoji-cevap-yazisi');
    const devam = kat.querySelector('.pedagoji-devam');
    if (!kat) { callback && callback(); return; }

    let adim = 0;
    const oynat = () => {
      if (adim >= icerik.adimlar.length) {
        kat.hidden = true;
        sesYildiz();
        callback && callback();
        return;
      }
      const ad = icerik.adimlar[adim];
      sahneEl.innerHTML = '';
      cevapY.innerHTML = ad.icerik || '';
      cevapY.style.fontSize = '17px';
      cevapY.style.background = 'rgba(255, 255, 255, 0.95)';
      cevapY.style.color = 'var(--renk-yazi)';
      cevapY.style.padding = '14px 22px';
      cevapY.style.maxWidth = '320px';
      baslikEl.textContent = icerik.baslik;
      if (devam) devam.textContent = (adim < icerik.adimlar.length - 1) ? '↓ Devam...' : '✓ Anladım, deneyelim!';

      if (ad.tip === 'sahne') {
        ogreticiSahne(sahneEl, ad);
      }
      adim++;
      kat.hidden = false;
    };

    const tıkla = () => oynat();
    kat.removeEventListener('click', kat._ogreticiHandler || (() => {}));
    kat._ogreticiHandler = tıkla;
    kat.addEventListener('click', tıkla);

    oynat();
  }

  function ogreticiSahne(parent, ad) {
    if (ad.islem === '+') {
      for (let i = 0; i < ad.a; i++) parent.appendChild(pedagojiObje(ad.obje, null, i * 0.05));
      const isaret = document.createElement('span');
      isaret.className = 'pedagoji-isaret';
      isaret.textContent = '+';
      parent.appendChild(isaret);
      for (let i = 0; i < ad.b; i++) parent.appendChild(pedagojiObje(ad.obje, null, (ad.a + i) * 0.05));
    } else if (ad.islem === '-') {
      for (let i = 0; i < ad.a; i++) parent.appendChild(pedagojiObje(ad.obje, null, i * 0.05, i < ad.b));
    } else if (ad.islem === '×') {
      // a grup, her grupta b obje
      for (let g = 0; g < ad.a; g++) {
        const grup = document.createElement('span');
        grup.style.cssText = 'display:flex;gap:6px;padding:8px;background:rgba(255,255,255,0.6);border-radius:14px;';
        for (let j = 0; j < ad.b; j++) grup.appendChild(pedagojiObje(ad.obje, null, (g * ad.b + j) * 0.05));
        parent.appendChild(grup);
        if (g < ad.a - 1) {
          const x = document.createElement('span');
          x.className = 'pedagoji-isaret';
          x.textContent = '×';
          parent.appendChild(x);
        }
      }
    } else if (ad.islem === '÷') {
      // a obje, b gruba dağıtılmış
      for (let g = 0; g < ad.b; g++) {
        const grup = document.createElement('span');
        grup.style.cssText = 'display:flex;gap:6px;padding:8px;background:rgba(255,255,255,0.6);border-radius:14px;';
        for (let j = 0; j < (ad.sonuc || ad.a / ad.b); j++) grup.appendChild(pedagojiObje(ad.obje, null, (g * 3 + j) * 0.05));
        parent.appendChild(grup);
      }
    }

    if (ad.sayim) {
      const objeler = parent.querySelectorAll('.pedagoji-obje:not(.cikan)');
      let sayi = 0;
      const sayim = () => {
        if (sayi >= objeler.length) return;
        const o = objeler[sayi];
        const num = document.createElement('span');
        num.className = 'pedagoji-num';
        num.textContent = String(sayi + 1);
        o.appendChild(num);
        sesTik();
        sayi++;
        setTimeout(sayim, 350);
      };
      setTimeout(sayim, 400);
    }
  }

  /* --------------------------------------------
     Sürükle-Bırak (Bölge 2)
     -------------------------------------------- */

  let surukleSeans = null;

  function surukleBolumBaslat() {
    oyunDurum.problemIndex = 0;
    surukleProblemBaslat();
  }

  function surukleProblemBaslat() {
    const p = oyunDurum.problemler[oyunDurum.problemIndex];
    p._ilkDeneme = p._ilkDeneme !== false;
    oyunDurum.aktif = p;
    document.getElementById('ilerleme-rozet').textContent =
      `${oyunDurum.problemIndex + 1}/${oyunDurum.problemler.length}`;

    document.getElementById('oyun-talimat').innerHTML =
      `<p>Sepete <strong>${p.sonuc}</strong> ${OBJE_ADLARI[p.obje] || 'meyve'} koy!</p>`;
    document.getElementById('surukle-talimat-rozet').textContent = `Sepete ${p.sonuc} koy`;
    document.getElementById('surukle-agac').textContent = '🌳';

    surukleRender(p);
  }

  function surukleRender(p) {
    const havuz = document.getElementById('surukle-meyveler');
    const sayim = document.getElementById('surukle-sayim');
    if (!havuz) return;
    havuz.innerHTML = '';

    const toplamMeyve = p.sonuc + 3; // sepete koymak için fazladan meyve
    surukleSeans = { hedef: p.sonuc, sepetteSayi: 0, problem: p };
    sayim.textContent = `0 / ${p.sonuc}`;

    for (let i = 0; i < toplamMeyve; i++) {
      const meyve = document.createElement('button');
      meyve.type = 'button';
      meyve.className = 'surukle-obje';
      meyve.textContent = p.obje;
      const sahneW = 480 - 32;
      const x = (i / Math.max(toplamMeyve - 1, 1)) * (sahneW - 50);
      const y = (i % 2) * 36;
      meyve.style.left = x + 'px';
      meyve.style.top = y + 'px';
      meyveSurukleBagla(meyve);
      havuz.appendChild(meyve);
    }
  }

  function meyveSurukleBagla(meyve) {
    let baslangicX = 0, baslangicY = 0;
    let dx = 0, dy = 0;
    let suruluyor = false;

    const baslat = (e) => {
      const ev = e.touches ? e.touches[0] : e;
      baslangicX = ev.clientX;
      baslangicY = ev.clientY;
      dx = 0; dy = 0;
      suruluyor = true;
      meyve.classList.add('suruluyor');
      sesTik();
      e.preventDefault && e.preventDefault();
    };

    const hareket = (e) => {
      if (!suruluyor) return;
      const ev = e.touches ? e.touches[0] : e;
      dx = ev.clientX - baslangicX;
      dy = ev.clientY - baslangicY;
      meyve.style.transform = `translate(${dx}px, ${dy}px) scale(1.2)`;
      e.preventDefault && e.preventDefault();
    };

    const bitir = (e) => {
      if (!suruluyor) return;
      suruluyor = false;
      meyve.classList.remove('suruluyor');
      const m = meyve.getBoundingClientRect();
      const sepet = document.getElementById('surukle-sepet').getBoundingClientRect();
      const cx = m.left + m.width / 2;
      const cy = m.top + m.height / 2;
      const sepete = cx >= sepet.left && cx <= sepet.right && cy >= sepet.top - 20 && cy <= sepet.bottom + 20;
      if (sepete) {
        meyve.classList.add('sepete-girdi');
        surukleSeans.sepetteSayi++;
        document.getElementById('surukle-sayim').textContent = `${surukleSeans.sepetteSayi} / ${surukleSeans.hedef}`;
        const sepetEl = document.getElementById('surukle-sepet');
        sepetEl.classList.remove('aktif');
        void sepetEl.offsetWidth;
        sepetEl.classList.add('aktif');
        ses(660, 0.1, 'triangle');
      } else {
        meyve.style.transform = '';
      }
    };

    meyve.addEventListener('mousedown', baslat);
    meyve.addEventListener('touchstart', baslat, { passive: false });
    document.addEventListener('mousemove', hareket);
    document.addEventListener('touchmove', hareket, { passive: false });
    document.addEventListener('mouseup', bitir);
    document.addEventListener('touchend', bitir);
  }

  function surukleBitir() {
    if (!surukleSeans) return;
    const dogru = surukleSeans.sepetteSayi === surukleSeans.hedef;
    const p = oyunDurum.aktif;
    if (dogru) {
      sesDogru();
      const sepetEl = document.getElementById('surukle-sepet').getBoundingClientRect();
      const sahneEl = document.getElementById('surukle-sahne').getBoundingClientRect();
      konfetiYagdir(
        sepetEl.left - sahneEl.left + sepetEl.width / 2,
        sepetEl.top - sahneEl.top + 30,
        document.getElementById('screen-oyun')
      );
      if (p._ilkDeneme) {
        oyunDurum.yildizlar[oyunDurum.problemIndex] = true;
        setTimeout(yildizPaneliGuncelle, 200);
        setTimeout(sesYildiz, 350);
      }
      istatistikKaydet(p, true);
      geriBildirim('🎉', rastgeleTepki(TEPKI_DOGRU));
      setTimeout(() => {
        gizleGeriBildirim();
        oyunDurum.problemIndex++;
        if (oyunDurum.problemIndex >= oyunDurum.problemler.length) bolumBitir();
        else surukleProblemBaslat();
      }, 1500);
    } else {
      sesYanlis();
      p._ilkDeneme = false;
      istatistikKaydet(p, false);
      pedagojiAnlat(p, () => surukleProblemBaslat());
    }
  }

  /* --------------------------------------------
     Karışık Tipler (Bölge 5 — Sihirli Orman)
     -------------------------------------------- */

  function karisikBolumBaslat() {
    // Her problem için rastgele bir alt-tip ata
    oyunDurum.problemler = oyunDurum.problemler.map((p, i) => {
      const tipler = ['klasik', 'balon', 'surukle'];
      // Eşleştirme tek bir ekran 3-problem mekaniği — atla
      const altTip = tipler[i % tipler.length];
      return { ...p, _altTip: altTip };
    });
    oyunDurum.problemIndex = 0;
    karisikSonrakiProblem();
  }

  function karisikSonrakiProblem() {
    const p = oyunDurum.problemler[oyunDurum.problemIndex];
    if (!p) { bolumBitir(); return; }
    oyunTipiniGoster(p._altTip);
    oyunDurum.aktif = p;
    if (p._altTip === 'balon') balonProblemBaslat();
    else if (p._altTip === 'surukle') surukleProblemBaslat();
    else problemBaslat();
  }

  /* --------------------------------------------
     Pedagojik Anlatım (yanlış cevap sonrası)
     -------------------------------------------- */

  function pedagojiAnlat(problem, sonra) {
    const kat = document.getElementById('pedagoji-katman');
    const sahne = document.getElementById('pedagoji-sahne');
    const cevapY = document.getElementById('pedagoji-cevap-yazisi');
    if (!kat || !sahne) { sonra && sonra(); return; }

    sahne.innerHTML = '';
    cevapY.textContent = '';
    kat.hidden = false;

    const obje = problem.obje || '🍎';
    const islem = problem.islem || '+';
    const a = problem.a, b = problem.b;
    const toplam = problem.sonuc;

    // 1. Adım: A objesini göster
    setTimeout(() => {
      for (let i = 0; i < a; i++) {
        sahne.appendChild(pedagojiObje(obje, null, i * 0.08));
      }
    }, 200);

    // 2. Adım: işaret göster
    setTimeout(() => {
      const isaret = document.createElement('span');
      isaret.className = 'pedagoji-isaret';
      isaret.textContent = islem === '+' ? '+' : '−';
      sahne.appendChild(isaret);
    }, 200 + a * 80 + 200);

    // 3. Adım: B objesini ekle (toplama) veya çıkar (çıkarma)
    setTimeout(() => {
      if (islem === '+') {
        for (let i = 0; i < b; i++) {
          sahne.appendChild(pedagojiObje(obje, null, i * 0.08));
        }
      } else {
        // Çıkarmada B tane çıkar (üstü çizgili)
        for (let i = 0; i < b; i++) {
          sahne.appendChild(pedagojiObje(obje, null, i * 0.08, true));
        }
      }
    }, 200 + a * 80 + 500);

    // 4. Adım: hepsini birlikte sırayla numarala
    setTimeout(() => {
      const objeler = sahne.querySelectorAll('.pedagoji-obje:not(.cikan)');
      let sayi = 0;
      const sayim = () => {
        if (sayi >= objeler.length) {
          // Cevabı yaz
          setTimeout(() => {
            cevapY.textContent = `Cevap: ${toplam} 🌟`;
            sesYildiz();
          }, 200);
          setTimeout(() => {
            kat.hidden = true;
            sonra && sonra();
          }, 2200);
          return;
        }
        const o = objeler[sayi];
        const num = document.createElement('span');
        num.className = 'pedagoji-num';
        num.textContent = String(sayi + 1);
        o.appendChild(num);
        sesTik();
        sayi++;
        setTimeout(sayim, 350);
      };
      sayim();
    }, 200 + a * 80 + 700 + b * 80 + 400);
  }

  function pedagojiObje(emoji, _, gec, cikan) {
    const o = document.createElement('span');
    o.className = 'pedagoji-obje' + (cikan ? ' cikan' : '');
    o.textContent = emoji;
    o.style.animationDelay = (gec || 0) + 's';
    if (cikan) {
      o.style.opacity = '0.4';
      o.style.filter = 'grayscale(0.7)';
      const x = document.createElement('span');
      x.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:30px;color:#FF6B9D;font-weight:900;text-shadow:0 0 4px white;';
      x.textContent = '✗';
      o.appendChild(x);
    }
    return o;
  }

  /* --------------------------------------------
     Bölge sonu kutlama — fanfar + dans
     -------------------------------------------- */

  function sesFanfar() {
    // Yükselen üçlü akor
    const ctx = sesContext();
    if (!ctx || !OYUN.durum.ayarlar.ses) return;
    const notalar = [523, 659, 784, 1047, 1319]; // C5 E5 G5 C6 E6
    notalar.forEach((nota, i) => {
      setTimeout(() => ses(nota, 0.18, 'triangle'), i * 90);
    });
  }

  /* --------------------------------------------
     Arka plan müziği — Lo-fi kawaii loop (Web Audio)
     -------------------------------------------- */

  let muzikDurum = { calıyor: false, zamanlayicilar: [], gain: null };
  const MUZIK_NOTALARI = [
    // C major pentatonik temalı yumuşak loop, 8 nota
    523, 659, 784, 880, 784, 659, 587, 523
  ];

  function muzikBaslat() {
    if (muzikDurum.calıyor) return;
    const ctx = sesContext();
    if (!ctx) return;
    muzikDurum.calıyor = true;
    if (!muzikDurum.gain) {
      muzikDurum.gain = ctx.createGain();
      muzikDurum.gain.gain.value = 0.07;
      muzikDurum.gain.connect(ctx.destination);
    }
    muzikLoop();
  }

  function muzikLoop() {
    if (!muzikDurum.calıyor) return;
    const ctx = sesContext();
    if (!ctx) return;
    MUZIK_NOTALARI.forEach((nota, i) => {
      const t = setTimeout(() => {
        if (!muzikDurum.calıyor) return;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = nota;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.36);
        osc.connect(g).connect(muzikDurum.gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }, i * 380);
      muzikDurum.zamanlayicilar.push(t);
    });
    const son = setTimeout(muzikLoop, MUZIK_NOTALARI.length * 380 + 240);
    muzikDurum.zamanlayicilar.push(son);
  }

  function muzikDurdur() {
    muzikDurum.calıyor = false;
    muzikDurum.zamanlayicilar.forEach(clearTimeout);
    muzikDurum.zamanlayicilar = [];
  }

  function muzikDurumuYansit() {
    const acik = !!(OYUN.durum.ayarlar && OYUN.durum.ayarlar.muzik);
    if (acik) muzikBaslat(); else muzikDurdur();
  }

  /* --------------------------------------------
     Haftalık grafik (Ebeveyn paneli)
     -------------------------------------------- */

  function hafyalikGrafikCiz() {
    const svg = document.getElementById('eb-grafik-svg');
    if (!svg) return;
    svg.innerHTML = '';

    // Son 7 gün için doğru sayıları topla
    const ist = istatistikGetir();
    const gunluk = ist.gunluk || {};
    const bugun = new Date();
    const veriler = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(bugun);
      d.setDate(d.getDate() - i);
      const anahtar = d.toISOString().slice(0, 10);
      const gun = gunluk[anahtar] || { dogru: 0, yanlis: 0 };
      const gunAdlari = ['Pz','Pt','Sa','Çr','Pr','Cu','Ct'];
      veriler.push({ etiket: gunAdlari[d.getDay()], dogru: gun.dogru, yanlis: gun.yanlis });
    }

    const maxDeger = Math.max(1, ...veriler.map((v) => v.dogru));
    const W = 300, H = 110;
    const sutunGen = W / 7;
    const tabanY = H - 18;
    const ustY = 18;

    veriler.forEach((v, i) => {
      const x = i * sutunGen + sutunGen * 0.18;
      const w = sutunGen * 0.64;
      const yuks = (v.dogru / maxDeger) * (tabanY - ustY);
      const y = tabanY - yuks;

      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', x);
      bar.setAttribute('y', v.dogru === 0 ? tabanY - 3 : y);
      bar.setAttribute('width', w);
      bar.setAttribute('height', v.dogru === 0 ? 3 : Math.max(yuks, 4));
      bar.setAttribute('rx', 3);
      bar.setAttribute('class', 'eb-grafik-bar' + (v.dogru === 0 ? ' bos' : (v.dogru < maxDeger * 0.5 ? ' az' : '')));
      svg.appendChild(bar);

      if (v.dogru > 0) {
        const dgr = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dgr.setAttribute('x', x + w / 2);
        dgr.setAttribute('y', y - 3);
        dgr.setAttribute('class', 'eb-grafik-deger');
        dgr.textContent = v.dogru;
        svg.appendChild(dgr);
      }

      const etk = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      etk.setAttribute('x', x + w / 2);
      etk.setAttribute('y', H - 4);
      etk.setAttribute('class', 'eb-grafik-etiket');
      etk.textContent = v.etiket;
      svg.appendChild(etk);
    });
  }

  /* --------------------------------------------
     İstatistikler (Sprint 6 — akıllı zorluk + ebeveyn paneli)
     -------------------------------------------- */

  function istatistikGetir() {
    if (!OYUN.durum.istatistik) {
      OYUN.durum.istatistik = {
        toplam: 0, dogru: 0, yanlis: 0,
        ortalamaSure: 0,
        sonProblemler: [],
        bolge: {}
      };
    }
    return OYUN.durum.istatistik;
  }

  function istatistikBolgeBaslat(bolge) {
    const ist = istatistikGetir();
    if (!ist.bolge[bolge.id]) {
      ist.bolge[bolge.id] = { oynama: 0, dogru: 0, yanlis: 0, ucYildizSayisi: 0 };
    }
    ist.bolge[bolge.id].oynama++;
    ist._problemBaslangic = Date.now();
  }

  function istatistikKaydet(problem, dogruMu) {
    const ist = istatistikGetir();
    ist.toplam++;
    if (dogruMu) ist.dogru++; else ist.yanlis++;
    const sure = ist._problemBaslangic ? Date.now() - ist._problemBaslangic : 0;
    ist._problemBaslangic = Date.now();
    if (sure > 0) {
      ist.ortalamaSure = ist.ortalamaSure
        ? Math.round(ist.ortalamaSure * 0.85 + sure * 0.15)
        : sure;
    }
    ist.sonProblemler.push({ z: Date.now(), d: dogruMu ? 1 : 0, s: sure, sonuc: problem.sonuc || null });
    if (ist.sonProblemler.length > 30) ist.sonProblemler.shift();

    // Günlük takip
    if (!ist.gunluk) ist.gunluk = {};
    const bugun = new Date().toISOString().slice(0, 10);
    if (!ist.gunluk[bugun]) ist.gunluk[bugun] = { dogru: 0, yanlis: 0 };
    if (dogruMu) ist.gunluk[bugun].dogru++; else ist.gunluk[bugun].yanlis++;

    if (oyunDurum.bolge) {
      const b = ist.bolge[oyunDurum.bolge.id];
      if (b) { if (dogruMu) b.dogru++; else b.yanlis++; }
    }
    durumKaydet(OYUN.durum);
  }

  /* --------------------------------------------
     Akıllı zorluk — son 10 performansa göre maxSonuc'u dinamik ayarla
     -------------------------------------------- */

  function akilliZorluk(bolge) {
    const mod = (OYUN.durum && OYUN.durum.ayarlar && OYUN.durum.ayarlar.zorlukModu) || 'otomatik';
    if (mod === 'kolay') return Math.max(3, bolge.maxSonuc - 2);
    if (mod === 'orta')  return bolge.maxSonuc;
    if (mod === 'zor')   return Math.min(10, bolge.maxSonuc + 1);
    const ist = istatistikGetir();
    const son = (ist.sonProblemler || []).slice(-10);
    if (son.length < 5) return bolge.maxSonuc;
    const oran = son.filter((x) => x.d === 1).length / son.length;
    if (oran >= 0.85) return Math.min(10, bolge.maxSonuc + 1);
    if (oran <= 0.4)  return Math.max(3, bolge.maxSonuc - 1);
    return bolge.maxSonuc;
  }

  /* --------------------------------------------
     Bölüm sonu + ödül
     -------------------------------------------- */

  function bolumBitir() {
    const yildizSayisi = oyunDurum.yildizlar.filter(Boolean).length;
    const toplamProblem = oyunDurum.problemler.length;
    const bolumKodu = oyunDurum.bolumKodu || `${oyunDurum.bolge.id}.1`;
    const bolge = oyunDurum.bolge;
    const ucYildiz = Math.max(1, Math.round((yildizSayisi / toplamProblem) * 3));

    // Bölüm ilerleme
    if (!OYUN.durum.ilerleme.bolumler) OYUN.durum.ilerleme.bolumler = {};
    const ipBolum = OYUN.durum.ilerleme.bolumler[bolumKodu] || { acik: true, yildiz: 0, tamamlandi: false };
    if (ucYildiz > ipBolum.yildiz) ipBolum.yildiz = ucYildiz;
    ipBolum.tamamlandi = true;
    OYUN.durum.ilerleme.bolumler[bolumKodu] = ipBolum;

    // Sonraki bölümü aç
    const sira = BOLUMLER.findIndex((b) => b.kod === bolumKodu);
    if (sira !== -1 && sira < BOLUMLER.length - 1) {
      const sonraki = BOLUMLER[sira + 1].kod;
      const ipSon = OYUN.durum.ilerleme.bolumler[sonraki] || { acik: false, yildiz: 0, tamamlandi: false };
      ipSon.acik = true;
      OYUN.durum.ilerleme.bolumler[sonraki] = ipSon;
    }

    // Bölge ilerleme (eski uyumluluk + bahçe alan kilidi)
    const ip = OYUN.durum.ilerleme.bolgeler[bolge.id] || { acik: true, yildiz: 0, tamamlandi: false };
    if (ucYildiz > ip.yildiz) ip.yildiz = ucYildiz;
    // Bölge tamamlandı sayılsın: o bölgenin tüm bölümleri bitti mi?
    const bolgeBolumleri = BOLUMLER.filter((b) => b.bolge === bolge.id);
    const hepsi = bolgeBolumleri.every((b) =>
      OYUN.durum.ilerleme.bolumler[b.kod] && OYUN.durum.ilerleme.bolumler[b.kod].tamamlandi);
    if (hepsi) ip.tamamlandi = true;
    OYUN.durum.ilerleme.bolgeler[bolge.id] = ip;

    // Bölge tamamlandığında bir sonraki bölgenin ilk bölümünü aç
    if (hepsi) {
      const sonrakiBolgeId = bolge.id + 1;
      const sonrakiBolgeBolumleri = BOLUMLER.filter((b) => b.bolge === sonrakiBolgeId);
      if (sonrakiBolgeBolumleri.length) {
        const ilk = sonrakiBolgeBolumleri[0].kod;
        const ipSon = OYUN.durum.ilerleme.bolumler[ilk] || { acik: false, yildiz: 0, tamamlandi: false };
        ipSon.acik = true;
        OYUN.durum.ilerleme.bolumler[ilk] = ipSon;
      }
      const sonrakiBolge = OYUN.durum.ilerleme.bolgeler[sonrakiBolgeId] || { acik: false, yildiz: 0, tamamlandi: false };
      sonrakiBolge.acik = true;
      OYUN.durum.ilerleme.bolgeler[sonrakiBolgeId] = sonrakiBolge;
    }

    const odul = oduluHesapla(ucYildiz);
    OYUN.durum.kaynaklar.tohum += odul.tohum;
    OYUN.durum.kaynaklar.su    += odul.su;
    OYUN.durum.kaynaklar.gunes += odul.gunes;
    // Yeni şemada bitkiler kullanıcı tarafından bahçede eklenir;
    // ödül olarak otomatik bitki eklenmez. Sadece alan kilidini kontrol et.
    bahceMigrate();
    bahceAlanKilidiKontrol();

    durumKaydet(OYUN.durum);
    arayuzGuncelle();
    sonucEkraniGoster(ucYildiz, odul);
  }

  function oduluHesapla(yildiz) {
    const tablo = [
      { tohum: 1, su: 0, gunes: 0 },
      { tohum: 3, su: 1, gunes: 1 },
      { tohum: 5, su: 3, gunes: 2 },
      { tohum: 7, su: 4, gunes: 3 }
    ];
    return tablo[Math.max(0, Math.min(3, yildiz))];
  }

  function rastgeleBitki(bolge) {
    if (bolge && bolge.objeler) {
      const havuz = bolge.objeler.filter((o) => /^[\u{1F330}-\u{1F33F}]|[\u{1F337}-\u{1F33B}]|🪻/u.test(o));
      if (havuz.length) return havuz[rastgele(0, havuz.length - 1)];
    }
    const def = ['🌷', '🌸', '🌼', '🌻', '🌹', '🌺', '🪻', '🌱'];
    return def[rastgele(0, def.length - 1)];
  }

  function sonucEkraniGoster(yildiz, odul) {
    const baslik = document.getElementById('sonuc-baslik');
    const mesaj = document.getElementById('sonuc-mesaj');
    const karakter = document.querySelector('#screen-sonuc .sonuc-karakter');

    if (yildiz === 3)      { baslik.textContent = 'Mükemmel!';   mesaj.textContent = 'Hepsini ilk seferde bildin!'; }
    else if (yildiz === 2) { baslik.textContent = 'Çok İyi!';    mesaj.textContent = 'Bahçen için ödüller kazandın!'; }
    else if (yildiz === 1) { baslik.textContent = 'İyi İş!';     mesaj.textContent = 'Bir tohum daha kazandın!'; }
    else                   { baslik.textContent = 'Tekrar Dene!'; mesaj.textContent = 'Yine de küçük bir hediye var!'; }

    if (karakter && yildiz >= 2) {
      karakter.classList.add('dans-ediyor');
    } else if (karakter) {
      karakter.classList.remove('dans-ediyor');
    }

    // Fanfar + büyük konfeti yağmuru (yıldız >= 1)
    if (yildiz >= 1) {
      setTimeout(sesFanfar, 200);
      setTimeout(() => {
        const sonuc = document.getElementById('screen-sonuc');
        const r = sonuc.getBoundingClientRect();
        // Üç farklı noktadan konfeti
        for (let i = 0; i < 3; i++) {
          setTimeout(() => konfetiYagdir(r.width * (0.2 + i * 0.3), 60, sonuc), i * 350);
        }
      }, 600);
    }

    document.querySelectorAll('#sonuc-yildizlar span').forEach((s, i) => {
      s.classList.remove('kazanildi');
      if (i < yildiz) setTimeout(() => { s.classList.add('kazanildi'); sesYildiz(); }, 400 + i * 350);
    });

    const liste = document.getElementById('odul-listesi');
    liste.innerHTML = '';
    [
      { emoji: '🌱', sayi: odul.tohum },
      { emoji: '💧', sayi: odul.su },
      { emoji: '☀️', sayi: odul.gunes }
    ].filter((o) => o.sayi > 0).forEach((o, i) => {
      const r = document.createElement('span');
      r.className = 'odul-rozet';
      r.style.animationDelay = (1.5 + i * 0.2) + 's';
      r.innerHTML = `<span class="odul-emoji">${o.emoji}</span><span class="odul-isaret">+${o.sayi}</span>`;
      liste.appendChild(r);
    });

    showScreen('screen-sonuc');
  }

  /* --------------------------------------------
     Bahçem
     -------------------------------------------- */

  /* --------------------------------------------
     Bahçem v2 — etkileşimli profesyonel bahçe
     -------------------------------------------- */

  const CICEK_HAVUZU = ['🌷', '🌸', '🌼', '🌻', '🌹', '🌺', '🪻', '🌿'];
  const BITKI_AŞAMA = ['🌱', '🌿', null /* çiçek - emoji bitkide saklı */];

  function bahceMigrate() {
    const b = OYUN.durum.bahce || {};
    if (!b.alanlar) {
      const yeni = {
        alanlar: [
          { id: 0, slot: 6, acik: true },
          { id: 1, slot: 6, acik: false, kilit: { tip: 'bolge', deger: 3 } }
        ],
        bitkiler: []
      };
      // Eski [emoji,emoji,...] formatını her bitki için yeni şemaya çevir
      if (Array.isArray(b.bitkiler) && b.bitkiler.length > 0 && typeof b.bitkiler[0] === 'string') {
        b.bitkiler.slice(0, 12).forEach((emoji, i) => {
          const alanId = i < 6 ? 0 : 1;
          const slot = i % 6;
          yeni.bitkiler.push({ alan: alanId, slot, seviye: 2, emoji });
          if (alanId === 1) yeni.alanlar[1].acik = true;
        });
      } else if (Array.isArray(b.bitkiler)) {
        yeni.bitkiler = b.bitkiler;
      }
      OYUN.durum.bahce = yeni;
    }
    bahceAlanKilidiKontrol();
  }

  function bahceAlanKilidiKontrol() {
    const alanlar = OYUN.durum.bahce.alanlar || [];
    alanlar.forEach((a) => {
      if (a.acik) return;
      if (!a.kilit) return;
      if (a.kilit.tip === 'bolge') {
        const ip = OYUN.durum.ilerleme.bolgeler[a.kilit.deger];
        if (ip && ip.tamamlandi) a.acik = true;
      }
    });
  }

  function bahceCiz() {
    bahceMigrate();
    const t = document.getElementById('bahce-tohum');
    const s = document.getElementById('bahce-su');
    const g = document.getElementById('bahce-gunes');
    if (t) t.textContent = OYUN.durum.kaynaklar.tohum;
    if (s) s.textContent = OYUN.durum.kaynaklar.su;
    if (g) g.textContent = OYUN.durum.kaynaklar.gunes;

    const grid = document.getElementById('bahce-toprak-grid');
    if (!grid) return;
    grid.innerHTML = '';

    OYUN.durum.bahce.alanlar.forEach((alan) => {
      const div = document.createElement('div');
      div.className = 'toprak-alan' + (alan.acik ? '' : ' kilitli');
      if (!alan.acik) {
        const yz = document.createElement('span');
        yz.className = 'kilit-yazisi';
        const aciklama = alan.kilit && alan.kilit.tip === 'bolge'
          ? `🔒 Bölge ${alan.kilit.deger}'i tamamla`
          : `🔒 Kilitli`;
        yz.textContent = aciklama;
        div.appendChild(yz);
      } else {
        for (let slot = 0; slot < (alan.slot || 6); slot++) {
          const delik = document.createElement('div');
          delik.className = 'toprak-delik';
          delik.dataset.alan = alan.id;
          delik.dataset.slot = slot;

          const bitki = (OYUN.durum.bahce.bitkiler || []).find(
            (b) => b.alan === alan.id && b.slot === slot
          );
          if (bitki) {
            const bel = document.createElement('span');
            bel.className = 'toprak-bitki seviye-' + (bitki.seviye || 0);
            bel.textContent = bitki.seviye === 2 ? (bitki.emoji || '🌷') : BITKI_AŞAMA[bitki.seviye || 0];
            delik.appendChild(bel);
          }

          delik.addEventListener('click', () => bahceDelikTikla(alan.id, slot, delik));
          div.appendChild(delik);
        }
      }
      grid.appendChild(div);
    });

    bahceMesajGuncelle();
  }

  function bahceMesajGuncelle() {
    const mesaj = document.getElementById('bahce-mesaj');
    if (!mesaj) return;
    const k = OYUN.durum.kaynaklar;
    const bitkiSayisi = (OYUN.durum.bahce.bitkiler || []).length;
    const cicekSayisi = (OYUN.durum.bahce.bitkiler || []).filter((b) => b.seviye === 2).length;
    if (bitkiSayisi === 0) {
      mesaj.textContent = '🌰 Toprağa dokun → tohum ek → sula → güneş ver';
    } else if (cicekSayisi === bitkiSayisi && bitkiSayisi >= 6) {
      mesaj.textContent = '🌷 Bahçen tamamen çiçek açtı! Muhteşem!';
    } else if (k.tohum === 0 && k.su === 0 && k.gunes === 0) {
      mesaj.textContent = '⚡ Kaynakların bitti — yeni bölge oyna!';
    } else {
      mesaj.textContent = `${cicekSayisi}/${bitkiSayisi} bitki çiçek açtı 🌸`;
    }
  }

  function bahceDelikTikla(alanId, slot, delikEl) {
    const k = OYUN.durum.kaynaklar;
    let bitki = (OYUN.durum.bahce.bitkiler || []).find((b) => b.alan === alanId && b.slot === slot);

    if (!bitki) {
      if (k.tohum < 1) { bahceUyari('Tohum yok! Bölge tamamla 🌱'); return; }
      k.tohum--;
      bitki = { alan: alanId, slot, seviye: 0, emoji: null };
      OYUN.durum.bahce.bitkiler.push(bitki);
      sesEkim();
    } else if (bitki.seviye === 0) {
      if (k.su < 1) { bahceUyari('Su yok! 💧'); return; }
      k.su--;
      bitki.seviye = 1;
      sesSu();
    } else if (bitki.seviye === 1) {
      if (k.gunes < 1) { bahceUyari('Güneş yok! ☀️'); return; }
      k.gunes--;
      bitki.seviye = 2;
      bitki.emoji = CICEK_HAVUZU[rastgele(0, CICEK_HAVUZU.length - 1)];
      sesYildiz();
      delikEl.classList.add('parildiyor');
      setTimeout(() => delikEl.classList.remove('parildiyor'), 800);
    } else {
      // Tam çiçek açmış — bonus animasyon
      sesTik();
      delikEl.classList.add('parildiyor');
      setTimeout(() => delikEl.classList.remove('parildiyor'), 800);
    }
    durumKaydet(OYUN.durum);
    arayuzGuncelle();
    bahceCiz();
  }

  function bahceUyari(metin) {
    const mesaj = document.getElementById('bahce-mesaj');
    if (!mesaj) return;
    const eski = mesaj.textContent;
    mesaj.textContent = '⚠️ ' + metin;
    mesaj.style.color = '#FF6B9D';
    sesYanlis();
    setTimeout(() => {
      mesaj.style.color = '';
      bahceMesajGuncelle();
    }, 1600);
  }

  function sesEkim() { ses(440, 0.08, 'triangle'); setTimeout(() => ses(550, 0.1, 'triangle'), 60); }
  function sesSu()   { ses(880, 0.1, 'sine'); setTimeout(() => ses(660, 0.12, 'sine'), 70); }

  /* --------------------------------------------
     Dolap (Sprint 5)
     -------------------------------------------- */

  const DOLAP_KIYAFETLER = {
    sapka:  [
      { id: 's1', emoji: '🎀', kilitTohum: 0  },
      { id: 's2', emoji: '👑', kilitTohum: 5  },
      { id: 's3', emoji: '🌸', kilitTohum: 10 },
      { id: 's4', emoji: '🎩', kilitTohum: 15 },
      { id: 's5', emoji: '🍓', kilitTohum: 20 },
      { id: 's6', emoji: '🌟', kilitTohum: 30 }
    ],
    gozluk: [
      { id: 'g1', emoji: '👓', kilitTohum: 0  },
      { id: 'g2', emoji: '🕶️', kilitTohum: 8  },
      { id: 'g3', emoji: '🥽', kilitTohum: 18 },
      { id: 'g4', emoji: '⭐', kilitTohum: 25 }
    ],
    taki:   [
      { id: 't1', emoji: '💎', kilitTohum: 0  },
      { id: 't2', emoji: '❤️', kilitTohum: 6  },
      { id: 't3', emoji: '🦋', kilitTohum: 12 },
      { id: 't4', emoji: '🌷', kilitTohum: 20 }
    ]
  };

  let dolapAktifKategori = 'sapka';

  function dolapCiz() {
    const liste = document.getElementById('dolap-listesi');
    if (!liste) return;
    liste.innerHTML = '';

    const giyili = OYUN.durum.dolap || { sapka: null, gozluk: null, taki: null };
    OYUN.durum.dolap = giyili;

    const kategoriItems = DOLAP_KIYAFETLER[dolapAktifKategori] || [];
    const tohumKazanildi = (OYUN.durum.istatistik && OYUN.durum.istatistik.toplamKazanilan) || OYUN.durum.kaynaklar.tohum;

    kategoriItems.forEach((it) => {
      const acik = it.kilitTohum <= tohumKazanildi;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dolap-item' + (acik ? '' : ' kilitli') + (giyili[dolapAktifKategori] === it.id ? ' giyili' : '');
      btn.textContent = it.emoji;
      btn.title = acik ? '' : `${it.kilitTohum} tohumla açılır`;
      if (acik) {
        btn.addEventListener('click', () => dolapKiyafetSec(dolapAktifKategori, it.id));
      }
      liste.appendChild(btn);
    });

    zehraVitrinCiz();

    document.querySelectorAll('.dolap-sekme').forEach((s) => {
      s.classList.toggle('aktif', s.dataset.kategori === dolapAktifKategori);
    });
  }

  function dolapKiyafetSec(kategori, kiyafetId) {
    const giyili = OYUN.durum.dolap || {};
    if (giyili[kategori] === kiyafetId) {
      giyili[kategori] = null;
    } else {
      giyili[kategori] = kiyafetId;
    }
    OYUN.durum.dolap = giyili;
    durumKaydet(OYUN.durum);
    sesTik();
    dolapCiz();
  }

  function zehraVitrinCiz() {
    const giyili = OYUN.durum.dolap || {};
    const sapkaEmoji = bulKiyafet('sapka', giyili.sapka);
    const gozlukEmoji = bulKiyafet('gozluk', giyili.gozluk);
    const takiEmoji = bulKiyafet('taki', giyili.taki);
    const sapka = document.getElementById('z-sapka');
    const gozluk = document.getElementById('z-gozluk');
    const taki = document.getElementById('z-taki');
    if (sapka) sapka.textContent = sapkaEmoji || '';
    if (gozluk) gozluk.textContent = gozlukEmoji || '';
    if (taki) taki.textContent = takiEmoji || '';
  }

  function bulKiyafet(kategori, id) {
    if (!id) return null;
    const liste = DOLAP_KIYAFETLER[kategori] || [];
    const k = liste.find((x) => x.id === id);
    return k ? k.emoji : null;
  }

  /* --------------------------------------------
     Hayvanlar (Sprint 5)
     -------------------------------------------- */

  const HAYVANLAR = [
    { id: 'pitircik',   emoji: '🐰', varsayilan: 'Pıtırcık',   kilit: { tip: 'baslangic' } },
    { id: 'ari',        emoji: '🐝', varsayilan: 'Vızıl',      kilit: { tip: 'bolge', deger: 1 } },
    { id: 'kelebek',    emoji: '🦋', varsayilan: 'Kanat',      kilit: { tip: 'bolge', deger: 2 } },
    { id: 'ugurbocek',  emoji: '🐞', varsayilan: 'Benekli',   kilit: { tip: 'bolge', deger: 3 } },
    { id: 'tilki',      emoji: '🦊', varsayilan: 'Pamuk',     kilit: { tip: 'bolge', deger: 4 } },
    { id: 'kirpi',      emoji: '🦔', varsayilan: 'Tıkır',     kilit: { tip: 'bolge', deger: 5 } },
    { id: 'panda',      emoji: '🐼', varsayilan: 'Bambu',     kilit: { tip: 'tohum', deger: 30 } },
    { id: 'kuzu',       emoji: '🐑', varsayilan: 'Pofuduk',  kilit: { tip: 'tohum', deger: 50 } }
  ];

  function hayvanAcikMi(h) {
    if (h.kilit.tip === 'baslangic') return true;
    if (h.kilit.tip === 'bolge') {
      const ip = OYUN.durum.ilerleme.bolgeler[h.kilit.deger];
      return !!(ip && ip.tamamlandi);
    }
    if (h.kilit.tip === 'tohum') {
      return OYUN.durum.kaynaklar.tohum >= h.kilit.deger;
    }
    return false;
  }

  function hayvanlarCiz() {
    if (!OYUN.durum.hayvanlar) OYUN.durum.hayvanlar = { aktif: 'pitircik', isimler: {} };
    const aktifId = OYUN.durum.hayvanlar.aktif || 'pitircik';
    const aktif = HAYVANLAR.find((h) => h.id === aktifId) || HAYVANLAR[0];
    const isim = OYUN.durum.hayvanlar.isimler[aktif.id] || aktif.varsayilan;

    const sahne = document.getElementById('hayvan-sahnesi');
    const liste = document.getElementById('hayvan-listesi');
    if (!sahne || !liste) return;
    sahne.innerHTML = '';
    liste.innerHTML = '';

    const buyuk = document.createElement('div');
    buyuk.className = 'hayvan-buyuk';
    buyuk.textContent = aktif.emoji;
    buyuk.addEventListener('click', (e) => hayvanSev(buyuk, e));
    sahne.appendChild(buyuk);

    const isimEl = document.createElement('div');
    isimEl.className = 'hayvan-isim';
    isimEl.textContent = isim;
    isimEl.title = 'İsmini değiştirmek için dokun';
    isimEl.addEventListener('click', () => hayvanIsmiDuzenle(aktif.id, isimEl));
    sahne.appendChild(isimEl);

    HAYVANLAR.forEach((h) => {
      const acik = hayvanAcikMi(h);
      const kart = document.createElement('button');
      kart.type = 'button';
      kart.className = 'hayvan-kart' + (acik ? '' : ' kilitli') + (h.id === aktif.id ? ' aktif' : '');
      kart.textContent = acik ? h.emoji : h.emoji;
      kart.title = acik ? '' : (h.kilit.tip === 'bolge' ? `Bölge ${h.kilit.deger} biterse açılır` : `${h.kilit.deger} tohumla açılır`);
      if (acik) {
        kart.addEventListener('click', () => {
          OYUN.durum.hayvanlar.aktif = h.id;
          durumKaydet(OYUN.durum);
          sesTik();
          hayvanlarCiz();
        });
      }
      liste.appendChild(kart);
    });
  }

  function hayvanSev(el, evt) {
    el.classList.remove('hayvan-sevildi');
    void el.offsetWidth;
    el.classList.add('hayvan-sevildi');
    sesTik();
    setTimeout(() => ses(880, 0.12, 'triangle'), 60);

    // Kalp efekti
    const sahne = document.getElementById('hayvan-sahnesi');
    if (!sahne) return;
    const r = el.getBoundingClientRect();
    const sr = sahne.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      const k = document.createElement('span');
      k.className = 'kalp-efekt';
      k.textContent = ['💖', '❤️', '💕'][i % 3];
      k.style.left = (r.left - sr.left + r.width / 2 - 12) + 'px';
      k.style.top  = (r.top - sr.top + r.height / 2 - 12) + 'px';
      k.style.setProperty('--dx', rastgele(-40, 40) + 'px');
      k.style.animationDelay = (i * 0.1) + 's';
      sahne.appendChild(k);
      setTimeout(() => k.remove(), 1300);
    }
  }

  function hayvanIsmiDuzenle(hayvanId, el) {
    if (el.classList.contains('duzenleniyor')) return;
    const eskiIsim = el.textContent;
    el.classList.add('duzenleniyor');
    el.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 14;
    input.value = eskiIsim;
    input.className = 'hayvan-isim-input';
    el.appendChild(input);
    input.focus();
    input.select();

    const kapat = (kaydet) => {
      const yeni = (input.value || '').trim() || eskiIsim;
      el.classList.remove('duzenleniyor');
      el.textContent = kaydet ? yeni : eskiIsim;
      if (kaydet) {
        if (!OYUN.durum.hayvanlar.isimler) OYUN.durum.hayvanlar.isimler = {};
        OYUN.durum.hayvanlar.isimler[hayvanId] = yeni;
        durumKaydet(OYUN.durum);
      }
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') kapat(true);
      else if (e.key === 'Escape') kapat(false);
    });
    input.addEventListener('blur', () => kapat(true));
  }

  /* --------------------------------------------
     Ebeveyn Paneli (Sprint 6)
     -------------------------------------------- */

  function ebeveynCiz() {
    const ist = istatistikGetir();
    document.getElementById('eb-toplam').textContent = ist.toplam;
    document.getElementById('eb-dogru').textContent  = ist.dogru;
    const yuzde = ist.toplam ? Math.round((ist.dogru / ist.toplam) * 100) : 0;
    document.getElementById('eb-basari').textContent = '%' + yuzde;
    const ortS = ist.ortalamaSure ? Math.round(ist.ortalamaSure / 1000) : 0;
    document.getElementById('eb-sure').textContent = ortS + 's';

    const liste = document.getElementById('eb-bolge-listesi');
    if (liste) {
      liste.innerHTML = '';
      BOLGELER.forEach((b) => {
        const ip = OYUN.durum.ilerleme.bolgeler[b.id] || { yildiz: 0, tamamlandi: false };
        const bolgeIst = ist.bolge[b.id] || { dogru: 0, yanlis: 0, oynama: 0 };
        const top = bolgeIst.dogru + bolgeIst.yanlis;
        const yzd = top ? Math.round((bolgeIst.dogru / top) * 100) : 0;
        const satir = document.createElement('div');
        satir.className = 'eb-bolge-satir';
        satir.innerHTML = `
          <span class="eb-bolge-emoji">${b.emoji}</span>
          <span class="eb-bolge-ad">${b.ad}</span>
          <span class="eb-bolge-yzd">${ip.tamamlandi ? `⭐${ip.yildiz}/3 · %${yzd}` : 'Henüz oynanmadı'}</span>
        `;
        liste.appendChild(satir);
      });
    }

    const mod = OYUN.durum.ayarlar.zorlukModu || 'otomatik';
    document.querySelectorAll('.eb-zor-btn').forEach((b) => {
      b.classList.toggle('aktif', b.dataset.mod === mod);
    });

    const sesAnh = document.getElementById('eb-ses-anahtar');
    if (sesAnh) sesAnh.checked = OYUN.durum.ayarlar.ses !== false;

    const muzikAnh = document.getElementById('eb-muzik-anahtar');
    if (muzikAnh) muzikAnh.checked = !!OYUN.durum.ayarlar.muzik;

    hafyalikGrafikCiz();
  }

  /* --------------------------------------------
     Akıllı zorluk — manuel mod desteği
     -------------------------------------------- */

  // Önceki akilliZorluk fonksiyonunu manuel mod ile genişletiyoruz
  function _akilliZorlukAuto(bolge) {
    const ist = istatistikGetir();
    const son = ist.sonProblemler.slice(-10);
    if (son.length < 5) return bolge.maxSonuc;
    const oran = son.filter((x) => x.d === 1).length / son.length;
    if (oran >= 0.85) return Math.min(10, bolge.maxSonuc + 1);
    if (oran <= 0.4)  return Math.max(3, bolge.maxSonuc - 1);
    return bolge.maxSonuc;
  }

  function akilliZorlukYeni(bolge) {
    const mod = (OYUN.durum.ayarlar && OYUN.durum.ayarlar.zorlukModu) || 'otomatik';
    if (mod === 'kolay') return Math.max(3, bolge.maxSonuc - 2);
    if (mod === 'orta')  return bolge.maxSonuc;
    if (mod === 'zor')   return Math.min(10, bolge.maxSonuc + 1);
    return _akilliZorlukAuto(bolge);
  }
  // İlk tanımı override et
  Object.defineProperty(window, '_zb_akilli_override', { value: true });
  // (akilliZorluk yeni fonksiyon ile çağrılması için problemleriUret'i güncelleyeceğiz)

  /* --------------------------------------------
     Olay bağlama
     -------------------------------------------- */

  function olaylariBagla() {
    document.querySelectorAll('[data-hedef]').forEach((b) => {
      b.addEventListener('click', () => {
        const hedef = b.getAttribute('data-hedef');
        if (hedef === 'screen-ana' && !OYUN.durum.ilerleme.karsilamaGosterildi) {
          OYUN.durum.ilerleme.karsilamaGosterildi = true;
          durumKaydet(OYUN.durum);
        }
        sesTik();
        showScreen(hedef);
      });
    });

    const sifirlaBtn = document.getElementById('btn-sifirla');
    if (sifirlaBtn) {
      sifirlaBtn.addEventListener('click', () => {
        const onay = confirm('Tüm ilerleme silinecek. Emin misin?');
        if (!onay) return;
        OYUN.durum = durumSifirla();
        durumKaydet(OYUN.durum);
        arayuzGuncelle();
        showScreen('screen-karsilama');
      });
    }

    const tekrarBtn = document.getElementById('btn-tekrar-oyna');
    if (tekrarBtn) {
      tekrarBtn.addEventListener('click', () => {
        sesTik();
        if (oyunDurum.bolumKodu) oyunBaslat(oyunDurum.bolumKodu);
        else if (oyunDurum.bolge) oyunBaslat(oyunDurum.bolge.id);
      });
    }

    // Dolap sekmeleri
    document.querySelectorAll('.dolap-sekme').forEach((s) => {
      s.addEventListener('click', () => {
        dolapAktifKategori = s.dataset.kategori;
        sesTik();
        dolapCiz();
      });
    });

    // Ebeveyn paneli zorluk
    document.querySelectorAll('.eb-zor-btn').forEach((b) => {
      b.addEventListener('click', () => {
        OYUN.durum.ayarlar.zorlukModu = b.dataset.mod;
        durumKaydet(OYUN.durum);
        sesTik();
        ebeveynCiz();
      });
    });

    // Ebeveyn ses anahtarı
    const sesAnh = document.getElementById('eb-ses-anahtar');
    if (sesAnh) {
      sesAnh.addEventListener('change', () => {
        OYUN.durum.ayarlar.ses = sesAnh.checked;
        durumKaydet(OYUN.durum);
      });
    }

    // Sürükle-bırak Bitir butonu
    const surukleBitirBtn = document.getElementById('surukle-bitir');
    if (surukleBitirBtn) {
      surukleBitirBtn.addEventListener('click', () => {
        sesTik();
        surukleBitir();
      });
    }

    // Müzik anahtarı
    const muzikAnh = document.getElementById('eb-muzik-anahtar');
    if (muzikAnh) {
      muzikAnh.checked = !!OYUN.durum.ayarlar.muzik;
      muzikAnh.addEventListener('change', () => {
        OYUN.durum.ayarlar.muzik = muzikAnh.checked;
        durumKaydet(OYUN.durum);
        muzikDurumuYansit();
      });
    }

    // İlk kullanıcı etkileşiminde audio context'i başlat (browser kuralı)
    const audioBaslat = () => {
      const ctx = sesContext();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      muzikDurumuYansit();
      document.removeEventListener('click', audioBaslat);
      document.removeEventListener('touchstart', audioBaslat);
    };
    document.addEventListener('click', audioBaslat, { once: false });
    document.addEventListener('touchstart', audioBaslat, { once: false });

    // Logo / avatara 5 saniye uzun basma → ebeveyn paneli
    const tetikleyiciler = [
      document.querySelector('#screen-ana .kullanici-bilgi'),
      document.querySelector('#screen-yukleme .logo-emoji'),
      document.querySelector('#screen-karsilama .karakter-buyuk')
    ].filter(Boolean);

    tetikleyiciler.forEach((el) => uzunBasmaBagla(el, 1500, () => {
      sesYildiz();
      showScreen('screen-ebeveyn');
      ebeveynCiz();
    }));
  }

  function uzunBasmaBagla(el, sure, callback) {
    let zamanlayici = null;
    let basildiAnda = 0;
    const baslat = (e) => {
      if (e && e.button !== undefined && e.button !== 0) return;
      basildiAnda = Date.now();
      zamanlayici = setTimeout(() => {
        callback();
        zamanlayici = null;
      }, sure);
      // Görsel ipucu için titre
      el.style.transition = `transform ${sure}ms ease-out`;
      el.style.transform = 'scale(0.92)';
    };
    const bitir = () => {
      if (zamanlayici) { clearTimeout(zamanlayici); zamanlayici = null; }
      el.style.transition = '';
      el.style.transform = '';
    };
    el.addEventListener('mousedown', baslat);
    el.addEventListener('touchstart', baslat, { passive: true });
    el.addEventListener('mouseup', bitir);
    el.addEventListener('mouseleave', bitir);
    el.addEventListener('touchend', bitir);
    el.addEventListener('touchcancel', bitir);
  }

  /* --------------------------------------------
     Service Worker
     -------------------------------------------- */

  function serviceWorkerKaydet() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((kayit) => console.info('[Sihirli Bahçe] Service Worker kaydedildi:', kayit.scope))
        .catch((e) => console.warn('[Sihirli Bahçe] Service Worker hatası:', e));
    });
  }

  /* --------------------------------------------
     Açılış
     -------------------------------------------- */

  const OYUN = { durum: null };

  function basla() {
    OYUN.durum = durumYukle();
    if (!OYUN.durum.ilerleme.bolgeler || !OYUN.durum.ilerleme.bolgeler[1]) {
      OYUN.durum.ilerleme.bolgeler = OYUN.durum.ilerleme.bolgeler || {};
      OYUN.durum.ilerleme.bolgeler[1] = { acik: true, yildiz: 0, tamamlandi: false };
    }
    durumKaydet(OYUN.durum);

    arayuzGuncelle();
    olaylariBagla();

    setTimeout(() => {
      showScreen(OYUN.durum.ilerleme.karsilamaGosterildi ? 'screen-ana' : 'screen-karsilama');
    }, 1400);

    serviceWorkerKaydet();
  }

  window.SihirliBahce = {
    showScreen,
    durumYukle,
    durumKaydet,
    durumSifirla: () => { OYUN.durum = durumSifirla(); durumKaydet(OYUN.durum); arayuzGuncelle(); },
    bolumeBasla: oyunBaslat,
    OYUN
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', basla);
  } else {
    basla();
  }
})();
